"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";

const ModelViewer    = dynamic(() => import("./ModelViewer"),    { ssr: false });
const ExplodedViewer = dynamic(() => import("./ExplodedViewer"), { ssr: false });
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
function ModelSection({ src, title }: { src: string; title: string }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [exposure,   setExposure]   = useState(0.9);
  const mvRef = useRef<HTMLElement | null>(null);

  /* model-viewer viewpoint presets */
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

        {/* model-viewer */}
        <div
          ref={(el) => { mvRef.current = el?.querySelector("model-viewer") ?? null; }}
          className="absolute inset-0"
        >
          <ModelViewer src={src} alt={`${title} 3D model`} autoRotate={autoRotate} exposure={exposure} />
        </div>

        {/* Control overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 pointer-events-none z-10">
          {/* Left: viewpoint buttons */}
          <div className="flex flex-wrap gap-1 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {views.map((v) => (
              <button key={v.label} onClick={() => setOrbit(v.orbit)}
                className="px-3 py-1.5 bg-[#050505]/80 backdrop-blur border border-[#2e2010] hover:border-[#c4a97e] text-[9px] tracking-[0.15em] text-[#6b5a3e] hover:text-[#c4a97e] transition-all duration-150">
                {v.label}
              </button>
            ))}
          </div>

          {/* Right: auto-rotate + exposure */}
          <div className="flex items-center gap-3 pointer-events-auto" style={{ fontFamily: "var(--font-geist-mono)" }}>
            <div className="flex items-center gap-2">
              <span className="text-[8px] tracking-[0.15em] text-[#3a2e1e]">EXPOSURE</span>
              <input type="range" min="0.3" max="2" step="0.05" value={exposure}
                onChange={(e) => setExposure(parseFloat(e.target.value))}
                className="w-20 accent-[#c4a97e] cursor-pointer" />
            </div>
            {/* Auto-rotate toggle */}
            <button onClick={() => setAutoRotate((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-[9px] tracking-[0.15em] transition-all duration-150 ${
                autoRotate ? "border-[#c4a97e] text-[#c4a97e] bg-[#c4a97e]/10" : "border-[#2e2010] text-[#3a2e1e]"
              }`}>
              <span className={`w-1 h-1 rounded-full ${autoRotate ? "bg-[#c4a97e] animate-pulse" : "bg-[#3a2e1e]"}`} />
              AUTO-ROTATE
            </button>
          </div>
        </div>

        {/* Corner label */}
        <div className="absolute top-4 left-4 text-[9px] tracking-[0.2em] text-[#2a1f10] z-10"
          style={{ fontFamily: "var(--font-geist-mono)" }}>
          3D · DRAG TO ORBIT · SCROLL TO ZOOM
        </div>
      </div>
    </section>
  );
}

/* ─── Big stat callout (breaks the layout) ───────────────────── */
function StatCallout({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="py-16 px-6 md:px-16 lg:px-24 flex items-end gap-6 border-y border-[#0f0d09]">
      <span className="text-[clamp(3rem,12vw,9rem)] font-extralight text-[#c4a97e] leading-none tracking-tight"
        style={{ fontFamily: "var(--font-space-grotesk)" }}>{value}</span>
      <div className="mb-4">
        <div className="text-2xl font-light text-[#3a2e1e]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}>{unit}</div>
        <div className="text-[10px] tracking-[0.25em] text-[#2a1f10] mt-1"
          style={{ fontFamily: "var(--font-geist-mono)" }}>{label}</div>
      </div>
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

  const videos = (project.media ?? []).filter((m) => m.type === "video" || m.type === "youtube");

  const openLightbox = useCallback((src: string, alt: string) => setLightbox({ src, alt }), []);

  // Pick a key stat for the callout
  const calloutSpec = project.specs?.find((s) =>
    ["THRUST TARGET", "WINS", "0-g WINDOWS", "ORBIT"].includes(s.label)
  );

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
          className="absolute top-8 left-6 md:left-16 lg:left-24 z-10 text-[10px] tracking-[0.2em] text-[#3a2e1e] hover:text-[#c4a97e] transition-colors duration-200"
          style={{ fontFamily: "var(--font-geist-mono)" }}>
          ← ALL PROJECTS
        </Link>

        {/* Mission ID */}
        <div className="absolute top-8 right-6 md:right-16 lg:right-24 z-10 text-right"
          style={{ fontFamily: "var(--font-geist-mono)" }}>
          <div className="text-[8px] tracking-[0.3em] text-[#1e1508]">MISSION DOSSIER</div>
          <div className="text-[9px] tracking-[0.2em] text-[#c4a97e] mt-0.5">
            OL-{String(idx + 1).padStart(3, "0")}
          </div>
        </div>

        {/* Title block — spans full bottom */}
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

      {/* ── Specs grid — full width ────────────────────────────── */}
      {project.specs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#181410]">
          {project.specs.map((s) => (
            <SpecCell key={s.label} label={s.label} value={s.value} redacted={s.redacted} />
          ))}
        </div>
      )}

      {/* ── Big stat callout ──────────────────────────────────── */}
      {calloutSpec && (() => {
        const match = calloutSpec.value.match(/^([\d,]+)\s*(.*)$/);
        if (!match) return null;
        return <StatCallout value={match[1]} unit={match[2]} label={calloutSpec.label} />;
      })()}

      {/* ── Brief — two columns ───────────────────────────────── */}
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
            className="text-lg text-[#7a6a54] font-light leading-relaxed"
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
                  <p className="text-sm text-[#5a4a30] leading-relaxed"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}>{g}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── 3D Model ──────────────────────────────────────────── */}
      {modelSrc && <ModelSection src={modelSrc} title={project.title} />}

      {/* ── Process sections with integrated media ────────────────── */}
      {project.process && project.process.length > 0 && project.process.map((step, stepIdx) => (
        <div key={stepIdx}>
          {/* Section header */}
          <section className="py-16 px-6 md:px-16 lg:px-24">
            <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {step.title}
            </h2>
            <p className="text-base text-[#b8a98a] leading-relaxed mt-6"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {step.description}
            </p>
          </section>

          {/* 3D Model for Design section */}
          {stepIdx === 0 && modelSrc && (
            <div className="px-6 md:px-16 lg:px-24 pb-16">
              {<ModelSection src={modelSrc} title={project.title} />}
            </div>
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
                        <p className="mt-2 text-[10px] tracking-[0.12em] text-[#3a2e1e] leading-snug"
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
                    <button onClick={() => openLightbox(`${BASE}/projects/${project.slug}/${img.file}`, img.caption ?? "")}
                      className="group block w-full text-left">
                      <div className="overflow-hidden border border-[#181410] group-hover:border-[#2e2010] transition-colors">
                        <img src={`${BASE}/projects/${project.slug}/${img.file}`} alt={img.caption ?? ""}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      {img.caption && (
                        <p className="mt-2 text-[10px] tracking-[0.12em] text-[#3a2e1e] leading-snug"
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

          {/* Static Fire section with videos (smaller) */}
          {stepIdx === 3 && videos.length > 0 && (
            <section className="px-6 md:px-16 lg:px-24 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((v, i) => (
                  <div key={i} className="border border-[#181410]">
                    {v.type === "youtube" ? (
                      <div className="aspect-video">
                        <iframe src={`https://www.youtube.com/embed/${v.id}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen />
                      </div>
                    ) : v.type === "video" ? (
                      <video src={`${BASE}/projects/${project.slug}/${v.file}`}
                        controls className="w-full" style={{ background: "#030303" }} />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ))}

      {/* ── Process Steps ────────────────────────────────────────────── */}
      {project.process && project.process.length > 0 && (
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <div className="space-y-10">
            {project.process.map((step, i) => (
              <div key={i} className="border-l-2 border-[#c4a97e] pl-6">
                <h3 className="text-xl font-light text-[#f0e6d3] mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {step.title}
                </h3>
                <p className="text-base text-[#b8a98a] leading-relaxed"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Outcome ───────────────────────────────────────────── */}
      {project.outcome && (
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <div className="flex items-center gap-6 mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>// 08</span>
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
      <div className="grid grid-cols-2 border-t border-[#0f0d09]">
        {prev ? (
          <Link href={`/projects/${prev.slug}`}
            className="group flex flex-col gap-3 p-6 md:p-12 border-r border-[#0f0d09] hover:bg-[#080603] transition-colors duration-300">
            <span className="text-[9px] tracking-[0.25em] text-[#2a1f10] group-hover:text-[#c4a97e] transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}>← PREVIOUS</span>
            <span className="text-lg font-light text-[#4a3824] group-hover:text-[#c8bfb0] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/projects/${next.slug}`}
            className="group flex flex-col gap-3 p-6 md:p-12 text-right hover:bg-[#080603] transition-colors duration-300">
            <span className="text-[9px] tracking-[0.25em] text-[#2a1f10] group-hover:text-[#c4a97e] transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}>NEXT →</span>
            <span className="text-lg font-light text-[#4a3824] group-hover:text-[#c8bfb0] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>{next.title}</span>
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
