"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import { track } from "@/lib/track";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* First image from media array, or null */
function getCover(p: Project): string | null {
  const img = p.media?.find((m) => m.type === "image");
  if (img && img.type === "image") return `${BASE}/projects/${p.slug}/${img.file}`;
  return null;
}

/* Fallback gradients */
const fallbacks: Record<string, string> = {
  "hybrid-rocket-feed-system":  "linear-gradient(135deg,#1a0800 0%,#050505 100%)",
  "cubesat-adcs-bruinspace":    "linear-gradient(135deg,#04101e 0%,#050505 100%)",
  "zero-g-experiments-cnes":    "linear-gradient(160deg,#060c1e 0%,#03060f 60%,#010205 100%)",
  "space-probe-project-x":      "linear-gradient(135deg,#0d0818 0%,#050505 100%)",
};

/* Pre-generated star field for zero-g card */
const STARS = [
  { x: 8,  y: 12, r: 0.9, o: 0.9 }, { x: 23, y: 5,  r: 0.6, o: 0.7 },
  { x: 37, y: 18, r: 1.0, o: 0.8 }, { x: 52, y: 8,  r: 0.5, o: 0.6 },
  { x: 67, y: 22, r: 0.8, o: 0.9 }, { x: 81, y: 9,  r: 0.6, o: 0.7 },
  { x: 91, y: 30, r: 1.1, o: 0.8 }, { x: 14, y: 38, r: 0.5, o: 0.5 },
  { x: 44, y: 32, r: 0.7, o: 0.8 }, { x: 73, y: 41, r: 0.9, o: 0.6 },
  { x: 88, y: 55, r: 0.5, o: 0.7 }, { x: 5,  y: 60, r: 0.8, o: 0.9 },
  { x: 29, y: 52, r: 1.0, o: 0.5 }, { x: 58, y: 63, r: 0.6, o: 0.8 },
  { x: 76, y: 70, r: 0.7, o: 0.6 }, { x: 94, y: 75, r: 0.5, o: 0.9 },
  { x: 18, y: 80, r: 0.9, o: 0.7 }, { x: 42, y: 85, r: 0.6, o: 0.5 },
  { x: 63, y: 78, r: 1.1, o: 0.8 }, { x: 84, y: 88, r: 0.5, o: 0.6 },
  { x: 11, y: 92, r: 0.7, o: 0.7 }, { x: 33, y: 96, r: 0.8, o: 0.5 },
  { x: 55, y: 90, r: 0.6, o: 0.9 }, { x: 78, y: 95, r: 0.9, o: 0.6 },
  { x: 96, y: 14, r: 0.5, o: 0.8 }, { x: 3,  y: 45, r: 0.7, o: 0.6 },
  { x: 47, y: 4,  r: 1.0, o: 0.7 }, { x: 70, y: 50, r: 0.6, o: 0.5 },
  { x: 20, y: 68, r: 0.8, o: 0.8 }, { x: 90, y: 42, r: 0.5, o: 0.9 },
  { x: 60, y: 28, r: 0.9, o: 0.6 }, { x: 35, y: 72, r: 0.6, o: 0.7 },
  { x: 50, y: 48, r: 1.2, o: 0.4 }, { x: 15, y: 15, r: 0.5, o: 0.8 },
  { x: 85, y: 62, r: 0.7, o: 0.6 }, { x: 25, y: 88, r: 0.8, o: 0.5 },
];

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top:  `${s.y}%`,
            width:  `${s.r * 2}px`,
            height: `${s.r * 2}px`,
            opacity: s.o,
          }}
        />
      ))}
      {/* Subtle nebula glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(100,120,200,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(180,100,120,0.05) 0%, transparent 70%)" }} />
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover  = getCover(project);
  const fit    = project.coverFit ?? "cover";
  const isLive = project.status === "In Progress";
  const isZeroG = project.slug === "zero-g-experiments-cnes";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        onClick={() => track(`project-open-${project.slug}`)}
        className="group block relative overflow-hidden h-[380px] md:h-[500px] border border-[#151208]
          hover:border-[#2e2010] transition-colors duration-500"
        style={{
          boxShadow: "0 0 0 0 transparent",
        }}
      >

        {/* ── Background: gradient + optional stars ───────────── */}
        <div
          className="absolute inset-0"
          style={{ background: fallbacks[project.slug] ?? "#050505" }}
        />
        {isZeroG && <StarField />}

        {/* ── Cover image ─────────────────────────────────────── */}
        {cover && (
          <div
            className={`absolute inset-0 transition-transform duration-700 ease-out ${fit === "cover" ? "group-hover:scale-[1.04]" : ""}`}
            style={{
              backgroundImage:    `url('${cover}')`,
              backgroundSize:     fit === "contain" ? "55%" : "cover",
              backgroundPosition: "center",
              backgroundRepeat:   "no-repeat",
            }}
          />
        )}

        {/* ── Permanent vignette ──────────────────────────────── */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.2) 50%, rgba(5,5,5,0.12) 100%)",
          }}
        />

        {/* ── Top beige accent line — slides in on hover ──────── */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#c4a97e] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        {/* ── Scan-line at panel edge ──────────────────────────── */}
        <div
          className="absolute left-0 right-0 h-[1px] bg-[#c4a97e] opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          style={{ bottom: "40%" }}
        />

        {/* ── Slide-up mission panel ───────────────────────────── */}
        <div
          className="absolute left-0 right-0 bottom-0 h-[40%] flex flex-col justify-between p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ background: "rgba(5,5,5,0.95)", borderTop: "1px solid #1e1508" }}
        >
          <p
            className="text-[10px] tracking-[0.2em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {project.tags.slice(0, 4).join(" · ")}
          </p>
          <p
            className="text-sm text-[#6b5a40] leading-relaxed line-clamp-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {project.description}
          </p>
          <span
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#c4a97e] group-hover:gap-3 transition-all duration-300"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            VIEW MISSION ↗
          </span>
        </div>

        {/* ── Index + status — top left ────────────────────────── */}
        <div className="absolute top-5 left-5 flex items-center gap-3">
          <span
            className="text-[11px] tracking-[0.25em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {isLive && (
            <span
              className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-[#5a4a2e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </span>
          )}
        </div>

        {/* ── Period — top right ───────────────────────────────── */}
        {project.period && (
          <div className="absolute top-5 right-5">
            <span
              className="text-[10px] tracking-[0.15em] text-[#2e2010]"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {project.period}
            </span>
          </div>
        )}

        {/* ── Title — bottom, fades out when panel opens ──────── */}
        <div className="absolute bottom-5 left-5 right-5 group-hover:opacity-0 transition-opacity duration-200">
          <h3
            className="text-xl md:text-2xl font-light text-[#f0e6d3] leading-snug"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {project.title}
          </h3>
        </div>

      </Link>
    </motion.div>
  );
}

export default function ProjectsV2() {
  return (
    <section id="projects" className="bg-[#050505] px-6 md:px-16 lg:px-24 py-32">

      {/* ── Section header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p
            className="text-[10px] tracking-[0.3em] text-[#c4a97e] mb-3"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            ◆ OL-001
          </p>
          <h2
            className="text-4xl md:text-5xl font-light text-[#f0e6d3] tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            // 03&nbsp;&nbsp;Projects
          </h2>
        </div>
        <p
          className="hidden md:block text-[10px] tracking-[0.2em] text-[#6b5a3e]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {projects.length} MISSIONS
        </p>
      </motion.div>

      {/* ── 2×2 card grid — 2px gap feels like tiles ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] border border-[#2e2415]">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      {/* ── Forward path → Contact ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="mt-16 flex items-center gap-5"
      >
        <button
          onClick={() => { track("cta-get-in-touch"); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
          className="group inline-flex items-center gap-3 px-7 py-3 border border-[#6b5a3e] hover:border-[#c4a97e] bg-[#0c0a06] hover:bg-[#c4a97e] text-[#cabb9f] hover:text-[#080603] text-[11px] tracking-[0.18em] rounded-sm transition-all duration-200"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          GET IN TOUCH
          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
        </button>
        <span
          className="hidden sm:block text-[10px] tracking-[0.2em] text-[#6b5a3e]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          NEXT &mdash; 03 CONTACT
        </span>
      </motion.div>

    </section>
  );
}
