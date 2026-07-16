"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { track } from "@/lib/track";

const EMAIL    = "olemkecher@ucla.edu";
const GITHUB   = "https://github.com/Oltunisie";
const LINKEDIN = "https://www.linkedin.com/in/omar-lemkecher-b02765365/";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-space-grotesk)";

/* ─── SVG logos ──────────────────────────────────────────────── */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
  </svg>
);

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
  label, value, sub, href, onClick, delay, icon,
}: {
  label: string; value: string; sub: string; delay: number;
  href?: string; onClick?: () => void;
  icon?: React.ReactNode;
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
        className="group block w-full text-left border border-[#3a3020] hover:border-[#c4a97e] transition-colors duration-300 p-6 relative overflow-hidden bg-[#050505] hover:bg-[#0a0804]"
      >
        {/* Scan line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[#c4a97e] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        {/* Label row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] tracking-[0.3em] text-[#7a6a54] group-hover:text-[#c4a97e] transition-colors duration-200"
            style={{ fontFamily: MONO }}>{label}</p>
          {icon && (
            <span className="text-[#4a3824] group-hover:text-[#c4a97e] transition-colors duration-200">
              {icon}
            </span>
          )}
        </div>

        <p className="text-lg font-light text-[#d4cbb8] group-hover:text-[#f0e6d3] transition-colors duration-200 mb-2 break-all"
          style={{ fontFamily: SANS }}>{value}</p>
        <p className="text-[10px] tracking-[0.15em] text-[#5a4a30] group-hover:text-[#8a7a5a] transition-colors duration-200"
          style={{ fontFamily: MONO }}>{sub}</p>
      </Tag>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function ContactV2() {
  const [copied,  setCopied]  = useState(false);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [msg,     setMsg]     = useState("");
  const [status,  setStatus]  = useState<"idle" | "sending" | "sent" | "error">("idle");

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    track("contact-email-copy");
    setTimeout(() => setCopied(false), 2000);
  };

  const transmit = async () => {
    if (!email.trim() || !msg.trim()) return;
    setStatus("sending");
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
        { from_name: name.trim() || "Anonymous", from_email: email.trim(), message: msg.trim() },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "" }
      );
      setStatus("sent");
      track("contact-submit");
      setName(""); setEmail(""); setMsg("");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const canSend = email.trim() && msg.trim() && status === "idle";

  return (
    <section
      id="contact"
      className="bg-[#050505] px-6 md:px-16 lg:px-24 pt-32 pb-20 border-t border-[#181410]"
    >
      {/* ── Section header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-6 mb-10 md:mb-20"
      >
        <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]" style={{ fontFamily: MONO }}>
          // 05
        </span>
        <h2 className="text-4xl md:text-5xl font-light text-[#f0e6d3] tracking-tight" style={{ fontFamily: SANS }}>
          Contact
        </h2>
        <div className="flex-1 h-px bg-[#1e1810]" />
      </motion.div>

      {/* ── Statement + status panel ─────────────────────────── */}
      <div className="grid md:grid-cols-5 gap-10 md:gap-20 mb-12 md:mb-20">

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
          <p className="text-lg text-[#a89572] leading-relaxed max-w-md" style={{ fontFamily: SANS }}>
            Open to internship opportunities, research collaborations,
            and conversations about aerospace, propulsion, and engineering.
          </p>
        </motion.div>

        {/* Status panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-2 flex flex-col justify-center border border-[#241e14]"
        >
          <div className="px-6 py-4 border-b border-[#241e14] flex items-center justify-between">
            <span className="text-[11px] tracking-[0.25em] text-[#7a6a54]" style={{ fontFamily: MONO }}>STATUS</span>
            <span className="flex items-center gap-2 text-[11px] tracking-[0.15em] text-[#c4a97e]" style={{ fontFamily: MONO }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE
            </span>
          </div>
          <div className="px-6 py-4 border-b border-[#241e14] flex items-center justify-between">
            <span className="text-[11px] tracking-[0.25em] text-[#7a6a54]" style={{ fontFamily: MONO }}>SEEKING</span>
            <span className="text-[11px] tracking-[0.12em] text-[#9a8a6a]" style={{ fontFamily: MONO }}>SUMMER 2027 INTERNSHIP</span>
          </div>
          <div className="px-6 py-4 border-b border-[#241e14] flex items-center justify-between">
            <span className="text-[11px] tracking-[0.25em] text-[#7a6a54]" style={{ fontFamily: MONO }}>LOCAL TIME</span>
            <span className="text-[11px] tracking-[0.12em] text-[#9a8a6a]" style={{ fontFamily: MONO }}>
              <LAClock /> · PST
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-[11px] tracking-[0.25em] text-[#7a6a54]" style={{ fontFamily: MONO }}>RESPONSE</span>
            <span className="text-[11px] tracking-[0.12em] text-[#9a8a6a]" style={{ fontFamily: MONO }}>&lt; 24 HOURS</span>
          </div>
        </motion.div>
      </div>

      {/* ── Message composer ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="border border-[#241e14] mb-4"
      >
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#241e14]"
          style={{ fontFamily: MONO }}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[11px] tracking-[0.25em] text-[#c4a97e]">◆ NEW TRANSMISSION</span>
            <span className="text-[11px] tracking-[0.15em] text-[#6b5a3e] hidden sm:inline">TO: {EMAIL}</span>
          </div>
          <span className="text-[10px] tracking-[0.2em] text-[#4a3824] hidden md:inline">SECURE CHANNEL</span>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#241e14]">
          {/* Left col: name + email */}
          <div className="divide-y divide-[#241e14]">
            <div className="px-6 py-5">
              <label className="block text-[11px] tracking-[0.25em] text-[#7a6a54] mb-3" style={{ fontFamily: MONO }}>
                YOUR NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Smith"
                className="w-full bg-transparent text-sm text-[#c8bfb0] placeholder-[#4a3824] outline-none border-b border-[#241e14] focus:border-[#c4a97e] transition-colors duration-200 pb-1"
                style={{ fontFamily: SANS }}
              />
            </div>
            <div className="px-6 py-5">
              <label className="block text-[11px] tracking-[0.25em] text-[#7a6a54] mb-3" style={{ fontFamily: MONO }}>
                YOUR EMAIL <span className="text-[#c4a97e]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-[#c8bfb0] placeholder-[#4a3824] outline-none border-b border-[#241e14] focus:border-[#c4a97e] transition-colors duration-200 pb-1"
                style={{ fontFamily: SANS }}
              />
            </div>
          </div>

          {/* Right col: message */}
          <div className="px-6 py-5 flex flex-col">
            <label className="block text-[11px] tracking-[0.25em] text-[#7a6a54] mb-3" style={{ fontFamily: MONO }}>
              MESSAGE <span className="text-[#c4a97e]">*</span>
            </label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="What are you working on?"
              rows={4}
              className="flex-1 w-full bg-transparent text-sm text-[#c8bfb0] placeholder-[#4a3824] outline-none resize-none border-b border-[#241e14] focus:border-[#c4a97e] transition-colors duration-200 pb-1"
              style={{ fontFamily: SANS }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-t border-[#241e14]">
          <span className="text-[11px] tracking-[0.15em] text-[#5a4a30]" style={{ fontFamily: MONO }}>
            {status === "error"
              ? "⚠ TRANSMISSION FAILED, TRY AGAIN"
              : "SENT DIRECTLY, NO OUTLOOK"}
          </span>
          <button
            onClick={transmit}
            disabled={!canSend}
            className={`group inline-flex items-center gap-2 px-6 py-2.5 text-[10px] tracking-[0.2em] transition-all duration-200 ${
              status === "sent"  ? "bg-emerald-400/20 border border-emerald-400/40 text-emerald-400" :
              status === "error" ? "bg-red-400/10 border border-red-400/30 text-red-400" :
              status === "sending" ? "border border-[#c4a97e]/40 text-[#c4a97e] opacity-70 cursor-wait" :
              canSend ? "bg-[#c4a97e] hover:bg-[#d4b98e] text-[#050505]" :
              "border border-[#241e14] text-[#4a3824] cursor-not-allowed"
            }`}
            style={{ fontFamily: MONO }}
          >
            {status === "sent"    ? <>TRANSMITTED ✓</> :
             status === "sending" ? <>TRANSMITTING…</> :
             status === "error"   ? <>FAILED, RETRY</> :
             <>TRANSMIT <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 inline-block">↗</span></>}
          </button>
        </div>
      </motion.div>

      {/* ── Three contact cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#241e14] mb-20">
        <ContactCard
          label="EMAIL"
          value={EMAIL}
          sub={copied ? "COPIED ✓" : "CLICK TO COPY"}
          onClick={copyEmail}
          delay={0.1}
          icon={<EmailIcon />}
        />
        <ContactCard
          label="LINKEDIN"
          value="Omar Lemkecher"
          sub="VIEW PROFILE ↗"
          href={LINKEDIN}
          onClick={() => track("contact-linkedin")}
          delay={0.18}
          icon={<LinkedInIcon />}
        />
        <ContactCard
          label="GITHUB"
          value="Oltunisie"
          sub="VIEW REPOS ↗"
          href={GITHUB}
          onClick={() => track("contact-github")}
          delay={0.26}
          icon={<GitHubIcon />}
        />
      </div>

      {/* ── Footer stamp ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-[#181410]"
        style={{ fontFamily: MONO }}
      >
        <div className="flex items-center gap-6">
          <span className="text-[11px] tracking-[0.3em] text-[#4a3824]">◆ OL-001</span>
          <span className="text-[11px] tracking-[0.2em] text-[#4a3824]">
            OMAR LEMKECHER · UCLA SAMUELI SCHOOL OF ENGINEERING
          </span>
        </div>
        <span className="text-[11px] tracking-[0.2em] text-[#3a2e1e]">
          LOS ANGELES · CALIFORNIA · 2026
        </span>
      </motion.div>
    </section>
  );
}
