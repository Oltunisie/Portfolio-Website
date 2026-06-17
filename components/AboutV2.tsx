"use client";

import { motion } from "framer-motion";

/* ── Quick human facts (right column) ─────────────────────────────
   Grounded in real history — edit freely, these are yours to own. */
const FACTS = [
  { label: "BASED IN",     value: "Los Angeles · from Tunisia" },
  { label: "LANGUAGES",    value: "Arabic · French · English" },
  { label: "FIRST SPARK",  value: "Zero-g flight over Bordeaux, 2023" },
  { label: "OFF THE CLOCK", value: "Astronomy & astrophotography" },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

export default function AboutV2() {
  return (
    <section id="about" className="bg-[#050505] px-6 md:px-16 lg:px-24 py-32">

      {/* ── Section header ──────────────────────────────────────── */}
      <motion.div {...fade()} className="mb-14">
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
          // 02&nbsp;&nbsp;Profile
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20">

        {/* ── First-person prose ───────────────────────────────── */}
        <div className="space-y-6">
          <motion.p
            {...fade(0.05)}
            className="text-xl md:text-2xl font-light text-[#e8dcc6] leading-relaxed"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            I&rsquo;m Omar &mdash; an aerospace engineering student at UCLA,
            originally from Tunisia. I build rocket propulsion systems, but
            what actually pulls me in is the moment a design leaves the screen
            and becomes hardware that fires.
          </motion.p>

          <motion.p
            {...fade(0.12)}
            className="text-base md:text-lg text-[#a89876] font-light leading-relaxed"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            My path here wasn&rsquo;t a straight line. I caught the space bug
            running experiments aboard a CNES zero-g flight over Bordeaux,
            sharpened it winning national engineering competitions back home in
            Tunisia, and now I lead the feed system on UCLA&rsquo;s hybrid
            rocket. Every step taught me the same lesson: rigorous analysis
            means nothing until you&rsquo;ve tested it and watched it hold.
          </motion.p>

          <motion.p
            {...fade(0.19)}
            className="text-base md:text-lg text-[#a89876] font-light leading-relaxed"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            I do my best work with a hard problem, a test stand, and a team
            that isn&rsquo;t afraid to be wrong on the way to being right. The
            first endcap I designed leaked &mdash; fixing it taught me more than
            any lecture ever did.
          </motion.p>
        </div>

        {/* ── Quick facts ──────────────────────────────────────── */}
        <motion.div
          {...fade(0.15)}
          className="border-t border-[#2e2415] pt-2"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="flex flex-col gap-1 py-4 border-b border-[#2e2415]"
            >
              <span className="text-[9px] tracking-[0.28em] text-[#9a8460]">
                {f.label}
              </span>
              <span
                className="text-sm text-[#c8bca6] tracking-[0.04em]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {f.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Forward path → Projects ──────────────────────────────── */}
      <motion.div {...fade(0.1)} className="mt-16 flex items-center gap-5">
        <button
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          className="group inline-flex items-center gap-3 px-7 py-3 border border-[#6b5a3e] hover:border-[#c4a97e] bg-[#0c0a06] hover:bg-[#c4a97e] text-[#cabb9f] hover:text-[#080603] text-[11px] tracking-[0.18em] rounded-sm transition-all duration-200"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          SEE THE WORK
          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
        </button>
        <span
          className="hidden sm:block text-[10px] tracking-[0.2em] text-[#6b5a3e]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          NEXT &mdash; 02 PROJECTS
        </span>
      </motion.div>
    </section>
  );
}
