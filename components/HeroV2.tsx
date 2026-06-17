"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { track } from "@/lib/track";

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

/* ─── data rows ──────────────────────────────────────────────── */
const fields = [
  { label: "ENGINEER",     value: "OMAR LEMKECHER",                       highlight: true },
  { label: "INSTITUTION",  value: "UCLA SAMUELI · LOS ANGELES"                           },
  { label: "DISCIPLINE",   value: "AEROSPACE ENGINEERING · PROPULSION"                   },
  { label: "AVAILABILITY", value: "SUMMER 2026 INTERNSHIP"                               },
];

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050505]">

      {/* ── Background video (loops, muted, autoplay) ──────────── */}
      <video
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-bg.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/website_video.mp4" type="video/mp4" />
      </video>

      {/* ── Gradient overlay — wider dark zone on left ─────────── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.96) 40%, rgba(5,5,5,0.80) 58%, rgba(5,5,5,0.40) 75%, rgba(5,5,5,0.08) 100%)",
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
      <div className="relative z-10 px-6 md:px-16 lg:px-24 py-20 w-full max-w-5xl">

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
          className="origin-left h-px bg-[#4a3a26] mb-8"
        />

        {/* Data rows */}
        <div
          className="space-y-5"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {fields.map((f, i) => (
            <motion.div
              key={f.label}
              {...row(i)}
              className="flex flex-col md:grid md:items-baseline gap-1 md:gap-0"
              style={{ gridTemplateColumns: "13rem 1fr" }}
            >
              {/* Label */}
              <span className="text-[10px] tracking-[0.2em] text-[#8a7458]">
                {f.label}
              </span>

              {/* Value */}
              {f.highlight ? (
                <span
                  className="text-[clamp(2.2rem,8vw,4.2rem)] font-light leading-[1] tracking-[-0.02em] text-[#f0e6d3]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {f.value}
                </span>
              ) : (
                <span className="text-sm tracking-[0.08em] text-[#c4b89e]">
                  {f.value}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom rule */}
        <motion.div
          {...line(0.6 + fields.length * 0.12 + 0.1)}
          className="origin-left h-px bg-[#4a3a26] mt-8 mb-8"
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
            onClick={() => {
              track("cta-view-projects");
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#c4a97e] hover:bg-[#e4c397] text-[#080603] font-medium text-[11px] tracking-[0.15em] rounded-sm shadow-[0_0_20px_rgba(196,169,126,0.25)] hover:shadow-[0_0_28px_rgba(196,169,126,0.45)] transition-all duration-200"
          >
            VIEW PROJECTS
            <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("resume-view")}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 border border-[#6b5a3e] hover:border-[#c4a97e] text-[#cabb9f] hover:text-[#c4a97e] text-[11px] tracking-[0.15em] rounded-sm transition-colors duration-200"
          >
            RESUME
            <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>

          <button
            onClick={() => {
              track("cta-contact");
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 border border-[#6b5a3e] hover:border-[#c4a97e] text-[#cabb9f] hover:text-[#c4a97e] text-[11px] tracking-[0.15em] rounded-sm transition-colors duration-200"
          >
            CONTACT
            <span className="transition-transform duration-150 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>
      </div>

      {/* ── UCLA logo — bottom left ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="group absolute bottom-8 left-6 md:left-16 lg:left-24 z-10"
      >
        {/* Hover tooltip */}
        <div
          className="absolute bottom-full left-0 mb-3 px-3 py-2 bg-[#0f0f0f] border border-[#2e2010] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <p className="text-[10px] tracking-[0.2em] text-[#c4a97e]">UCLA SAMUELI</p>
          <p className="text-[10px] tracking-[0.15em] text-[#4a3824] mt-0.5">SCHOOL OF ENGINEERING</p>
        </div>

        {/* Logo image — B&W via CSS filter */}
        <Image
          src="/ucla-eng.png"
          alt="UCLA Samueli School of Engineering"
          width={120}
          height={48}
          className="object-contain opacity-30 group-hover:opacity-60 transition-opacity duration-300"
          style={{ filter: "grayscale(1) brightness(2)" }}
          unoptimized
        />
      </motion.div>

      {/* ── Corner marker — bottom right ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        aria-hidden
        className="absolute bottom-8 right-6 md:right-16 lg:right-24 z-10"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        <div className="text-[#2a1f10] text-[10px] tracking-[0.2em] text-right">
          <div>// 01</div>
          <div className="mt-1">HERO</div>
        </div>
      </motion.div>

    </section>
  );
}
