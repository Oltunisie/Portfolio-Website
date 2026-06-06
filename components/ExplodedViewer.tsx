"use client";

import { useEffect, useRef, useState } from "react";

type PartData = {
  obj: THREE_Object3D;
  origin: THREE_Vector3;
  target: THREE_Vector3;
};

// Loose types so we don't need full Three.js type imports at compile time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type THREE_Object3D = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type THREE_Vector3  = any;

interface ViewerState {
  renderer:       unknown;
  camera:         unknown;
  controls:       unknown;
  parts:          PartData[];
  animFrame:      number;
  progress:       number;   // current (animated)
  target:         number;   // 0 = assembled, 1 = exploded
}

/* Walk the scene to find the best level to explode:
   the first level that has ≥2 children containing meshes */
function findExplodableParts(scene: THREE_Object3D): THREE_Object3D[] {
  function hasMesh(obj: THREE_Object3D): boolean {
    if (obj.isMesh) return true;
    return obj.children.some((c: THREE_Object3D) => hasMesh(c));
  }

  let current: THREE_Object3D[] = [scene];

  for (let depth = 0; depth < 8; depth++) {
    if (current.length > 1) return current;
    const children = current[0].children.filter(hasMesh);
    if (children.length === 0) return current;
    if (children.length > 1) return children;
    current = children;
  }
  return current;
}

export default function ExplodedViewer({
  src, exploded, onLoad,
}: {
  src:      string;
  exploded: boolean;
  onLoad?:  () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ViewerState | null>(null);
  const [ready,  setReady]  = useState(false);
  const [error,  setError]  = useState(false);

  /* ── Bootstrap Three.js ───────────────────────────────────────── */
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    let alive = true;

    (async () => {
      try {
        const THREE      = await import("three");
        const { GLTFLoader }    = await import("three/addons/loaders/GLTFLoader.js" as never) as { GLTFLoader: new () => { load: (...a: unknown[]) => void } };
        const { OrbitControls } = await import("three/addons/controls/OrbitControls.js" as never) as { OrbitControls: new (cam: unknown, dom: HTMLElement) => unknown & { enableDamping: boolean; dampingFactor: number; autoRotate: boolean; autoRotateSpeed: number; update(): void; dispose(): void } };

        if (!alive) return;

        /* ── Renderer ── */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(el.clientWidth, el.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        el.appendChild(renderer.domElement);

        /* ── Scene + Lights ── */
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

        /* ── Camera ── */
        const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.001, 2000);
        camera.position.set(0, 0.5, 3);

        /* ── Controls ── */
        const controls = new OrbitControls(camera, renderer.domElement);
        (controls as { enableDamping: boolean }).enableDamping = true;
        (controls as { dampingFactor: number }).dampingFactor = 0.06;
        (controls as { autoRotate: boolean }).autoRotate = true;
        (controls as { autoRotateSpeed: number }).autoRotateSpeed = 0.6;

        /* ── Load GLB ── */
        const loader = new GLTFLoader();
        loader.load(src, (gltf: { scene: THREE_Object3D }) => {
          if (!alive) return;

          const model = gltf.scene;

          /* ── Fix missing / white materials ── */
          const PALETTE = [
            { color: 0x8a9ab5, metalness: 0.85, roughness: 0.25 }, // aluminium blue-grey
            { color: 0x6b7d8f, metalness: 0.90, roughness: 0.20 }, // dark steel
            { color: 0xc4a97e, metalness: 0.60, roughness: 0.40 }, // brass / fitting
            { color: 0x9baab8, metalness: 0.80, roughness: 0.30 }, // light aluminium
            { color: 0x4a5568, metalness: 0.70, roughness: 0.35 }, // anodised dark
            { color: 0xb0b8c4, metalness: 0.75, roughness: 0.28 }, // polished alu
          ];
          let paletteIdx = 0;
          const matMap = new Map<string, unknown>();

          model.traverse((child: THREE_Object3D) => {
            if (!child.isMesh) return;
            const mat = child.material as THREE_Object3D;
            const isWhiteOrMissing = !mat
              || (mat.color
                && mat.color.r > 0.85
                && mat.color.g > 0.85
                && mat.color.b > 0.85
                && !mat.map);
            if (!isWhiteOrMissing) return;

            // Group meshes by their parent name so related parts share a colour
            const key = child.parent?.name ?? `part_${paletteIdx}`;
            if (!matMap.has(key)) {
              const p = PALETTE[paletteIdx % PALETTE.length];
              paletteIdx++;
              matMap.set(key, new THREE.MeshStandardMaterial({
                color:     p.color,
                metalness: p.metalness,
                roughness: p.roughness,
              }));
            }
            child.material = matMap.get(key);
          });

          /* ── Center model ── */
          const box    = new THREE.Box3().setFromObject(model);
          const center = new THREE.Vector3();
          box.getCenter(center);
          model.position.sub(center);
          scene.add(model);

          /* Fit camera */
          const size = box.getSize(new THREE.Vector3()).length();
          camera.position.set(0, size * 0.25, size * 1.8);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (controls as any).maxDistance = size * 6;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (controls as any).minDistance = size * 0.2;

          /* Find explodable parts */
          const rawParts = findExplodableParts(model);

          /* Scene center for explosion directions */
          const sceneCtr = new THREE.Vector3();
          new THREE.Box3().setFromObject(model).getCenter(sceneCtr);

          const parts: PartData[] = rawParts.map((part: THREE_Object3D) => {
            const pb  = new THREE.Box3().setFromObject(part);
            const pc  = new THREE.Vector3();
            pb.getCenter(pc);

            let dir = pc.clone().sub(sceneCtr);
            if (dir.length() < 0.0001) {
              dir = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5,
              );
            }
            dir.normalize();

            const explodeDistance = size * 0.55;

            return {
              obj:    part,
              origin: part.position.clone(),
              target: part.position.clone().addScaledVector(dir, explodeDistance),
            };
          });

          const state: ViewerState = {
            renderer, camera, controls, parts,
            animFrame: 0,
            progress: 0,
            target:   0,
          };
          stateRef.current = state;

          /* ── Render loop ── */
          const animate = () => {
            if (!alive) return;
            state.animFrame = requestAnimationFrame(animate);

            /* Spring-like lerp toward target */
            state.progress += (state.target - state.progress) * 0.055;

            state.parts.forEach(({ obj, origin, target }) => {
              obj.position.lerpVectors(origin, target, state.progress);
            });

            (controls as { update(): void }).update();
            renderer.render(scene, camera);
          };
          animate();

          setReady(true);
          onLoad?.();
        },
        undefined,
        () => { setError(true); });

        /* ── Resize ── */
        const onResize = () => {
          if (!el || !stateRef.current) return;
          const { camera: cam, renderer: ren } = stateRef.current as { camera: { aspect: number; updateProjectionMatrix(): void }; renderer: { setSize(w: number, h: number): void } };
          cam.aspect = el.clientWidth / el.clientHeight;
          cam.updateProjectionMatrix();
          ren.setSize(el.clientWidth, el.clientHeight);
        };
        window.addEventListener("resize", onResize);

        /* Store cleanup handles */
        if (!stateRef.current) {
          stateRef.current = { renderer, camera, controls, parts: [], animFrame: 0, progress: 0, target: 0 };
        }
        return () => window.removeEventListener("resize", onResize);

      } catch {
        setError(true);
      }
    })();

    return () => {
      alive = false;
      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.animFrame);
        (stateRef.current.renderer as { dispose(): void }).dispose();
        (stateRef.current.controls as { dispose(): void }).dispose();
      }
      el.innerHTML = "";
    };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sync explode state → animation target ───────────────────── */
  useEffect(() => {
    if (stateRef.current) stateRef.current.target = exploded ? 1 : 0;
  }, [exploded]);

  return (
    <div className="relative w-full h-full bg-[#030303]">
      <div ref={mountRef} className="w-full h-full" />

      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] tracking-[0.3em] text-[#c4a97e] animate-pulse"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            LOADING MODEL…
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] tracking-[0.2em] text-[#3a2e1e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            MODEL UNAVAILABLE
          </span>
        </div>
      )}
    </div>
  );
}
