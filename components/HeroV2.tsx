"use client";

import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.85,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay,
  },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.7, ease: "easeOut" as const, delay },
});

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#080704]">

      {/* ── Background image ─────────────────────────────────────── */}
      {/* Drop any image at public/hero-bg.jpg and it will appear here */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      {/* ── Dark gradient overlay ─────────────────────────────────── */}
      {/* Keeps text readable whether the image is light or dark */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(8,7,4,0.88) 0%, rgba(8,7,4,0.72) 50%, rgba(8,7,4,0.40) 100%)",
        }}
      />

      {/* ── Subtle warm grain ────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-6xl">

        {/* Eyebrow */}
        <motion.p
          {...fadeIn(0.1)}
          className="text-[#c4a97e] text-xs tracking-[0.3em] uppercase mb-7 flex items-center gap-2.5"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <span>◆</span>
          Aerospace Engineering · UCLA
        </motion.p>

        {/* Name — Space Grotesk, light weight, enormous */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-[clamp(3.5rem,11vw,9rem)] font-light leading-[0.92] tracking-[-0.02em] text-[#f0e6d3] mb-8"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Omar
          <br />
          <span className="text-[#c4a97e]">Lemkecher</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.35)}
          className="text-base md:text-lg text-[#7a6e60] font-light max-w-sm mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Building the future of flight —
          <br />
          one equation at a time.
        </motion.p>

        {/* Status pill */}
        <motion.div {...fadeIn(0.45)} className="mb-10">
          <span
            className="inline-flex items-center gap-2 border border-[#2e2619] rounded-full px-4 py-1.5 text-xs text-[#7a6e60] bg-[#0f0d09]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4a97e] animate-pulse" />
            Available for internships · Summer 2026
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.55)}
          className="flex flex-wrap gap-3"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {/* Primary */}
          <button
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2 px-7 py-3 bg-[#c4a97e] hover:bg-[#d4b98e] text-[#080704] text-sm font-medium rounded-full transition-colors duration-200"
          >
            View Projects
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-base leading-none">
              ↗
            </span>
          </button>

          {/* Resume */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3 border border-[#2e2619] hover:border-[#c4a97e] text-[#7a6e60] hover:text-[#c4a97e] text-sm font-medium rounded-full transition-colors duration-200"
          >
            Resume
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-base leading-none">
              ↗
            </span>
          </a>

          {/* Contact */}
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2 px-7 py-3 border border-[#2e2619] hover:border-[#c4a97e] text-[#7a6e60] hover:text-[#c4a97e] text-sm font-medium rounded-full transition-colors duration-200"
          >
            Get in Touch
            <span className="transition-transform duration-200 group-hover:translate-x-1 text-base leading-none">
              →
            </span>
          </button>
        </motion.div>
      </div>

      {/* ── Bottom left scroll indicator ─────────────────────────── */}
      <motion.div
        {...fadeIn(1.2)}
        className="absolute bottom-10 left-6 md:left-16 lg:left-24 flex items-center gap-3 z-10"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" as const }}
          className="w-px h-10 bg-gradient-to-b from-[#2e2619] to-transparent"
        />
        <span
          className="text-[10px] tracking-[0.25em] uppercase text-[#3a3026]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Scroll
        </span>
      </motion.div>

      {/* ── Section marker ───────────────────────────────────────── */}
      <motion.p
        {...fadeIn(1.2)}
        className="absolute bottom-10 right-6 md:right-16 lg:right-24 text-[10px] tracking-[0.25em] text-[#2e2619] z-10"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        // 01
      </motion.p>
    </section>
  );
}
