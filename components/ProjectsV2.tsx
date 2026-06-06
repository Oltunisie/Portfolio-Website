"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

const rowVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: i * 0.08 },
  }),
};

export default function ProjectsV2() {
  return (
    <section id="projects" className="bg-[#050505] px-6 md:px-16 lg:px-24 py-32">

      {/* ── Section header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="flex items-end justify-between mb-16"
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
          {projects.length} ENTRIES
        </p>
      </motion.div>

      {/* ── Top rule ────────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        className="origin-left h-px bg-[#1e1508] mb-0"
      />

      {/* ── Project rows ────────────────────────────────────────── */}
      <div>
        {projects.map((project, i) => (
          <motion.div
            key={project.slug}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={rowVariant}
          >
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="relative flex items-start md:items-center gap-6 md:gap-10 py-8 border-b border-[#1e1508] transition-all duration-300">

                {/* Hover accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#c4a97e] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                {/* Index number */}
                <span
                  className="shrink-0 text-[11px] tracking-[0.2em] text-[#2a1f10] group-hover:text-[#c4a97e] transition-colors duration-300 pt-1 md:pt-0 pl-4"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Title + tags */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl md:text-2xl font-light text-[#c8bfb0] group-hover:text-[#f0e6d3] transition-colors duration-300 leading-snug mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-[11px] tracking-[0.15em] text-[#3a2e1e]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {project.tags.join(" · ")}
                  </p>
                </div>

                {/* Period */}
                {project.period && (
                  <span
                    className="hidden md:block shrink-0 text-[11px] tracking-[0.1em] text-[#3a2e1e]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {project.period}
                  </span>
                )}

                {/* Status pill */}
                {project.status && (
                  <span
                    className={`hidden md:inline-flex shrink-0 items-center gap-1.5 px-3 py-1 text-[10px] tracking-[0.15em] rounded-sm border ${
                      project.status === "In Progress"
                        ? "border-[#3a2e1e] text-[#c4a97e]"
                        : "border-[#1e1508] text-[#3a2e1e]"
                    }`}
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {project.status === "In Progress" && (
                      <span className="w-1 h-1 rounded-full bg-[#c4a97e] animate-pulse" />
                    )}
                    {project.status.toUpperCase()}
                  </span>
                )}

                {/* Arrow */}
                <span
                  className="shrink-0 text-[#2a1f10] group-hover:text-[#c4a97e] text-lg transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
