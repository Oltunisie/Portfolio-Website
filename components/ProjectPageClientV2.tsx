"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";
import { track } from "@/lib/track";

const ModelViewer        = dynamic(() => import("./ModelViewer"),        { ssr: false });
const ExplodedViewer     = dynamic(() => import("./ExplodedViewer"),     { ssr: false });
const CrossSectionViewer = dynamic(() => import("./CrossSectionViewer"), { ssr: false });
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isVideoFile = (f: string) => /\.(mp4|webm|mov)$/i.test(f);

/* ─── Redacted-decode animation ─────────────────────────────── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░";
function useDecrypt(value: string, redacted: boolean) {
  const [display, setDisplay] = useState(redacted ? "██████████" : value);
  const [revealed, setRevealed] = useState(!redacted);
  const decode = useCallback(() => {
    if (revealed) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        value.split("").map((c, i) =>
          i < iteration ? c : c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join("")
      );
      if (iteration >= value.length) { clearInterval(interval); setRevealed(true); }
      iteration += 0.4;
    }, 35);
  }, [value, revealed]);
  return { display, revealed, decode };
}

/* ─── Spec cell with optional redact effect ──────────────────── */
function SpecCell({ label, value, redacted }: { label: string; value: string; redacted?: boolean }) {
  const { display, revealed, decode } = useDecrypt(value, !!redacted);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!revealed) { decode(); return; }
    navigator.clipboard.writeText(`${label}: ${value}`);
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={decode}
      onClick={copy}
      className="group relative bg-[#050505] hover:bg-[#0c0a06] border border-[#181410] hover:border-[#2e2010] transition-all duration-200 p-5 text-left"
    >
      <p className="text-[9px] tracking-[0.28em] text-[#3a2e1e] group-hover:text-[#c4a97e] transition-colors duration-200 mb-2"
        style={{ fontFamily: "var(--font-geist-mono)" }}>
        {label}
      </p>
      <p className={`text-base font-light transition-colors duration-200 ${revealed ? "text-[#f0e6d3]" : "text-[#c4a97e] tracking-widest"}`}
        style={{ fontFamily: redacted && !revealed ? "var(--font-geist-mono)" : "var(--font-space-grotesk)" }}>
        {display}
      </p>
      {redacted && !revealed && (
        <p className="mt-1 text-[8px] tracking-[0.2em] text-[#3a2e1e]"
          style={{ fontFamily: "var(--font-geist-mono)" }}>
          HOVER TO DECLASSIFY
        </p>
      )}
      {revealed && (
        <div className={`absolute top-3 right-3 text-[8px] tracking-[0.15em] transition-all duration-200 ${
          copied ? "text-[#c4a97e] opacity-100" : "text-[#2a1f10] opacity-0 group-hover:opacity-100"
        }`} style={{ fontFamily: "var(--font-geist-mono)" }}>
          {copied ? "COPIED" : "COPY"}
        </div>
      )}
    </motion.button>
  );
}

/* ─── Image slot (for analysis/tests/integration) ────────────── */
function ImageSlot({ src, caption, onClick }: { src: string; caption?: string; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex-shrink-0 w-[260px] md:w-80"
    >
      <button onClick={onClick} className="group block w-full text-left">
        <div className="overflow-hidden border border-[#181410] group-hover:border-[#2e2010] transition-colors duration-300">
          <img
            src={src} alt={caption ?? ""}
            className="w-full object-cover h-64 md:h-80 transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
        {caption && (
          <p className="mt-2 text-[10px] tracking-[0.12em] text-[#3a2e1e] leading-snug"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            {caption}
          </p>
        )}
      </button>
    </motion.div>
  );
}

/* ─── Fullscreen gallery section ─────────────────────────────── */
function FullGallery({
  title, num, items, slug, onOpen,
}: { title: string; num: string; items: { file: string; caption?: string }[]; slug: string; onOpen: (src: string, alt: string) => void }) {
  if (!items.length) return null;
  return (
    <section className="py-20">
      <div className="px-6 md:px-16 lg:px-24 mb-8">
        <div className="flex items-center gap-6">
          <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}>// {num}</span>
          <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>{title}</h2>
          <div className="flex-1 h-px bg-[#1a1208]" />
        </div>
      </div>
      {/* Edge-to-edge horizontal strip */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-[2px] px-6 md:px-16 lg:px-24" style={{ width: "max-content" }}>
          {items.map((img, i) => {
            const src = `${BASE}/projects/${slug}/${img.file}`;
            return (
              <ImageSlot key={i} src={src} caption={img.caption}
                onClick={() => onOpen(src, img.caption ?? title)} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center p-6"
      onClick={onClose}>
      <motion.img
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose}
        className="absolute top-6 right-8 text-[#c4a97e] text-xs tracking-[0.2em]"
        style={{ fontFamily: "var(--font-geist-mono)" }}>ESC ✕</button>
    </motion.div>
  );
}

/* ─── 3D Model viewer with controls ─────────────────────────── */
type ViewMode = "model" | "section" | "exploded";

function ModelSection({ src, title, explodedSrc }: { src: string; title: string; explodedSrc?: string }) {
  const [autoRotate,  setAutoRotate]  = useState(true);
  const [exposure,    setExposure]    = useState(0.9);
  const [viewMode,    setViewMode]    = useState<ViewMode>("model");
  const [isExploded,  setIsExploded]  = useState(false);
  const [explRotate,  setExplRotate]  = useState(true);
  const mvRef = useRef<HTMLElement | null>(null);

  const views = [
    { label: "FRONT", orbit: "0deg 75deg 150%"  },
    { label: "TOP",   orbit: "0deg 0deg 150%"   },
    { label: "SIDE",  orbit: "90deg 75deg 150%" },
    { label: "ISO",   orbit: "45deg 60deg 130%" },
  ];
  const setOrbit = (orbit: string) => {
    const mv = mvRef.current as HTMLElement & { cameraOrbit?: string };
    if (mv) mv.cameraOrbit = orbit;
  };

  const closeOverlay = () => { setViewMode("model"); setIsExploded(false); };

  return (
    <section className="py-20">
      <div className="px-6 md:px-16 lg:px-24 mb-8">
        <div className="flex items-center gap-6">
          <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}>// 03</span>
          <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>Systems View</h2>
          <div className="flex-1 h-px bg-[#1a1208]" />
        </div>
      </div>

      <div className="relative mx-6 md:mx-16 lg:mx-24 border border-[#181410] bg-[#030303] h-[560px]">

        {/* model-viewer (hidden in overlay modes) */}
        <div
          ref={(el) => { mvRef.current = el?.querySelector("model-viewer") ?? null; }}
          className="absolute inset-0"
          style={{ visibility: viewMode === "model" ? "visible" : "hidden" }}
        >
          <ModelViewer src={src} alt={`${title} 3D model`} autoRotate={autoRotate} exposure={exposure} />
        </div>

        {/* Cross-section overlay */}
        {viewMode === "section" && (
          <CrossSectionViewer src={src} onClose={closeOverlay} />
        )}

        {/* Exploded view overlay */}
        {viewMode === "exploded" && explodedSrc && (
          <div className="absolute inset-0 bg-[#030303]" style={{ zIndex: 20 }}>
            <ExplodedViewer src={explodedSrc} exploded={isExploded} autoRotate={explRotate} />

            {/* top label */}
            <div className="absolute top-4 left-4 text-[9px] tracking-[0.2em] text-[#2a1f10] z-10"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              EXPLODED VIEW · DRAG TO ORBIT · SCROLL TO ZOOM
            </div>

            {/* controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 z-10"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              <button
                onClick={() => setIsExploded((v) => { if (!v) track("3d-explode-toggle"); return !v; })}
                className={`flex items-center gap-2 px-4 py-2 border text-[9px] tracking-[0.15em] transition-all duration-150 ${
                  isExploded
                    ? "border-[#c4a97e] text-[#c4a97e] bg-[#c4a97e]/10"
                    : "border-[#2e2010] text-[#6b5a3e] hover:border-[#c4a97e] hover:text-[#c4a97e]"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isExploded ? "bg-[#c4a97e] animate-pulse" : "bg-[#3a2e1e]"}`} />
                {isExploded ? "ASSEMBLE" : "EXPLODE"}
              </button>

              <div className="flex items-center gap-3">
                <button onClick={() => setExplRotate((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border text-[9px] tracking-[0.15em] transition-all duration-150 ${
                    explRotate ? "border-[#c4a97e] text-[#c4a97e] bg-[#c4a97e]/10" : "border-[#2e2010] text-[#3a2e1e] hover:border-[#c4a97e] hover:text-[#c4a97e]"
                  }`}>
                  <span className={`w-1 h-1 rounded-full ${explRotate ? "bg-[#c4a97e] animate-pulse" : "bg-[#3a2e1e]"}`} />
                  AUTO-ROTATE
                </button>
                <button onClick={closeOverlay}
                  className="px-3 py-1.5 text-[9px] tracking-[0.15em] border border-[#2e2010] text-[#4a3824] hover:border-[#c4a97e] hover:text-[#c4a97e] transition-all duration-150">
                  CLOSE ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Control overlay, only in model mode */}
        {viewMode === "model" && (
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 pointer-events-none z-10">
            {/* Left: viewpoints + tool buttons */}
            <div className="flex flex-wrap gap-1 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
              {views.map((v) => (
                <button key={v.label} onClick={() => setOrbit(v.orbit)}
                  className="px-3 py-1.5 bg-[#050505]/80 backdrop-blur border border-[#2e2010] hover:border-[#c4a97e] text-[9px] tracking-[0.15em] text-[#6b5a3e] hover:text-[#c4a97e] transition-all duration-150">
                  {v.label}
                </button>
              ))}
              <button onClick={() => { track("3d-cross-section"); setViewMode("section"); }}
                className="px-3 py-1.5 bg-[#050505]/80 backdrop-blur border border-[#2e2010] hover:border-[#c4a97e] text-[9px] tracking-[0.15em] text-[#6b5a3e] hover:text-[#c4a97e] transition-all duration-150">
                ✦ CROSS-SECTION
              </button>
              {explodedSrc && (
                <button onClick={() => { track("3d-exploded-view"); setViewMode("exploded"); }}
                  className="px-3 py-1.5 bg-[#050505]/80 backdrop-blur border border-[#2e2010] hover:border-[#c4a97e] text-[9px] tracking-[0.15em] text-[#6b5a3e] hover:text-[#c4a97e] transition-all duration-150">
                  ✦ EXPLODED VIEW
                </button>
              )}
            </div>

            {/* Right: auto-rotate + exposure */}
            <div className="flex items-center gap-3 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <div className="flex items-center gap-2">
                <span className="text-[8px] tracking-[0.15em] text-[#3a2e1e]">EXPOSURE</span>
                <input type="range" min="0.3" max="2" step="0.05" value={exposure}
                  onChange={(e) => setExposure(parseFloat(e.target.value))}
                  className="w-20 accent-[#c4a97e] cursor-pointer" />
              </div>
              <button onClick={() => setAutoRotate((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-[9px] tracking-[0.15em] transition-all duration-150 ${
                  autoRotate ? "border-[#c4a97e] text-[#c4a97e] bg-[#c4a97e]/10" : "border-[#2e2010] text-[#3a2e1e]"
                }`}>
                <span className={`w-1 h-1 rounded-full ${autoRotate ? "bg-[#c4a97e] animate-pulse" : "bg-[#3a2e1e]"}`} />
                AUTO-ROTATE
              </button>
            </div>
          </div>
        )}

        {/* Corner label */}
        {viewMode === "model" && (
          <div className="absolute top-4 left-4 text-[9px] tracking-[0.2em] text-[#2a1f10] z-10"
            style={{ fontFamily: "var(--font-geist-mono)" }}>
            3D · DRAG TO ORBIT · SCROLL TO ZOOM
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Big stat callout (breaks the layout) ───────────────────── */
function StatCallout({ stats }: { stats: { value: string; unit: string; label: string }[] }) {
  return (
    <div className="py-16 px-6 md:px-16 lg:px-24 flex items-end gap-12 md:gap-20 border-y border-[#0f0d09]">
      {stats.map((s, i) => (
        <div key={i} className="flex items-end gap-4">
          <span className="text-[clamp(3rem,10vw,8rem)] font-extralight text-[#c4a97e] leading-none tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.value}</span>
          <div className="mb-3">
            <div className="text-xl font-light text-[#c4a97e]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.unit}</div>
            <div className="text-[10px] tracking-[0.25em] text-[#7a6a50] mt-1"
              style={{ fontFamily: "var(--font-geist-mono)" }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ProjectPageClientV2({ project }: { project: Project }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);

  const idx  = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[idx - 1] ?? null;
  const next = projects[idx + 1] ?? null;

  const coverImg = project.media?.find((m) => m.type === "image");
  const coverSrc = coverImg?.type === "image"
    ? `${BASE}/projects/${project.slug}/${coverImg.file}` : null;

  const allImages = (project.media ?? []).filter((m) => m.type === "image");

  const modelSrc = project.model3d
    ? `${BASE}/projects/${project.slug}/${project.model3d}` : null;

  const explodedSrc = project.model3dExploded
    ? `${BASE}/projects/${project.slug}/${project.model3dExploded}` : undefined;

  const videos = (project.media ?? []).filter((m) => m.type === "video" || m.type === "youtube");

  const openLightbox = useCallback((src: string, alt: string) => { track("image-lightbox"); setLightbox({ src, alt }); }, []);

  // Build callout stats array (primary + optional secondary)
  const calloutPrimarySpec = project.specs?.find((s) =>
    ["THRUST TARGET", "WINS", "0-g WINDOWS", "ORBIT"].includes(s.label)
  );
  const calloutSecondarySpec = project.specs?.find((s) =>
    ["APOGEE"].includes(s.label)
  );
  const calloutStats = (() => {
    const out: { value: string; unit: string; label: string }[] = [];
    for (const spec of [calloutPrimarySpec, calloutSecondarySpec]) {
      if (!spec) continue;
      const match = spec.value.match(/^([\d,]+)\s*(.*)$/);
      if (match) out.push({ value: match[1], unit: match[2], label: spec.label });
    }
    return out;
  })();

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0e6d3]">

      {/* ── Parallax hero ─────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[70vh] overflow-hidden">
        {coverSrc ? (
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 scale-[1.15]"
          >
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${coverSrc}')` }} />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0a05] to-[#050505]" />
        )}

        {/* Overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.5) 50%, rgba(5,5,5,0.2) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(5,5,5,0.8) 0%, transparent 55%)" }} />

        {/* Back */}
        <Link href="/#projects"
          className="group absolute top-8 left-6 md:left-16 lg:left-24 z-10 inline-flex items-center gap-2 px-4 py-2 bg-[#050505]/70 backdrop-blur border border-[#6b5a3e] hover:border-[#c4a97e] hover:bg-[#c4a97e] text-[11px] tracking-[0.2em] text-[#cabb9f] hover:text-[#080603] rounded-sm transition-colors duration-200"
          style={{ fontFamily: "var(--font-geist-mono)" }}>
          <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span> ALL PROJECTS
        </Link>

        {/* Mission ID */}
        <div className="absolute top-8 right-6 md:right-16 lg:right-24 z-10 text-right"
          style={{ fontFamily: "var(--font-geist-mono)" }}>
          <div className="text-[8px] tracking-[0.3em] text-[#1e1508]">MISSION DOSSIER</div>
          <div className="text-[9px] tracking-[0.2em] text-[#c4a97e] mt-0.5">
            OL-{String(idx + 1).padStart(3, "0")}
          </div>
        </div>

        {/* Title block, spans full bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-12 z-10">
          <div className="flex items-center gap-3 mb-4" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {project.status === "In Progress" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span className="text-[10px] tracking-[0.2em] text-[#6b5a3e]">
              {(project.status ?? "").toUpperCase()}
            </span>
            {project.period && (
              <span className="text-[10px] tracking-[0.15em] text-[#2a1f10]">· {project.period}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-[#f0e6d3] leading-[0.95]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {project.title}
            </h1>
            {/* Tags pushed right */}
            <div className="flex flex-wrap gap-2 md:justify-end md:max-w-xs shrink-0"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              {project.tags.map((t) => (
                <span key={t}
                  className="text-[9px] tracking-[0.15em] text-[#2e2010] border border-[#1a1208] px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Specs grid, full width ────────────────────────────── */}
      {project.specs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#181410]">
          {project.specs.map((s) => (
            <SpecCell key={s.label} label={s.label} value={s.value} redacted={s.redacted} />
          ))}
        </div>
      )}

      {/* ── Big stat callout ──────────────────────────────────── */}
      {calloutStats.length > 0 && <StatCallout stats={calloutStats} />}

      {/* ── Brief, two columns ───────────────────────────────── */}
      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div className="flex items-center gap-6 mb-10">
          <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}>// 01</span>
          <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>Overview</h2>
          <div className="flex-1 h-px bg-[#1a1208]" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-[#a89876] font-light leading-relaxed"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {project.description}
          </motion.p>

          {/* Goals */}
          {project.goals && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3">
              {project.goals.slice(0, 4).map((g, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 text-[#c4a97e] text-[10px] mt-1"
                    style={{ fontFamily: "var(--font-geist-mono)" }}>◆</span>
                  <p className="text-sm text-[#9a8a6a] leading-relaxed"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}>{g}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Featured media band (prominent, near the top) ─────── */}
      {project.featured && (project.featured.video || project.featured.image) && (
        <section className="px-6 md:px-16 lg:px-24 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[2px] bg-[#181410] border border-[#181410]">
            {project.featured.video && (
              <figure className="relative bg-black overflow-hidden">
                <video
                  src={`${BASE}/projects/${project.slug}/${project.featured.video.file}`}
                  className="w-full h-[280px] md:h-[460px] object-cover"
                  autoPlay loop muted playsInline controls
                  onPlay={() => track(`video-play-${project.slug}-featured`)}
                />
                {project.featured.video.caption && (
                  <figcaption className="pointer-events-none absolute bottom-0 inset-x-0 p-4 pt-10 bg-gradient-to-t from-black/80 to-transparent text-[10px] tracking-[0.15em] text-[#cabb9f]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {project.featured.video.caption}
                  </figcaption>
                )}
              </figure>
            )}
            {project.featured.image && (
              <button
                onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${project.featured!.image!.file}`, project.featured!.image!.caption ?? "")}
                className="group relative block bg-black overflow-hidden">
                <img
                  src={`${BASE}/projects/${project.slug}/${project.featured.image.file}`}
                  alt={project.featured.image.caption ?? ""}
                  className="w-full h-[280px] md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {project.featured.image.caption && (
                  <figcaption className="pointer-events-none absolute bottom-0 inset-x-0 p-4 pt-10 bg-gradient-to-t from-black/80 to-transparent text-left text-[10px] tracking-[0.15em] text-[#cabb9f]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {project.featured.image.caption}
                  </figcaption>
                )}
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── Process sections with integrated media ────────────────── */}
      {project.process && project.process.length > 0 && project.process.map((step, stepIdx) => (
        <div key={stepIdx}>
          {/* Section header */}
          <section className="py-16 px-6 md:px-16 lg:px-24">
            <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {step.title}
            </h2>
            <p className="text-lg text-[#d4c5a9] leading-relaxed mt-6"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {step.description}
            </p>
          </section>

          {/* 3D Model for Design section */}
          {stepIdx === 0 && modelSrc && (
            <div className="px-6 md:px-16 lg:px-24 pb-16">
              <ModelSection src={modelSrc} title={project.title} explodedSrc={explodedSrc} />
            </div>
          )}

          {/* Design images */}
          {stepIdx === 0 && project.design && project.design.length > 0 && (
            <section className="px-6 md:px-16 lg:px-24 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.design.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <button onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${img.file}`, img.caption ?? "")}
                      className="group block w-full text-left">
                      <div className="overflow-hidden border border-[#181410] group-hover:border-[#2e2010] transition-colors">
                        <img src={`${BASE}/projects/${project.slug}/${img.file}`} alt={img.caption ?? ""}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      {img.caption && (
                        <p className="mt-2 text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                          style={{ fontFamily: "var(--font-geist-mono)" }}>
                          {img.caption}
                        </p>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Analysis section images */}
          {stepIdx === 1 && project.analysis && project.analysis.length > 0 && (
            <section className="px-6 md:px-16 lg:px-24 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.analysis.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <button onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${img.file}`, img.caption ?? "")}
                      className="group block w-full text-left">
                      <div className="overflow-hidden border border-[#181410] group-hover:border-[#2e2010] transition-colors">
                        <img src={`${BASE}/projects/${project.slug}/${img.file}`} alt={img.caption ?? ""}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      {img.caption && (
                        <p className="mt-2 text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                          style={{ fontFamily: "var(--font-geist-mono)" }}>
                          {img.caption}
                        </p>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Tests section images */}
          {stepIdx === 2 && project.tests && project.tests.length > 0 && (
            <section className="px-6 md:px-16 lg:px-24 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.tests.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    {isVideoFile(img.file) ? (
                      <div>
                        <div className="overflow-hidden border border-[#181410]">
                          <video src={`${BASE}/projects/${project.slug}/${img.file}`} controls
                            className="w-full h-56 object-cover" style={{ background: "#030303" }} />
                        </div>
                        {img.caption && (
                          <p className="mt-2 text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                            style={{ fontFamily: "var(--font-geist-mono)" }}>
                            {img.caption}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${img.file}`, img.caption ?? "")}
                        className="group block w-full text-left">
                        <div className="overflow-hidden border border-[#181410] group-hover:border-[#2e2010] transition-colors">
                          <img src={`${BASE}/projects/${project.slug}/${img.file}`} alt={img.caption ?? ""}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        {img.caption && (
                          <p className="mt-2 text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                            style={{ fontFamily: "var(--font-geist-mono)" }}>
                            {img.caption}
                          </p>
                        )}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Static Fire section with videos (smaller) */}
          {stepIdx === 3 && videos.length > 0 && (
            <section className="px-6 md:px-16 lg:px-24 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((v, i) => (
                  <div key={i}>
                    <div className="border border-[#181410]">
                      {v.type === "youtube" ? (
                        <div className="aspect-video">
                          <iframe src={`https://www.youtube.com/embed/${v.id}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen />
                        </div>
                      ) : v.type === "video" ? (
                        <video src={`${BASE}/projects/${project.slug}/${v.file}`}
                          controls className="w-full" style={{ background: "#030303" }}
                          onPlay={() => track(`video-play-${project.slug}-${v.file}`)} />
                      ) : null}
                    </div>
                    {v.caption && (
                      <p className="mt-2 text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                        style={{ fontFamily: "var(--font-geist-mono)" }}>
                        {v.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hydrostatic / final step images (integration) */}
          {stepIdx === 3 && project.integration && project.integration.length > 0 && (
            <section className="px-6 md:px-16 lg:px-24 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.integration.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <button onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${img.file}`, img.caption ?? "")}
                      className="group block w-full text-left">
                      <div className="overflow-hidden border border-[#181410] group-hover:border-[#2e2010] transition-colors">
                        <img src={`${BASE}/projects/${project.slug}/${img.file}`} alt={img.caption ?? ""}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      {img.caption && (
                        <p className="mt-2 text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                          style={{ fontFamily: "var(--font-geist-mono)" }}>
                          {img.caption}
                        </p>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* App screenshots, shown uncropped in a phone-friendly row */}
          {stepIdx === 3 && project.appScreens && project.appScreens.length > 0 && (
            <section className="px-6 md:px-16 lg:px-24 pb-16">
              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {project.appScreens.map((s, i) => (
                  <motion.figure key={i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="w-[180px] sm:w-[210px] md:w-[240px]">
                    <button onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${s.file}`, s.caption ?? "")}
                      className="group block w-full">
                      <div className="rounded-xl border border-[#2e2010] group-hover:border-[#c4a97e] bg-[#0a0804] p-2 transition-colors duration-300">
                        <img src={`${BASE}/projects/${project.slug}/${s.file}`} alt={s.caption ?? ""}
                          className="w-full h-auto object-contain rounded-md" />
                      </div>
                      {s.caption && (
                        <figcaption className="mt-3 text-center text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                          style={{ fontFamily: "var(--font-geist-mono)" }}>
                          {s.caption}
                        </figcaption>
                      )}
                    </button>
                  </motion.figure>
                ))}
              </div>
            </section>
          )}
        </div>
      ))}

      {/* ── Experiments showcase (cards with optional PDF) ────── */}
      {project.experiments && project.experiments.length > 0 && (
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <div className="flex items-center gap-6 mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>// LAB</span>
            <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>The Experiments</h2>
            <div className="flex-1 h-px bg-[#1a1208]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#181410]">
            {project.experiments.map((e, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                className="group flex flex-col bg-[#050505] hover:bg-[#0c0a06] p-6 transition-colors duration-200">
                <span className="text-[10px] tracking-[0.25em] text-[#c4a97e] mb-3"
                  style={{ fontFamily: "var(--font-geist-mono)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-light text-[#f0e6d3] mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}>{e.title}</h3>
                <p className="text-sm text-[#9a8a6a] leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}>{e.blurb}</p>
                {e.pdf && (
                  <a href={`${BASE}/projects/${project.slug}/${e.pdf}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => track(`experiment-pdf-${e.pdf}`)}
                    className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-[#6b5a3e] group-hover:text-[#c4a97e] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-geist-mono)" }}>
                    READ THE WRITE-UP
                    <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Project slides (embedded PDF) ─────────────────────── */}
      {project.slidesPdf && (
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <div className="flex items-center gap-6 mb-8">
            <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>// DECK</span>
            <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>Project Slides</h2>
            <div className="flex-1 h-px bg-[#1a1208]" />
          </div>
          <div className="border border-[#181410] bg-[#030303]">
            <iframe
              src={`${BASE}/projects/${project.slug}/${project.slidesPdf}`}
              title="Project slides"
              className="w-full h-[70vh]"
            />
          </div>
          <div className="mt-4">
            <a
              href={`${BASE}/projects/${project.slug}/${project.slidesPdf}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(`slides-open-${project.slug}`)}
              className="group inline-flex items-center gap-2 px-5 py-2.5 border border-[#6b5a3e] hover:border-[#c4a97e] hover:bg-[#c4a97e] text-[11px] tracking-[0.18em] text-[#cabb9f] hover:text-[#080603] rounded-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              OPEN SLIDES FULLSCREEN
              <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </div>
        </section>
      )}

      {/* ── Failures & Solutions ──────────────────────────────── */}
      {project.failures && (
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <div className="flex items-center gap-6 mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>// 08</span>
            <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>Failures &amp; Solutions</h2>
            <div className="flex-1 h-px bg-[#1a1208]" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <p className="text-lg text-[#c4b5a0] leading-relaxed whitespace-pre-line"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {project.failures.body}
            </p>
            {project.failures.images && project.failures.images.length > 0 && (
              <div className="space-y-4">
                {project.failures.images.map((img, i) => (
                  <button key={i}
                    onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${img.file}`, img.caption ?? "")}
                    className="group block w-full text-left">
                    <div className="overflow-hidden border border-[#181410] group-hover:border-[#2e2010] transition-colors">
                      <img src={`${BASE}/projects/${project.slug}/${img.file}`} alt={img.caption ?? ""}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {img.caption && (
                      <p className="mt-2 text-[10px] tracking-[0.12em] text-[#8b7d6b] leading-snug"
                        style={{ fontFamily: "var(--font-geist-mono)" }}>
                        {img.caption}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Outcome ───────────────────────────────────────────── */}
      {project.outcome && (
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <div className="flex items-center gap-6 mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>// 09</span>
            <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>Outcome</h2>
            <div className="flex-1 h-px bg-[#1a1208]" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="border-l-2 border-[#c4a97e] pl-6">
              <p className="text-lg text-[#c4b5a0] leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {project.outcome}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Prev / Next ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 border-t border-[#1a1208]">
        {prev ? (
          <Link href={`/projects/${prev.slug}`}
            onClick={() => track(`project-prev-${prev.slug}`)}
            className="group flex flex-col gap-3 p-6 md:p-12 border-r border-[#1a1208] hover:bg-[#0a0804] transition-colors duration-300">
            <span className="text-[10px] tracking-[0.25em] text-[#7a6a4e] group-hover:text-[#c4a97e] transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              <span className="inline-block transition-transform duration-150 group-hover:-translate-x-1">←</span> PREVIOUS PROJECT
            </span>
            <span className="text-lg md:text-xl font-light text-[#9a8a6a] group-hover:text-[#f0e6d3] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/projects/${next.slug}`}
            onClick={() => track(`project-next-${next.slug}`)}
            className="group relative flex flex-col gap-3 p-6 md:p-12 text-right bg-[#0c0a06] hover:bg-[#16110a] transition-colors duration-300">
            {/* beige accent edge, signals this is the way forward */}
            <span aria-hidden className="absolute top-0 right-0 h-full w-[2px] bg-[#c4a97e]/40 group-hover:bg-[#c4a97e] transition-colors duration-200" />
            <span className="text-[10px] tracking-[0.25em] text-[#c4a97e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              NEXT PROJECT <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
            </span>
            <span className="text-lg md:text-2xl font-light text-[#e8dcc6] group-hover:text-[#c4a97e] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>{next.title}</span>
            <span className="text-[10px] tracking-[0.2em] text-[#6b5a3e] group-hover:text-[#8a7a5a] transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}>VIEW DOSSIER →</span>
          </Link>
        ) : <div />}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
