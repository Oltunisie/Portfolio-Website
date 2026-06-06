"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";
import HeroV2 from "./HeroV2";
import NavbarV2 from "./NavbarV2";
import ProjectsV2 from "./ProjectsV2";

const COOKIE_NAME = "ol_preview";
const COOKIE_VALUE = "enabled";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function PreviewGate() {
  const [isPreview, setIsPreview] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsPreview(getCookie(COOKIE_NAME) === COOKIE_VALUE);
    setReady(true);
  }, []);

  // Avoid flash — render nothing until cookie is read client-side
  if (!ready) return null;

  if (isPreview) {
    return (
      <>
        <NavbarV2 />
        <main>
          <HeroV2 />
          <ProjectsV2 />
        </main>
      </>
    );
  }

  // Coming soon teaser
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          filter: "blur(18px) brightness(0.35)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6" style={{ fontFamily: "var(--font-geist-mono)" }}>
        <p className="text-[#c4a97e] text-[10px] tracking-[0.35em] mb-6">◆ OL-001</p>
        <h1
          className="text-[clamp(3rem,10vw,7rem)] font-extralight text-[#f0e6d3] tracking-tight leading-none mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Omar Lemkecher
        </h1>
        <div className="w-24 h-px bg-[#c4a97e] mx-auto my-6 opacity-60" />
        <p className="text-[11px] tracking-[0.4em] text-[#c4a97e] uppercase mb-2">
          New site — coming soon
        </p>
        <p className="text-[10px] tracking-[0.2em] text-[#3a2e1e]">
          Aerospace Engineering · UCLA
        </p>
      </div>
    </main>
  );
}
