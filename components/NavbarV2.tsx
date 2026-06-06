"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "01  PROJECTS", href: "#projects" },
  { label: "02  ABOUT",    href: "#about"    },
  { label: "03  CONTACT",  href: "#contact"  },
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

  // lock body scroll when mobile menu is open
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
          background: scrolled
            ? "rgba(5,5,5,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #1e1508" : "1px solid transparent",
        }}
      >
        {/* Scroll-progress line — beige, grows left→right */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden">
          <div
            className="h-full bg-[#c4a97e] transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-6 md:px-16 lg:px-24 h-14 flex items-center justify-between">

          {/* ── Logo / wordmark ──────────────────────────────────── */}
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

          {/* ── Desktop nav ──────────────────────────────────────── */}
          <nav
            className="hidden md:flex items-center gap-8"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-[10px] tracking-[0.2em] text-[#4a3824] hover:text-[#c4a97e] transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* ── Desktop CTA + mobile burger ──────────────────────── */}
          <div className="flex items-center gap-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 border border-[#2e2010] hover:border-[#c4a97e] text-[#4a3824] hover:text-[#c4a97e] text-[10px] tracking-[0.15em] rounded-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              RESUME ↗
            </a>

            {/* Hamburger — mobile only */}
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

      {/* ── Mobile full-screen overlay ───────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#050505] flex flex-col justify-center px-8"
          >
            {/* Thin beige accent at top */}
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

            {/* Bottom tagline */}
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
