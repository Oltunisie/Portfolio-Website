"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Axis = "X" | "Y" | "Z";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export default function CrossSectionViewer({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const [status,    setStatus]    = useState("INITIALIZING…");
  const [ready,     setReady]     = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [axis,      setAxis]      = useState<Axis>("X");
  const [sliderVal, setSliderVal] = useState(50);

  // Shared mutable refs so axis/slider changes can update the live scene
  const planeRef  = useRef<Any>(null);
  const boundsRef = useRef<{ min: Any; max: Any } | null>(null);

  const applyClip = useCallback((a: Axis, pct: number) => {
    if (!planeRef.current || !boundsRef.current) return;
    const { min, max } = boundsRef.current;
    const lo = a === "X" ? min.x : a === "Y" ? min.y : min.z;
    const hi = a === "X" ? max.x : a === "Y" ? max.y : max.z;
    const pos = lo + (hi - lo) * (pct / 100);
    planeRef.current.normal.set(
      a === "X" ? -1 : 0,
      a === "Y" ? -1 : 0,
      a === "Z" ? -1 : 0,
    );
    planeRef.current.constant = pos;
    console.log(`[CrossSection] clip axis=${a} pct=${pct.toFixed(1)} pos=${pos.toFixed(3)}`);
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) { console.error("[CrossSection] mountRef is null"); return; }
    let alive = true;
    let animFrame = 0;

    const log = (msg: string) => {
      console.log(`[CrossSection] ${msg}`);
      if (alive) setStatus(msg);
    };
    const fail = (msg: string, raw?: unknown) => {
      console.error(`[CrossSection] FAIL: ${msg}`, raw ?? "");
      if (alive) setError(msg);
    };

    (async () => {
      try {
        log("Importing three…");
        const THREE = await import("three");
        if (!alive) return;

        log("Importing GLTFLoader…");
        const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js" as never) as {
          GLTFLoader: new () => { load(url: string, ok: (g: Any) => void, prog: undefined, err: (e: Any) => void): void };
        };
        if (!alive) return;

        log("Importing OrbitControls…");
        const { OrbitControls } = await import("three/addons/controls/OrbitControls.js" as never) as {
          OrbitControls: new (cam: Any, dom: HTMLElement) => {
            enableDamping: boolean; dampingFactor: number;
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
        renderer.toneMappingExposure = 1.1;
        renderer.localClippingEnabled = true;   // REQUIRED for clipping planes
        el.appendChild(renderer.domElement);
        log("Renderer mounted");

        const scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xfff8f0, 1.4));
        const sun = new THREE.DirectionalLight(0xffffff, 2.8);
        sun.position.set(4, 8, 5);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0xd0e8ff, 0.9);
        fill.position.set(-6, -2, -4);
        scene.add(fill);

        const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.001, 2000);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;

        // Clipping plane — normal + constant define the cut position
        const plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
        planeRef.current = plane;

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

            // Count nodes & meshes for diagnostics
            let nodeCount = 0;
            let meshCount = 0;
            model.traverse((c: Any) => {
              nodeCount++;
              if (c.isMesh) meshCount++;
            });
            log(`Scene has ${nodeCount} nodes, ${meshCount} meshes`);

            if (meshCount === 0) {
              fail("GLB has 0 meshes — nothing to clip");
              return;
            }

            // Center the model
            const rawBox = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            rawBox.getCenter(center);
            model.position.sub(center);
            scene.add(model);

            // Apply clipping plane to every mesh material
            model.traverse((child: Any) => {
              if (child.isMesh) {
                const mats: Any[] = Array.isArray(child.material)
                  ? child.material : [child.material];
                mats.forEach((m: Any) => {
                  m.clippingPlanes = [plane];
                  m.clipShadows    = true;
                  m.side           = THREE.DoubleSide;  // show back faces inside cut
                  m.needsUpdate    = true;
                });
              }
            });
            log(`Clipping plane applied to ${meshCount} meshes`);

            // Compute bounds for slider mapping
            const bounds = new THREE.Box3().setFromObject(model);
            boundsRef.current = { min: bounds.min.clone(), max: bounds.max.clone() };
            log(`Bounds X:[${bounds.min.x.toFixed(2)},${bounds.max.x.toFixed(2)}] Y:[${bounds.min.y.toFixed(2)},${bounds.max.y.toFixed(2)}] Z:[${bounds.min.z.toFixed(2)},${bounds.max.z.toFixed(2)}]`);

            const size = bounds.getSize(new THREE.Vector3()).length();
            camera.position.set(size * 0.6, size * 0.4, size * 1.1);
            controls.maxDistance = size * 6;
            controls.minDistance = size * 0.15;
            controls.update();

            // Initial clip at 50% along X
            applyClip("X", 50);

            const animate = () => {
              if (!alive) return;
              animFrame = requestAnimationFrame(animate);
              controls.update();
              renderer.render(scene, camera);
            };
            animate();

            log("READY");
            setReady(true);
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

  // Sync slider + axis → clipping plane whenever they change
  useEffect(() => { applyClip(axis, sliderVal); }, [axis, sliderVal, applyClip]);

  return (
    <div className="absolute inset-0 bg-[#030303]" style={{ zIndex: 20 }}>
      {/* Three.js canvas target */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Loading spinner with live status */}
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

      {/* Top label */}
      <div className="absolute top-4 left-4 text-[9px] tracking-[0.2em] text-[#2a1f10] z-10 pointer-events-none"
        style={{ fontFamily: "var(--font-geist-mono)" }}>
        CROSS-SECTION · DRAG TO ORBIT · SCROLL TO ZOOM
      </div>

      {/* Bottom controls — always rendered so CLOSE works even on error */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 z-10 pointer-events-none">
        {/* Axis selector */}
        <div className="flex gap-1 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
          {(["X", "Y", "Z"] as Axis[]).map((a) => (
            <button key={a}
              onClick={() => setAxis(a)}
              className={`px-3 py-1.5 text-[9px] tracking-[0.15em] border transition-all duration-150 ${
                axis === a
                  ? "border-[#c4a97e] text-[#c4a97e] bg-[#c4a97e]/10"
                  : "border-[#2e2010] text-[#4a3824] hover:border-[#c4a97e] hover:text-[#c4a97e]"
              }`}>
              {a}-AXIS
            </button>
          ))}
        </div>

        {/* Slider + close */}
        <div className="flex items-center gap-4 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
          <div className="flex items-center gap-2">
            <span className="text-[8px] tracking-[0.15em] text-[#4a3824]">SECTION</span>
            <input
              type="range" min={0} max={100} step={0.5} value={sliderVal}
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
              className="w-32 accent-[#c4a97e] cursor-pointer"
            />
          </div>
          <button onClick={onClose}
            className="px-3 py-1.5 text-[9px] tracking-[0.15em] border border-[#2e2010] text-[#4a3824] hover:border-[#c4a97e] hover:text-[#c4a97e] transition-all duration-150">
            CLOSE ✕
          </button>
        </div>
      </div>
    </div>
  );
}
