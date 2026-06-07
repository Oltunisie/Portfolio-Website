"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROWS = [
  { label: "SUBJECT",     value: "OMAR LEMKECHER",         accent: false },
  { label: "INSTITUTION", value: "UCLA SAMUELI",            accent: false },
  { label: "DISCIPLINE",  value: "AEROSPACE ENGINEERING",   accent: false },
  { label: "GPA",         value: "4.0 / 4.0",               accent: false },
  { label: "STATUS",      value: "ACTIVE",                  accent: true  },
];

const ROW_DELAY   = 0.13;   // seconds between each row
const AUTO_CLOSE  = 4200;   // ms before auto-dismiss

export default function IntroAnimation() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    sessionStorage.setItem("ol_intro_seen", "1");
    document.body.style.overflow = "";
    setTimeout(() => setVisible(false), 650);
  }, [leaving]);

  useEffect(() => {
    if (sessionStorage.getItem("ol_intro_seen")) return;
    setVisible(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(dismiss, AUTO_CLOSE);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center select-none"
          style={{ fontFamily: "var(--font-geist-mono)" }}
          onClick={dismiss}
        >
          {/* Subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#c4a97e 1px,transparent 1px),linear-gradient(90deg,#c4a97e 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Top beige bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-[#c4a97e] origin-left"
          />

          {/* Initializing label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#c4a97e] text-[10px] tracking-[0.4em] mb-10"
          >
            INITIALIZING OL-001&hellip;
          </motion.p>

          {/* Top divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.45, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-72 h-px bg-[#1e1508] mb-7 origin-left"
          />

          {/* Data rows */}
          <div className="w-72 space-y-3 mb-7">
            {ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * ROW_DELAY, duration: 0.4, ease: "easeOut" }}
                className="flex items-center justify-between"
              >
                <span className="text-[9px] tracking-[0.22em] text-[#4a3824]">
                  {row.label}
                </span>
                <span className={`text-[9px] tracking-[0.12em] flex items-center gap-1.5 ${
                  row.accent ? "text-emerald-400" : "text-[#9a8a6a]"
                }`}>
                  {row.accent && (
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {row.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bottom divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: 0.55 + ROWS.length * ROW_DELAY + 0.05,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-72 h-px bg-[#1e1508] mb-10 origin-left"
          />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 + ROWS.length * ROW_DELAY + 0.35, duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={(e) => { e.stopPropagation(); dismiss(); }}
              className="text-[9px] tracking-[0.35em] text-[#c4a97e] hover:text-[#d4b98e] transition-colors duration-200"
            >
              ENTER DOSSIER &rarr;
            </button>
            <span className="text-[8px] tracking-[0.2em] text-[#2a1f10]">
              OR CLICK ANYWHERE
            </span>
          </motion.div>

          {/* Progress bar — fills over AUTO_CLOSE ms */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-[#c4a97e] opacity-30"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_CLOSE / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
