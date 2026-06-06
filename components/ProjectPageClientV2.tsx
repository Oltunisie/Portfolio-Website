"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* ─── Animated counter hook ──────────────────────────────────── */
function useCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return { count, ref };
}

/* ─── Spec value — animates numbers if present ───────────────── */
function SpecValue({ value }: { value: string }) {
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  const hasNum = !isNaN(num) && num > 0 && num < 100000;
  const { count, ref } = useCounter(hasNum ? num : 0);
  if (!hasNum) return <span className="text-[#f0e6d3]">{value}</span>;
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.replace(/^[^0-9]*[0-9,.]+/, "");
  return (
    <span ref={ref} className="text-[#f0e6d3]">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Section nav dot ────────────────────────────────────────── */
const SECTIONS = [
  { id: "brief",   label: "BRIEF"   },
  { id: "data",    label: "DATA"    },
  { id: "systems", label: "SYSTEMS" },
  { id: "process", label: "PROCESS" },
  { id: "docs",    label: "DOCS"    },
];

function SectionNav({ active }: { active: string }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-4">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 group"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <span
            className={`text-[9px] tracking-[0.2em] transition-all duration-200 ${
              active === s.id ? "text-[#c4a97e] opacity-100" : "text-[#2a1f10] opacity-0 group-hover:opacity-100"
            }`}
          >
            {s.label}
          </span>
          <div
            className={`rounded-full transition-all duration-300 ${
              active === s.id
                ? "w-1.5 h-1.5 bg-[#c4a97e]"
                : "w-1 h-1 bg-[#2a1f10] group-hover:bg-[#4a3824]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─── Section header ─────────────────────────────────────────── */
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="flex items-center gap-6 mb-10"
    >
      <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]"
        style={{ fontFamily: "var(--font-geist-mono)" }}>
        // {num}
      </span>
      <h2 className="text-2xl md:text-3xl font-light text-[#f0e6d3] tracking-tight"
        style={{ fontFamily: "var(--font-space-grotesk)" }}>
        {title}
      </h2>
      <div className="flex-1 h-px bg-[#1a1208]" />
    </motion.div>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.img
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        src={src} alt={alt}
        className="max-w-full max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#c4a97e] text-xl font-light"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >✕</button>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function ProjectPageClientV2({ project }: { project: Project }) {
  const [activeSection, setActiveSection] = useState("brief");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  /* Track active section with IntersectionObserver */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* Copy to clipboard */
  const copySpec = useCallback((label: string, value: string) => {
    navigator.clipboard.writeText(`${label}: ${value}`);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  /* Adjacent projects */
  const idx  = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[idx - 1] ?? null;
  const next = projects[idx + 1] ?? null;

  /* Cover image */
  const coverImg = project.media?.find((m) => m.type === "image");
  const coverSrc = coverImg && coverImg.type === "image"
    ? `${BASE}/projects/${project.slug}/${coverImg.file}` : null;

  /* Images only */
  const images = (project.media ?? []).filter((m) => m.type === "image");

  /* 3D model */
  const modelSrc = project.model3d
    ? `${BASE}/projects/${project.slug}/${project.model3d}` : null;

  /* Videos */
  const videos = (project.media ?? []).filter((m) => m.type === "video" || m.type === "youtube");

  const hasSystemsSection = modelSrc || videos.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0e6d3]">

      {/* ── Sticky section nav ────────────────────────────────── */}
      <SectionNav active={activeSection} />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[420px] overflow-hidden">
        {/* Background */}
        {coverSrc ? (
          <div
            className="absolute inset-0 bg-cover bg-center scale-[1.05]"
            style={{ backgroundImage: `url('${coverSrc}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0a05] to-[#050505]" />
        )}
        {/* Overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.55) 60%, rgba(5,5,5,0.3) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(5,5,5,0.6) 0%, transparent 60%)" }} />

        {/* Back */}
        <div className="absolute top-6 left-6 md:left-16 lg:left-24 z-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#4a3824] hover:text-[#c4a97e] transition-colors duration-200"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            ← PROJECTS
          </Link>
        </div>

        {/* Mission badge */}
        <div className="absolute top-6 right-6 md:right-16 lg:right-24 z-10 text-right"
          style={{ fontFamily: "var(--font-geist-mono)" }}>
          <div className="text-[9px] tracking-[0.25em] text-[#2a1f10]">MISSION DOSSIER</div>
          <div className="text-[9px] tracking-[0.2em] text-[#c4a97e] mt-1">
            OL-{String(idx + 1).padStart(3, "0")}
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-10 left-6 md:left-16 lg:left-24 right-6 md:right-16 lg:right-24 z-10">
          {project.status && (
            <div className="flex items-center gap-2 mb-4"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              {project.status === "In Progress" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span className="text-[10px] tracking-[0.2em] text-[#6b5a3e]">
                {project.status.toUpperCase()}
              </span>
              {project.period && (
                <span className="text-[10px] tracking-[0.15em] text-[#2a1f10]">· {project.period}</span>
              )}
            </div>
          )}
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#f0e6d3] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {project.tags.map((t) => (
              <span key={t} className="text-[10px] tracking-[0.15em] text-[#3a2e1e] border border-[#1e1508] px-2 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 lg:px-24 py-20 max-w-5xl">

        {/* ── 01 BRIEF ────────────────────────────────────────── */}
        <section id="brief" className="mb-24 scroll-mt-20">
          <SectionHeader num="01" title="Mission Brief" />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-[#7a6a54] font-light leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {project.description}
          </motion.p>

          {/* Problem detail */}
          {project.problem && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 pl-6 border-l border-[#1e1508]"
            >
              <p className="text-[10px] tracking-[0.25em] text-[#c4a97e] mb-3"
                style={{ fontFamily: "var(--font-geist-mono)" }}>
                PROBLEM STATEMENT
              </p>
              <p className="text-sm text-[#5a4a30] leading-relaxed max-w-2xl whitespace-pre-line"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {project.problem}
              </p>
            </motion.div>
          )}
        </section>

        {/* ── 02 DATA ─────────────────────────────────────────── */}
        {project.specs && (
          <section id="data" className="mb-24 scroll-mt-20">
            <SectionHeader num="02" title="Mission Data" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#1a1208] border border-[#1a1208]">
              {project.specs.map((s, i) => (
                <motion.button
                  key={s.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  onClick={() => copySpec(s.label, s.value)}
                  className="group relative bg-[#050505] p-5 text-left hover:bg-[#0a0804] transition-colors duration-200"
                >
                  <div className="text-[9px] tracking-[0.25em] text-[#3a2e1e] mb-2 group-hover:text-[#c4a97e] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {s.label}
                  </div>
                  <div className="text-base font-light" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    <SpecValue value={s.value} />
                  </div>
                  {/* Copy indicator */}
                  <div className={`absolute top-3 right-3 text-[9px] tracking-[0.15em] transition-all duration-200 ${
                    copied === s.label ? "text-[#c4a97e] opacity-100" : "text-[#2a1f10] opacity-0 group-hover:opacity-100"
                  }`} style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {copied === s.label ? "COPIED" : "COPY"}
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* ── 03 SYSTEMS ──────────────────────────────────────── */}
        {hasSystemsSection && (
          <section id="systems" className="mb-24 scroll-mt-20">
            <SectionHeader num="03" title="Systems View" />

            {/* 3D model */}
            {modelSrc && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full h-[500px] border border-[#1a1208] bg-[#030303] mb-6"
              >
                <ModelViewer src={modelSrc} alt={`${project.title} 3D model`} />
              </motion.div>
            )}

            {/* Videos */}
            {videos.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="w-full mb-4 border border-[#1a1208]"
              >
                {v.type === "youtube" ? (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : v.type === "video" ? (
                  <video
                    src={`${BASE}/projects/${project.slug}/${v.file}`}
                    controls
                    className="w-full"
                    style={{ background: "#030303" }}
                  />
                ) : null}
                {v.type !== "youtube" && "caption" in v && v.caption && (
                  <p className="px-4 py-2 text-[11px] tracking-[0.1em] text-[#3a2e1e]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {v.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </section>
        )}

        {/* ── 04 PROCESS ──────────────────────────────────────── */}
        {project.process && project.process.length > 0 && (
          <section id="process" className="mb-24 scroll-mt-20">
            <SectionHeader num={hasSystemsSection ? "04" : "03"} title="Mission Log" />
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#1a1208]" />

              <div className="space-y-10">
                {project.process.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex gap-8"
                  >
                    {/* Node */}
                    <div className="relative shrink-0 w-9 h-9 rounded-full border border-[#2e2010] bg-[#050505] flex items-center justify-center mt-1">
                      <span className="text-[9px] tracking-[0.1em] text-[#c4a97e]"
                        style={{ fontFamily: "var(--font-geist-mono)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <h3 className="text-base font-light text-[#c8bfb0] mb-2"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#5a4a30] leading-relaxed"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 05 DOCUMENTATION ────────────────────────────────── */}
        {images.length > 0 && (
          <section id="docs" className="mb-24 scroll-mt-20">
            <SectionHeader num="05" title="Documentation" />

            {/* Horizontal scroll gallery */}
            <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              <div className="flex gap-3" style={{ width: "max-content" }}>
                {images.map((img, i) => {
                  if (img.type !== "image") return null;
                  const src = `${BASE}/projects/${project.slug}/${img.file}`;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      className="shrink-0 w-72 md:w-96"
                    >
                      <button
                        onClick={() => setLightbox({ src, alt: img.caption ?? project.title })}
                        className="group block w-full"
                      >
                        <div className="relative overflow-hidden h-56 md:h-64 border border-[#1a1208] group-hover:border-[#2e2010] transition-colors duration-300">
                          <img
                            src={src}
                            alt={img.caption ?? `${project.title} photo ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          {/* Expand icon */}
                          <div className="absolute top-3 right-3 text-[10px] text-[#c4a97e] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ fontFamily: "var(--font-geist-mono)" }}>
                            ↗
                          </div>
                          {/* Photo number */}
                          <div className="absolute bottom-3 left-3 text-[9px] tracking-[0.2em] text-[#c4a97e] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ fontFamily: "var(--font-geist-mono)" }}>
                            {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                          </div>
                        </div>
                      </button>
                      {/* Caption */}
                      {img.caption && (
                        <p className="mt-2 text-[10px] tracking-[0.1em] text-[#3a2e1e] leading-snug px-1"
                          style={{ fontFamily: "var(--font-geist-mono)" }}>
                          {img.caption}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-[9px] tracking-[0.2em] text-[#1e1508]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              SCROLL TO VIEW ALL {images.length} IMAGES →
            </p>
          </section>
        )}

        {/* ── Goals ───────────────────────────────────────────── */}
        {project.goals && project.goals.length > 0 && (
          <section className="mb-24">
            <SectionHeader num="06" title="Objectives" />
            <div className="space-y-3">
              {project.goals.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex gap-4 items-start"
                >
                  <span className="shrink-0 text-[10px] tracking-[0.15em] text-[#c4a97e] mt-0.5"
                    style={{ fontFamily: "var(--font-geist-mono)" }}>
                    ◆
                  </span>
                  <p className="text-sm text-[#6b5a40] leading-relaxed"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {g}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Outcome ─────────────────────────────────────────── */}
        {project.outcome && (
          <section className="mb-24">
            <SectionHeader num="07" title="Outcome" />
            <div className="border-l-2 border-[#c4a97e] pl-6">
              <p className="text-base text-[#6b5a40] leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {project.outcome}
              </p>
            </div>
          </section>
        )}

      </div>

      {/* ── Prev / Next navigation ────────────────────────────── */}
      <div className="border-t border-[#1a1208] px-6 md:px-16 lg:px-24 py-12 grid grid-cols-2 gap-4">
        {prev ? (
          <Link href={`/projects/${prev.slug}`}
            className="group flex flex-col gap-2 p-6 border border-[#1a1208] hover:border-[#2e2010] transition-colors duration-300">
            <span className="text-[9px] tracking-[0.25em] text-[#2a1f10] group-hover:text-[#c4a97e] transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              ← PREVIOUS MISSION
            </span>
            <span className="text-base font-light text-[#6b5a40] group-hover:text-[#c8bfb0] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {prev.title}
            </span>
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/projects/${next.slug}`}
            className="group flex flex-col gap-2 p-6 border border-[#1a1208] hover:border-[#2e2010] transition-colors duration-300 text-right">
            <span className="text-[9px] tracking-[0.25em] text-[#2a1f10] group-hover:text-[#c4a97e] transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              NEXT MISSION →
            </span>
            <span className="text-base font-light text-[#6b5a40] group-hover:text-[#c8bfb0] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {next.title}
            </span>
          </Link>
        ) : <div />}
      </div>

      {/* ── Footer stamp ──────────────────────────────────────── */}
      <div className="px-6 md:px-16 lg:px-24 py-8 flex items-center justify-between border-t border-[#0f0d09]"
        style={{ fontFamily: "var(--font-geist-mono)" }}>
        <span className="text-[9px] tracking-[0.3em] text-[#1a1208]">OMAR LEMKECHER · OL-{String(idx + 1).padStart(3, "0")}</span>
        <Link href="/#projects"
          className="text-[9px] tracking-[0.2em] text-[#2a1f10] hover:text-[#c4a97e] transition-colors duration-200">
          ALL MISSIONS ↗
        </Link>
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
