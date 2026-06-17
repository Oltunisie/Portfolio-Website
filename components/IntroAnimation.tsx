"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ROWS = [
  { label: "INSTITUTION", value: "UCLA SAMUELI"          },
  { label: "DISCIPLINE",  value: "AEROSPACE ENGINEERING" },
  { label: "STATUS",      value: "ACTIVE", accent: true  },
];

const ROW_DELAY  = 0.09;
const AUTO_CLOSE = 1800;

export default function IntroAnimation() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    sessionStorage.setItem("ol_intro_seen", "1");
    document.body.style.overflow = "";
    setTimeout(() => setVisible(false), 600);
  }, [leaving]);

  useEffect(() => {
    // Only on the landing page — never gate direct links to project pages
    if (pathname !== "/") return;
    if (sessionStorage.getItem("ol_intro_seen")) return;
    setVisible(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(dismiss, AUTO_CLOSE);
    return () => clearTimeout(t);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col justify-center px-8 md:px-20 lg:px-32 select-none overflow-hidden"
          style={{ fontFamily: "var(--font-geist-mono)" }}
          onClick={dismiss}
        >
          {/* Grid texture */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#c4a97e 1px,transparent 1px),linear-gradient(90deg,#c4a97e 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }} />

          {/* Top bar */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-[#c4a97e] origin-left"
          />

          {/* Mission label */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-[#c4a97e] text-[10px] tracking-[0.4em] mb-8"
          >
            INITIALIZING OL-001&hellip;
          </motion.p>

          {/* Name — big */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3rem,9vw,7.5rem)] font-extralight text-[#f0e6d3] leading-[0.92] tracking-tight mb-10"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Omar<br />
            <span className="text-[#c4a97e]">Lemkecher</span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.38, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-[#1e1508] mb-7 origin-left max-w-sm"
          />

          {/* Data rows */}
          <div className="space-y-3 mb-7 max-w-sm">
            {ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.44 + i * ROW_DELAY, duration: 0.38, ease: "easeOut" }}
                className="flex items-center justify-between"
              >
                <span className="text-[10px] tracking-[0.22em] text-[#5a4a30]">{row.label}</span>
                <span className={`text-[10px] tracking-[0.12em] flex items-center gap-1.5 ${
                  row.accent ? "text-emerald-400" : "text-[#9a8a6a]"
                }`}>
                  {row.accent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {row.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bottom divider */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.44 + ROWS.length * ROW_DELAY + 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-[#1e1508] mb-8 origin-left max-w-sm"
          />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.44 + ROWS.length * ROW_DELAY + 0.25, duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={(e) => { e.stopPropagation(); dismiss(); }}
              className="text-[10px] tracking-[0.3em] text-[#c4a97e] hover:text-[#d4b98e] transition-colors duration-200"
            >
              ENTER DOSSIER &rarr;
            </button>
            <span className="text-[9px] tracking-[0.15em] text-[#2a1f10]">OR CLICK ANYWHERE</span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-[#c4a97e] opacity-40"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_CLOSE / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
