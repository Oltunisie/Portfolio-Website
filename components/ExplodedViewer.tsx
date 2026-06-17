"use client";

import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type PartData = {
  obj:    Any;   // THREE.Object3D
  origin: Any;   // THREE.Vector3 — assembled position
  target: Any;   // THREE.Vector3 — exploded position
};

export default function ExplodedViewer({
  src,
  exploded,
  onLoad,
}: {
  src:      string;
  exploded: boolean;
  onLoad?:  () => void;
}) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // progress: 0 = assembled, 1 = fully exploded (spring-animated)
  const progressRef = useRef(0);
  const targetRef   = useRef(0);
  const partsRef    = useRef<PartData[]>([]);

  const [status, setStatus] = useState("INITIALIZING…");
  const [ready,  setReady]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) { console.error("[ExplodedViewer] mountRef is null"); return; }
    let alive = true;
    let animFrame = 0;

    const log = (msg: string) => {
      console.log(`[ExplodedViewer] ${msg}`);
      if (alive) setStatus(msg);
    };
    const fail = (msg: string, raw?: unknown) => {
      console.error(`[ExplodedViewer] FAIL: ${msg}`, raw ?? "");
      if (alive) setError(msg);
    };

    (async () => {
      try {
        log("Importing three…");
        const THREE = await import("three");
        if (!alive) return;

        log("Importing GLTFLoader…");
        const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js" as never) as {
          GLTFLoader: new () => {
            load(url: string, ok: (g: Any) => void, prog: undefined, err: (e: Any) => void): void;
          };
        };
        if (!alive) return;

        log("Importing OrbitControls…");
        const { OrbitControls } = await import("three/addons/controls/OrbitControls.js" as never) as {
          OrbitControls: new (cam: Any, dom: HTMLElement) => {
            enableDamping: boolean; dampingFactor: number; autoRotate: boolean; autoRotateSpeed: number;
            maxDistance: number; minDistance: number;
            update(): void; dispose(): void;
          };
        };
        if (!alive) return;

        log("Importing DRACOLoader…");
        const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js" as never) as {
          DRACOLoader: new () => { setDecoderPath(p: string): void; dispose(): void };
        };
        if (!alive) return;

        log(`Canvas size: ${el.clientWidth}×${el.clientHeight}`);
        if (el.clientWidth === 0 || el.clientHeight === 0) {
          fail("Container has zero size — layout not ready");
          return;
        }

        log("Creating WebGLRenderer…");
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(el.clientWidth, el.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        el.appendChild(renderer.domElement);
        log("Renderer mounted");

        const scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xfff8f0, 1.2));
        const sun = new THREE.DirectionalLight(0xffffff, 2.5);
        sun.position.set(4, 8, 5);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0xd0e8ff, 0.8);
        fill.position.set(-6, -2, -4);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0xfff0d0, 0.4);
        rim.position.set(0, -5, 6);
        scene.add(rim);

        const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.001, 2000);
        camera.position.set(0, 0.5, 3);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping  = true;
        controls.dampingFactor  = 0.06;
        controls.autoRotate     = true;
        controls.autoRotateSpeed = 0.6;

        log("Attaching DRACOLoader (decoder from gstatic CDN)…");
        const draco = new DRACOLoader();
        draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

        log(`Fetching GLB: ${src}`);
        const loader = new GLTFLoader();
        (loader as Any).setDRACOLoader(draco);
        loader.load(
          src,
          (gltf: Any) => {
            if (!alive) return;
            log("GLB loaded OK");

            const model = gltf.scene;

            // ── Count nodes / meshes ──────────────────────────────
            let nodeCount = 0;
            let meshCount = 0;
            model.traverse((c: Any) => {
              nodeCount++;
              if (c.isMesh) meshCount++;
            });
            log(`Scene has ${nodeCount} nodes, ${meshCount} meshes`);

            if (meshCount === 0) {
              fail("GLB has 0 meshes — nothing to explode");
              return;
            }

            // ── Center model ──────────────────────────────────────
            const box    = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);
            scene.add(model);

            const size = box.getSize(new THREE.Vector3()).length();
            log(`Model size: ${size.toFixed(3)}`);

            camera.position.set(0, size * 0.15, size * 0.95);
            controls.maxDistance = size * 6;
            controls.minDistance = size * 0.2;

            // ── Find explodable parts ─────────────────────────────
            // Strategy: walk hierarchy to find the level with the most
            // mesh-containing children. Fall back to individual meshes.
            const hasMesh = (obj: Any): boolean =>
              obj.isMesh || (obj.children ?? []).some(hasMesh);

            const childrenWithMeshes = (obj: Any): Any[] =>
              (obj.children ?? []).filter(hasMesh);

            let best: Any[] = [];
            let queue: Any[] = [model];
            for (let depth = 0; depth < 12; depth++) {
              const next: Any[] = [];
              for (const node of queue) {
                const kids = childrenWithMeshes(node);
                if (kids.length > best.length) best = kids;
                next.push(...kids);
              }
              if (next.length === 0) break;
              queue = next;
            }
            log(`Best hierarchy level: ${best.length} parts`);

            // If only one group found, go to individual meshes
            if (best.length <= 1) {
              const meshes: Any[] = [];
              model.traverse((c: Any) => { if (c.isMesh) meshes.push(c); });
              log(`Falling back to ${meshes.length} individual meshes`);
              best = meshes.length > 1 ? meshes : best;
            }

            if (best.length === 0) {
              fail("Could not find any explodable parts in this GLB");
              return;
            }

            log(`Exploding ${best.length} parts`);

            // ── Compute explosion vectors ─────────────────────────
            const sceneCtr = new THREE.Vector3();
            new THREE.Box3().setFromObject(model).getCenter(sceneCtr);
            const explodeDistance = size * 0.85;

            const parts: PartData[] = best.map((part: Any, i: number) => {
              const pb = new THREE.Box3().setFromObject(part);
              const pc = new THREE.Vector3();
              pb.getCenter(pc);

              let dir = pc.clone().sub(sceneCtr);
              if (dir.length() < 0.0001) {
                // Part sits exactly at center — give it a pseudo-random direction
                const angle = (i / best.length) * Math.PI * 2;
                dir = new THREE.Vector3(Math.cos(angle), (i % 3) - 1, Math.sin(angle));
              }
              dir.normalize();

              return {
                obj:    part,
                origin: part.position.clone(),
                target: part.position.clone().addScaledVector(dir, explodeDistance),
              };
            });

            partsRef.current = parts;
            log(`Part vectors computed (explode distance: ${explodeDistance.toFixed(3)})`);

            // ── Render loop ───────────────────────────────────────
            const animate = () => {
              if (!alive) return;
              animFrame = requestAnimationFrame(animate);

              // Spring toward target (0 = assembled, 1 = exploded)
              progressRef.current += (targetRef.current - progressRef.current) * 0.055;

              for (const { obj, origin, target } of partsRef.current) {
                obj.position.lerpVectors(origin, target, progressRef.current);
              }

              controls.update();
              renderer.render(scene, camera);
            };
            animate();

            log("READY");
            setReady(true);
            onLoad?.();
          },
          undefined,
          (err: Any) => {
            fail(`GLB load error: ${err?.message ?? String(err)}`, err);
          },
        );

        const onResize = () => {
          if (!el) return;
          camera.aspect = el.clientWidth / el.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(el.clientWidth, el.clientHeight);
        };
        window.addEventListener("resize", onResize);

        cleanupRef.current = () => {
          window.removeEventListener("resize", onResize);
          cancelAnimationFrame(animFrame);
          renderer.dispose();
          controls.dispose();
          if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };

      } catch (e) {
        fail(`Unexpected error: ${(e as Error)?.message ?? String(e)}`, e);
      }
    })();

    return () => {
      alive = false;
      cleanupRef.current?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Sync exploded prop → animation target without re-mounting
  useEffect(() => {
    targetRef.current = exploded ? 1 : 0;
    console.log(`[ExplodedViewer] target set to ${targetRef.current}`);
  }, [exploded]);

  return (
    <div className="relative w-full h-full bg-[#030303] overflow-hidden">
      {/* Three.js canvas target */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Loading spinner with live step label */}
      {!ready && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
          <div className="w-5 h-5 border-2 border-[#c4a97e] border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] tracking-[0.3em] text-[#c4a97e] max-w-xs text-center"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            {status}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none px-10">
          <span className="text-[10px] tracking-[0.25em] text-red-400"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            LOAD ERROR
          </span>
          <span className="text-[9px] text-[#5a3030] text-center leading-relaxed"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            {error}
          </span>
          <span className="text-[8px] text-[#3a2020] tracking-widest"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            CHECK CONSOLE FOR DETAILS
          </span>
        </div>
      )}
    </div>
  );
}
