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

  // Current production site
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
