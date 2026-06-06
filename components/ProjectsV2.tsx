"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects, type Project } from "@/data/projects";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* First image from media array, or null */
function getCover(p: Project): string | null {
  const img = p.media?.find((m) => m.type === "image");
  if (img && img.type === "image") return `${BASE}/projects/${p.slug}/${img.file}`;
  return null;
}

/* Fallback gradient per project (for those without photos yet) */
const fallbacks: Record<string, string> = {
  "hybrid-rocket-feed-system":  "linear-gradient(135deg,#1a0800 0%,#050505 100%)",
  "cubesat-adcs-bruinspace":    "linear-gradient(135deg,#04101e 0%,#050505 100%)",
  "zero-g-experiments-cnes":    "linear-gradient(135deg,#060d04 0%,#050505 100%)",
  "space-probe-project-x":      "linear-gradient(135deg,#0d0818 0%,#050505 100%)",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover  = getCover(project);
  const isLive = project.status === "In Progress";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block relative overflow-hidden h-[480px]">

        {/* ── Background image / gradient ──────────────────────── */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{
            background: cover ? undefined : fallbacks[project.slug] ?? "#050505",
            backgroundImage: cover ? `url('${cover}')` : undefined,
            backgroundSize:  "cover",
            backgroundPosition: "center",
          }}
        />

        {/* ── Base vignette (always) ────────────────────────────── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.25) 50%, rgba(5,5,5,0.15) 100%)",
          }}
        />

        {/* ── Scan-line that draws across on hover ──────────────── */}
        <div className="absolute left-0 right-0 h-[1px] bg-[#c4a97e] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ bottom: "42%" }} />

        {/* ── Slide-up mission panel ────────────────────────────── */}
        <div
          className="absolute left-0 right-0 bottom-0 h-[42%] flex flex-col justify-between p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ background: "rgba(5,5,5,0.93)" }}
        >
          {/* Tags */}
          <p
            className="text-[10px] tracking-[0.2em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {project.tags.slice(0, 4).join(" · ")}
          </p>

          {/* Description */}
          <p
            className="text-sm text-[#7a6a54] leading-relaxed line-clamp-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {project.description}
          </p>

          {/* CTA */}
          <span
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            VIEW MISSION
            <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </span>
        </div>

        {/* ── Always visible: index number top-left ─────────────── */}
        <div className="absolute top-5 left-6 flex items-center gap-3">
          <span
            className="text-[11px] tracking-[0.25em] text-[#c4a97e]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {isLive && (
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-[#6b5a3e]"
              style={{ fontFamily: "var(--font-geist-mono)" }}>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </span>
          )}
        </div>

        {/* ── Always visible: title bottom-left (hidden when panel open) ── */}
        <div className="absolute bottom-6 left-6 right-6 group-hover:opacity-0 transition-opacity duration-200">
          <h3
            className="text-xl md:text-2xl font-light text-[#f0e6d3] leading-snug"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {project.title}
          </h3>
          {project.period && (
            <p
              className="mt-1 text-[10px] tracking-[0.15em] text-[#4a3824]"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {project.period}
            </p>
          )}
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
        className="flex items-end justify-between mb-14"
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
            // 02&nbsp;&nbsp;Projects
          </h2>
        </div>
        <p
          className="hidden md:block text-[10px] tracking-[0.2em] text-[#2a1f10]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {projects.length} MISSIONS
        </p>
      </motion.div>

      {/* ── 2×2 card grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

    </section>
  );
}
