"use client";

import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden bg-[#050d1a]">

      {/* ── Subtle grid texture ───────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Radial glow (top-left) ────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl">

        {/* Eyebrow label */}
        <motion.p
          {...fadeIn(0.1)}
          className="font-mono text-xs tracking-[0.25em] uppercase text-[#3b82f6] mb-6 flex items-center gap-2"
        >
          <span className="text-[#3b82f6]">◆</span>
          Aerospace Engineering · UCLA
        </motion.p>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-[clamp(3.5rem,10vw,8rem)] font-extralight leading-[0.95] tracking-tight text-white mb-6"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Omar
          <br />
          Lemkecher
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.35)}
          className="text-lg md:text-xl text-[#6b7fa3] font-light max-w-md mb-10 leading-relaxed"
        >
          Building the future of flight —
          <br />
          one equation at a time.
        </motion.p>

        {/* Status pill */}
        <motion.div {...fadeIn(0.45)} className="mb-10">
          <span className="inline-flex items-center gap-2 border border-[#1a2d4a] rounded-full px-4 py-1.5 text-xs font-mono text-[#6b7fa3] bg-[#0a1628]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for internships · Summer 2026
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.55)}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2 px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-full transition-colors duration-200"
          >
            View Projects
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3 border border-[#1a2d4a] hover:border-[#3b82f6] text-[#6b7fa3] hover:text-white text-sm font-medium rounded-full transition-colors duration-200"
          >
            Resume
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>

          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2 px-6 py-3 border border-[#1a2d4a] hover:border-[#3b82f6] text-[#6b7fa3] hover:text-white text-sm font-medium rounded-full transition-colors duration-200"
          >
            Get in Touch
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.div
        {...fadeIn(1.1)}
        className="absolute bottom-10 left-6 md:left-16 lg:left-24 flex items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-transparent via-[#1a2d4a] to-transparent"
        />
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#2d3f5e]">
          Scroll
        </span>
      </motion.div>

      {/* ── Section number ───────────────────────────────────────── */}
      <motion.p
        {...fadeIn(1.1)}
        className="absolute bottom-10 right-6 md:right-16 lg:right-24 font-mono text-[10px] tracking-[0.2em] text-[#1a2d4a]"
      >
        // 01
      </motion.p>
    </section>
  );
}
