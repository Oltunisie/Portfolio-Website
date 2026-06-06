"use client";

import { motion } from "framer-motion";

/* ─── animation helpers ──────────────────────────────────────── */
const row = (i: number) => ({
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  transition: {
    duration: 0.5,
    ease: "easeOut" as const,
    delay: 0.6 + i * 0.12,
  },
});

const line = (delay: number) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay },
});

/* ─── data ───────────────────────────────────────────────────── */
const fields = [
  { label: "ENGINEER",     value: "OMAR LEMKECHER",              highlight: true },
  { label: "INSTITUTION",  value: "UCLA SAMUELI · LOS ANGELES"              },
  { label: "DISCIPLINE",   value: "AEROSPACE ENGINEERING · PROPULSION"      },
  { label: "GPA",          value: "4.0 / 4.0"                               },
  { label: "AVAILABILITY", value: "SUMMER 2026 INTERNSHIP"                  },
];

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#080603]">

      {/* ── Background image ───────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      {/* ── Gradient overlay: dark on left, revealing image right ─ */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(8,6,3,0.97) 0%, rgba(8,6,3,0.88) 45%, rgba(8,6,3,0.55) 70%, rgba(8,6,3,0.25) 100%)",
        }}
      />

      {/* ── Scanline sweep on load ─────────────────────────────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4a97e] to-transparent z-20"
        initial={{ top: "-2px", opacity: 0.6 }}
        animate={{ top: "102%", opacity: 0 }}
        transition={{ duration: 1.4, ease: "linear", delay: 0.1 }}
      />

      {/* ── Subtle grid ────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#c4a97e 1px, transparent 1px), linear-gradient(90deg, #c4a97e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 py-20 w-full max-w-4xl">

        {/* Mission header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between mb-4"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]">
            MISSION: OL-001
          </span>
          <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#6b5a3e]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            STATUS: ACTIVE
          </span>
        </motion.div>

        {/* Top rule */}
        <motion.div
          {...line(0.35)}
          className="origin-left h-px bg-[#2e2010] mb-8"
        />

        {/* Data rows */}
        <div
          className="space-y-4"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {fields.map((f, i) => (
            <motion.div
              key={f.label}
              {...row(i)}
              className="grid items-baseline"
              style={{ gridTemplateColumns: "12rem 1fr" }}
            >
              {/* Label */}
              <span className="text-[11px] tracking-[0.2em] text-[#4a3824]">
                {f.label}
              </span>

              {/* Value */}
              {f.highlight ? (
                <span
                  className="text-[clamp(1.6rem,4vw,2.6rem)] font-light leading-tight tracking-[-0.01em] text-[#f0e6d3]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {f.value}
                </span>
              ) : (
                <span className="text-sm tracking-[0.08em] text-[#8a7055]">
                  {f.value}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom rule */}
        <motion.div
          {...line(0.6 + fields.length * 0.12 + 0.1)}
          className="origin-left h-px bg-[#2e2010] mt-8 mb-8"
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + fields.length * 0.12 + 0.3 }}
          className="flex flex-wrap gap-3"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#c4a97e] hover:bg-[#d4b98e] text-[#080603] text-[11px] tracking-[0.15em] rounded-sm transition-colors duration-200"
          >
            INITIATE
            <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 border border-[#2e2010] hover:border-[#c4a97e] text-[#4a3824] hover:text-[#c4a97e] text-[11px] tracking-[0.15em] rounded-sm transition-colors duration-200"
          >
            RESUME
            <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>

          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 border border-[#2e2010] hover:border-[#c4a97e] text-[#4a3824] hover:text-[#c4a97e] text-[11px] tracking-[0.15em] rounded-sm transition-colors duration-200"
          >
            CONTACT
            <span className="transition-transform duration-150 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>

      </div>

      {/* ── Corner bracket decoration (bottom-right) ───────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        aria-hidden
        className="absolute bottom-8 right-6 md:right-16 lg:right-24 z-10"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        <div className="text-[#1e1508] text-[10px] tracking-[0.2em] text-right">
          <div>// 01</div>
          <div className="mt-1">HERO</div>
        </div>
      </motion.div>

    </section>
  );
}
