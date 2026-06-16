"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type Axis = "X" | "Y" | "Z";

export default function CrossSectionViewer({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: Any;
    scene: Any;
    camera: Any;
    controls: Any;
    animFrame: number;
    plane: Any;
    THREE: Any;
    modelBox: { min: Any; max: Any } | null;
  } | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [axis, setAxis] = useState<Axis>("X");
  const [sliderVal, setSliderVal] = useState(50); // 0–100 percentage

  /* Derive plane constant from slider + axis + model bounds */
  const applyClip = useCallback((axisArg: Axis, pct: number) => {
    const s = stateRef.current;
    if (!s || !s.plane || !s.modelBox) return;
    const { min, max } = s.modelBox;
    const axisKey = axisArg.toLowerCase() as "x" | "y" | "z";
    const lo = min[axisKey];
    const hi = max[axisKey];
    // plane normal points in positive axis dir; constant = -position along normal
    // We clip everything on the positive side of the plane
    const pos = lo + (hi - lo) * (pct / 100);
    s.plane.normal.set(
      axisArg === "X" ? -1 : 0,
      axisArg === "Y" ? -1 : 0,
      axisArg === "Z" ? -1 : 0
    );
    s.plane.constant = pos;
  }, []);

  /* Bootstrap Three.js */
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    let alive = true;

    (async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js" as never
        ) as { GLTFLoader: new () => Any };
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js" as never
        ) as { OrbitControls: new (cam: Any, el: HTMLElement) => Any };

        if (!alive) return;

        /* Renderer */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(el.clientWidth, el.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.localClippingEnabled = true;
        el.appendChild(renderer.domElement);

        /* Clipping plane (starts at X axis, cuts from right) */
        const plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

        /* Scene + lights */
        const scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xfff8f0, 1.4));
        const sun = new THREE.DirectionalLight(0xffffff, 2.8);
        sun.position.set(4, 8, 5);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0xd0e8ff, 0.9);
        fill.position.set(-6, -2, -4);
        scene.add(fill);

        /* Camera + controls */
        const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.001, 2000);
        camera.position.set(0, 0.5, 3);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;

        /* Load model */
        const loader = new GLTFLoader();
        loader.load(
          src,
          (gltf: { scene: Any }) => {
            if (!alive) return;
            const model = gltf.scene;

            /* Center */
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);
            scene.add(model);

            /* Apply clipping plane to all materials */
            model.traverse((child: Any) => {
              if (child.isMesh) {
                const mats = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                mats.forEach((m: Any) => {
                  m.clippingPlanes = [plane];
                  m.clipShadows = true;
                  m.side = THREE.DoubleSide; // show inner faces when cut
                });
              }
            });

            /* Fit camera */
            const size = box.getSize(new THREE.Vector3()).length();
            camera.position.set(size * 0.6, size * 0.4, size * 1.1);
            controls.maxDistance = size * 6;
            controls.minDistance = size * 0.15;
            controls.update();

            const recenteredBox = new THREE.Box3().setFromObject(model);

            stateRef.current = {
              renderer, scene, camera, controls, animFrame: 0,
              plane, THREE,
              modelBox: { min: recenteredBox.min, max: recenteredBox.max },
            };

            /* Init slider to middle */
            applyClip("X", 50);

            /* Render loop */
            const animate = () => {
              if (!alive) return;
              stateRef.current!.animFrame = requestAnimationFrame(animate);
              controls.update();
              renderer.render(scene, camera);
            };
            animate();

            setReady(true);
          },
          undefined,
          (err: unknown) => { console.error("GLB load error:", err); setError(true); }
        );

        /* Resize */
        const onResize = () => {
          if (!el || !stateRef.current) return;
          camera.aspect = el.clientWidth / el.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(el.clientWidth, el.clientHeight);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);

      } catch (e) {
        console.error(e);
        setError(true);
      }
    })();

    return () => {
      alive = false;
      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.animFrame);
        stateRef.current.renderer.dispose();
        stateRef.current.controls.dispose();
      }
      el.innerHTML = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  /* Sync axis + slider → clipping plane */
  useEffect(() => {
    applyClip(axis, sliderVal);
  }, [axis, sliderVal, applyClip]);

  return (
    <div className="absolute inset-0 bg-[#030303]" style={{ zIndex: 20 }}>
      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0" />

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
          <span className="text-[10px] tracking-[0.2em] text-[#5a4a30]"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            MODEL UNAVAILABLE
          </span>
        </div>
      )}

      {/* Controls overlay */}
      {ready && (
        <>
          {/* Top-left label */}
          <div className="absolute top-4 left-4 text-[9px] tracking-[0.2em] text-[#4a3824] z-10"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            CROSS-SECTION · DRAG TO ORBIT
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 z-10 pointer-events-none">
            {/* Axis selector */}
            <div className="flex gap-1 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
              {(["X", "Y", "Z"] as Axis[]).map((a) => (
                <button
                  key={a}
                  onClick={() => { setAxis(a); applyClip(a, sliderVal); }}
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
                  type="range" min={0} max={100} step={0.5}
                  value={sliderVal}
                  onChange={(e) => setSliderVal(parseFloat(e.target.value))}
                  className="w-32 accent-[#c4a97e] cursor-pointer"
                />
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-[9px] tracking-[0.15em] border border-[#2e2010] text-[#4a3824] hover:border-[#c4a97e] hover:text-[#c4a97e] transition-all duration-150">
                CLOSE ✕
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
