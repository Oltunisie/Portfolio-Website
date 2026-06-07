"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible,  setVisible]  = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isTouch,  setIsTouch]  = useState(true); // default true — hide on SSR

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  /* Dot tracks cursor closely */
  const dotX = useSpring(mx, { stiffness: 2000, damping: 80, mass: 0.3 });
  const dotY = useSpring(my, { stiffness: 2000, damping: 80, mass: 0.3 });

  /* Ring lags behind with spring */
  const ringX = useSpring(mx, { stiffness: 220, damping: 28, mass: 0.5 });
  const ringY = useSpring(my, { stiffness: 220, damping: 28, mass: 0.5 });

  useEffect(() => {
    /* Skip on touch devices */
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    if (touch) return;

    /* Hide default cursor */
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);

      /* Detect hovering over interactive elements */
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      setHovering(!!el?.closest("a, button, input, textarea, select, [role='button'], label"));
    };

    const onLeave  = () => setVisible(false);
    const onEnter  = () => setVisible(true);
    const onDown   = () => setClicking(true);
    const onUp     = () => setClicking(false);

    window.addEventListener("mousemove",       onMove,  { passive: true });
    window.addEventListener("mousedown",       onDown);
    window.addEventListener("mouseup",         onUp);
    document.addEventListener("mouseleave",    onLeave);
    document.addEventListener("mouseenter",    onEnter);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove",    onMove);
      window.removeEventListener("mousedown",    onDown);
      window.removeEventListener("mouseup",      onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [mx, my]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer ring — lags, expands on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-[#c4a97e]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? (hovering ? 0.7 : 0.25) : 0,
          width:  hovering ? 48 : 34,
          height: hovering ? 48 : 34,
          scale:  clicking ? 0.75 : 1,
          transition: "width 0.25s ease, height 0.25s ease, opacity 0.2s ease, scale 0.1s ease",
        }}
      />

      {/* Inner dot — precise, disappears on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-[#c4a97e]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? (hovering ? 0 : 1) : 0,
          width:  clicking ? 6 : 10,
          height: clicking ? 6 : 10,
          transition: "width 0.1s ease, height 0.1s ease, opacity 0.15s ease",
        }}
      />
    </>
  );
}
