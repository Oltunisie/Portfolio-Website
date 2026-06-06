"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EMAIL    = "olemkecher@ucla.edu";
const GITHUB   = "https://github.com/Oltunisie";
const LINKEDIN = "https://www.linkedin.com/in/omar-lemkecher-b02765365/";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-space-grotesk)";

/* ─── Live LA clock ─────────────────────────────────────────── */
function LAClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

/* ─── Contact card ───────────────────────────────────────────── */
function ContactCard({
  label, value, sub, href, onClick, delay,
}: {
  label: string; value: string; sub: string;
  href?: string; onClick?: () => void; delay: number;
}) {
  const Tag = href ? "a" : "button";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Tag
        {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(onClick ? { onClick } : {})}
        className="group block w-full text-left border border-[#181410] hover:border-[#c4a97e] transition-colors duration-300 p-6 relative overflow-hidden"
      >
        {/* Scan line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[#c4a97e] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <p className="text-[9px] tracking-[0.3em] text-[#3a2e1e] group-hover:text-[#c4a97e] transition-colors duration-200 mb-3"
          style={{ fontFamily: MONO }}>{label}</p>
        <p className="text-base font-light text-[#c8bfb0] group-hover:text-[#f0e6d3] transition-colors duration-200 mb-1 break-all"
          style={{ fontFamily: SANS }}>{value}</p>
        <p className="text-[10px] tracking-[0.15em] text-[#2a1f10] group-hover:text-[#4a3824] transition-colors duration-200"
          style={{ fontFamily: MONO }}>{sub}</p>
      </Tag>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function ContactV2() {
  const [copied, setCopied]   = useState(false);
  const [name,   setName]     = useState("");
  const [msg,    setMsg]      = useState("");
  const [sent,   setSent]     = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transmit = () => {
    if (!msg.trim()) return;
    const subject = name.trim()
      ? `Message from ${name.trim()} — Portfolio`
      : "Portfolio inquiry";
    window.open(
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`
    );
    setSent(true);
    setTimeout(() => { setSent(false); setName(""); setMsg(""); }, 3000);
  };

  return (
    <section
      id="contact"
      className="bg-[#050505] px-6 md:px-16 lg:px-24 pt-32 pb-20 border-t border-[#0f0d09]"
    >
      {/* ── Section header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-6 mb-20"
      >
        <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]" style={{ fontFamily: MONO }}>
          // 05
        </span>
        <h2 className="text-2xl font-light text-[#f0e6d3] tracking-tight" style={{ fontFamily: SANS }}>
          Contact
        </h2>
        <div className="flex-1 h-px bg-[#1a1208]" />
      </motion.div>

      {/* ── Top split: statement + status ───────────────────── */}
      <div className="grid md:grid-cols-5 gap-12 md:gap-20 mb-20">

        {/* Statement — left 3 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-3"
        >
          <h3
            className="text-[clamp(2.4rem,6vw,5rem)] font-extralight text-[#f0e6d3] leading-[0.95] tracking-tight mb-8"
            style={{ fontFamily: SANS }}
          >
            Let&rsquo;s build<br />
            <span className="text-[#c4a97e]">something</span><br />
            that flies.
          </h3>
          <p className="text-base text-[#5a4a30] leading-relaxed max-w-sm" style={{ fontFamily: SANS }}>
            Open to internship opportunities, research collaborations,
            and conversations about aerospace, propulsion, and engineering.
          </p>
        </motion.div>

        {/* Status panel — right 2 cols */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-2 flex flex-col justify-center gap-0 border border-[#181410]"
        >
          {/* Available row */}
          <div className="px-6 py-4 border-b border-[#181410] flex items-center justify-between">
            <span className="text-[9px] tracking-[0.25em] text-[#3a2e1e]" style={{ fontFamily: MONO }}>
              STATUS
            </span>
            <span className="flex items-center gap-2 text-[9px] tracking-[0.15em] text-[#c4a97e]"
              style={{ fontFamily: MONO }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE
            </span>
          </div>

          {/* Seeking row */}
          <div className="px-6 py-4 border-b border-[#181410] flex items-center justify-between">
            <span className="text-[9px] tracking-[0.25em] text-[#3a2e1e]" style={{ fontFamily: MONO }}>
              SEEKING
            </span>
            <span className="text-[9px] tracking-[0.12em] text-[#6b5a3e]" style={{ fontFamily: MONO }}>
              SUMMER 2026 INTERNSHIP
            </span>
          </div>

          {/* Location + clock row */}
          <div className="px-6 py-4 border-b border-[#181410] flex items-center justify-between">
            <span className="text-[9px] tracking-[0.25em] text-[#3a2e1e]" style={{ fontFamily: MONO }}>
              LOCAL TIME
            </span>
            <span className="text-[9px] tracking-[0.12em] text-[#6b5a3e]" style={{ fontFamily: MONO }}>
              <LAClock /> · PST
            </span>
          </div>

          {/* Response row */}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-[9px] tracking-[0.25em] text-[#3a2e1e]" style={{ fontFamily: MONO }}>
              RESPONSE
            </span>
            <span className="text-[9px] tracking-[0.12em] text-[#6b5a3e]" style={{ fontFamily: MONO }}>
              &lt; 24 HOURS
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Message composer ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="border border-[#181410] mb-4"
      >
        {/* Composer header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#181410]"
          style={{ fontFamily: MONO }}>
          <div className="flex items-center gap-3">
            <span className="text-[9px] tracking-[0.25em] text-[#c4a97e]">◆ NEW TRANSMISSION</span>
            <span className="text-[9px] tracking-[0.15em] text-[#2a1f10]">TO: {EMAIL}</span>
          </div>
          <span className="text-[8px] tracking-[0.2em] text-[#1e1508]">SECURE CHANNEL</span>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#181410]">
          {/* Name */}
          <div className="px-6 py-5">
            <label className="block text-[9px] tracking-[0.25em] text-[#3a2e1e] mb-3"
              style={{ fontFamily: MONO }}>
              YOUR NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full bg-transparent text-sm text-[#c8bfb0] placeholder-[#2a1f10] outline-none border-b border-[#1a1208] focus:border-[#c4a97e] transition-colors duration-200 pb-1"
              style={{ fontFamily: SANS }}
            />
          </div>

          {/* Message — spans 2 cols */}
          <div className="md:col-span-2 px-6 py-5">
            <label className="block text-[9px] tracking-[0.25em] text-[#3a2e1e] mb-3"
              style={{ fontFamily: MONO }}>
              MESSAGE
            </label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="What are you working on?"
              rows={3}
              className="w-full bg-transparent text-sm text-[#c8bfb0] placeholder-[#2a1f10] outline-none resize-none border-b border-[#1a1208] focus:border-[#c4a97e] transition-colors duration-200 pb-1"
              style={{ fontFamily: SANS }}
            />
          </div>
        </div>

        {/* Send button */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#181410]">
          <span className="text-[9px] tracking-[0.15em] text-[#1e1508]" style={{ fontFamily: MONO }}>
            OPENS YOUR EMAIL CLIENT — NO DATA STORED
          </span>
          <button
            onClick={transmit}
            disabled={!msg.trim()}
            className={`group inline-flex items-center gap-2 px-6 py-2.5 text-[10px] tracking-[0.2em] transition-all duration-200 ${
              sent
                ? "bg-emerald-400/20 border border-emerald-400/40 text-emerald-400"
                : msg.trim()
                  ? "bg-[#c4a97e] hover:bg-[#d4b98e] text-[#050505]"
                  : "border border-[#181410] text-[#2a1f10] cursor-not-allowed"
            }`}
            style={{ fontFamily: MONO }}
          >
            {sent ? (
              <>TRANSMITTED ✓</>
            ) : (
              <>
                TRANSMIT
                <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ── Three contact cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#181410] mb-20">
        <ContactCard
          label="EMAIL"
          value={EMAIL}
          sub={copied ? "COPIED ✓" : "CLICK TO COPY"}
          onClick={copyEmail}
          delay={0.1}
        />
        <ContactCard
          label="LINKEDIN"
          value="Omar Lemkecher"
          sub="VIEW PROFILE ↗"
          href={LINKEDIN}
          delay={0.18}
        />
        <ContactCard
          label="GITHUB"
          value="Oltunisie"
          sub="VIEW REPOS ↗"
          href={GITHUB}
          delay={0.26}
        />
      </div>

      {/* ── Footer stamp ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-[#0f0d09]"
        style={{ fontFamily: MONO }}
      >
        <div className="flex items-center gap-6">
          <span className="text-[9px] tracking-[0.3em] text-[#1e1508]">◆ OL-001</span>
          <span className="text-[9px] tracking-[0.2em] text-[#1e1508]">
            OMAR LEMKECHER · UCLA SAMUELI SCHOOL OF ENGINEERING
          </span>
        </div>
        <span className="text-[9px] tracking-[0.2em] text-[#1a1208]">
          LOS ANGELES · CALIFORNIA · 2026
        </span>
      </motion.div>
    </section>
  );
}
