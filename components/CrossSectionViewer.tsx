"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Axis = "X" | "Y" | "Z";

interface SceneState {
  renderer:  THREE.WebGLRenderer;
  camera:    THREE.PerspectiveCamera;
  controls:  OrbitControls;
  plane:     THREE.Plane;
  animFrame: number;
  bounds:    THREE.Box3;
}

export default function CrossSectionViewer({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const stateRef  = useRef<SceneState | null>(null);

  const [ready,    setReady]    = useState(false);
  const [error,    setError]    = useState(false);
  const [axis,     setAxis]     = useState<Axis>("X");
  const [sliderVal, setSliderVal] = useState(50);

  /* Move clipping plane to match slider + axis */
  const applyClip = useCallback((a: Axis, pct: number) => {
    const s = stateRef.current;
    if (!s) return;
    const lo = a === "X" ? s.bounds.min.x : a === "Y" ? s.bounds.min.y : s.bounds.min.z;
    const hi = a === "X" ? s.bounds.max.x : a === "Y" ? s.bounds.max.y : s.bounds.max.z;
    const pos = lo + (hi - lo) * (pct / 100);
    s.plane.normal.set(
      a === "X" ? -1 : 0,
      a === "Y" ? -1 : 0,
      a === "Z" ? -1 : 0,
    );
    s.plane.constant = pos;
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let alive = true;

    /* ── Renderer ─────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.localClippingEnabled = true;
    el.appendChild(renderer.domElement);

    /* ── Scene + lights ───────────────────────────────── */
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xfff8f0, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 2.8);
    sun.position.set(4, 8, 5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.9);
    fill.position.set(-6, -2, -4);
    scene.add(fill);

    /* ── Camera + controls ────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.001, 2000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    /* ── Clipping plane ───────────────────────────────── */
    const plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

    /* ── Load GLB ─────────────────────────────────────── */
    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        if (!alive) return;

        const model = gltf.scene;

        /* Center model */
        const rawBox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        rawBox.getCenter(center);
        model.position.sub(center);
        scene.add(model);

        /* Apply clipping plane to every mesh material */
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              m.clippingPlanes = [plane];
              m.clipShadows = true;
              m.side = THREE.DoubleSide;
            });
          }
        });

        /* Fit camera to model */
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3()).length();
        camera.position.set(size * 0.6, size * 0.4, size * 1.1);
        controls.maxDistance = size * 6;
        controls.minDistance = size * 0.15;
        controls.update();

        stateRef.current = { renderer, camera, controls, plane, animFrame: 0, bounds };

        /* Init slider at 50% */
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
      (err) => {
        console.error("CrossSection GLB load error:", err);
        setError(true);
      },
    );

    /* ── Resize ───────────────────────────────────────── */
    const onResize = () => {
      if (!el || !stateRef.current) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.animFrame);
        stateRef.current.renderer.dispose();
        stateRef.current.controls.dispose();
      }
      el.innerHTML = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  /* Sync slider + axis → clipping plane */
  useEffect(() => { applyClip(axis, sliderVal); }, [axis, sliderVal, applyClip]);

  return (
    <div className="absolute inset-0 bg-[#030303]" style={{ zIndex: 20 }}>
      <div ref={mountRef} className="absolute inset-0" />

      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] tracking-[0.3em] text-[#c4a97e] animate-pulse"
            style={{ fontFamily: "var(--font-geist-mono)" }}>LOADING MODEL…</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] tracking-[0.2em] text-[#5a4a30]"
            style={{ fontFamily: "var(--font-geist-mono)" }}>MODEL UNAVAILABLE</span>
        </div>
      )}

      {ready && (
        <>
          <div className="absolute top-4 left-4 text-[9px] tracking-[0.2em] text-[#4a3824] z-10"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            CROSS-SECTION · DRAG TO ORBIT
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 z-10 pointer-events-none">
            {/* Axis selector */}
            <div className="flex gap-1 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
              {(["X", "Y", "Z"] as Axis[]).map((a) => (
                <button key={a}
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
                <input type="range" min={0} max={100} step={0.5} value={sliderVal}
                  onChange={(e) => setSliderVal(parseFloat(e.target.value))}
                  className="w-32 accent-[#c4a97e] cursor-pointer" />
              </div>
              <button onClick={onClose}
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
