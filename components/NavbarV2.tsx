"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const links = [
  { label: "01  ABOUT",    href: "#about",    scroll: true },
  { label: "02  PROJECTS", href: "#projects", scroll: true },
  { label: "03  CONTACT",  href: "#contact",  scroll: true },
];

function scrollTo(id: string) {
  const el = document.getElementById(id.replace("#", ""));
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function NavbarV2() {
  const [scrolled,  setScrolled]  = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    function onScroll() {
      const y   = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setProgress(max > 0 ? (y / max) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Fixed bar ────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #1e1508" : "1px solid transparent",
        }}
      >
        {/* Top horizontal progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
          <div
            className="h-full bg-[#c4a97e] transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-6 md:px-16 lg:px-24 h-14 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
            style={{ fontFamily: "var(--font-geist-mono)" }}
            aria-label="Back to top"
          >
            <span className="text-[#c4a97e] text-xs">◆</span>
            <span className="text-[11px] tracking-[0.25em] text-[#f0e6d3] group-hover:text-[#c4a97e] transition-colors duration-200">
              OL
            </span>
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-xs tracking-[0.2em] text-[#b8a88a] hover:text-[#c4a97e] transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 border border-[#6b5a3e] hover:border-[#c4a97e] hover:bg-[#c4a97e]/10 text-[#cabb9f] hover:text-[#c4a97e] text-xs tracking-[0.15em] rounded-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              RESUME ↗
            </a>

            <button
              className="md:hidden flex flex-col gap-[5px] p-1"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-px bg-[#c4a97e]"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="block w-5 h-px bg-[#c4a97e]"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-px bg-[#c4a97e]"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Vertical side scroll bar (right edge) ───────────────── */}
      <div
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {/* Track */}
        <div className="relative w-px h-32 bg-[#1a1208]">
          {/* Beige fill */}
          <div
            className="absolute top-0 left-0 w-full bg-[#c4a97e] transition-none"
            style={{ height: `${progress}%` }}
          />
          {/* Dot at progress point */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#c4a97e] transition-none"
            style={{ top: `calc(${progress}% - 3px)` }}
          />
        </div>
        {/* Percentage */}
        <span className="text-[8px] tracking-[0.15em] text-[#2a1f10] rotate-90 mt-2">
          {Math.round(progress).toString().padStart(2, "0")}%
        </span>
      </div>

      {/* ── Mobile overlay menu ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#050505] flex flex-col justify-center px-8"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c4a97e]" />

            <nav className="space-y-8" style={{ fontFamily: "var(--font-geist-mono)" }}>
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
                >
                  <button
                    onClick={() => { setMenuOpen(false); setTimeout(() => scrollTo(l.href), 300); }}
                    className="text-2xl tracking-[0.15em] text-[#f0e6d3] hover:text-[#c4a97e] transition-colors duration-200"
                  >
                    {l.label}
                  </button>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + links.length * 0.07, duration: 0.3 }}
              >
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl tracking-[0.15em] text-[#4a3824] hover:text-[#c4a97e] transition-colors duration-200"
                >
                  RESUME ↗
                </a>
              </motion.div>
            </nav>

            <p
              className="absolute bottom-10 left-8 text-[10px] tracking-[0.25em] text-[#2a1f10]"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              OMAR LEMKECHER · OL-001
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
