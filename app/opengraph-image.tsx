import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic     = "force-static";
export const alt         = "Omar Lemkecher — Aerospace Engineering · UCLA";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const tags = ["Propulsion", "FEA", "SolidWorks", "ANSYS", "Python"];

  const bg = await readFile(join(process.cwd(), "public/projects/hybrid-rocket-feed-system/fire.jpg"));
  const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{
        background: "#050505", width: "100%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "72px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Hybrid hotfire photo background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bgSrc} width={1200} height={630} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

        {/* Dark overlays for text legibility */}
        <div style={{ position: "absolute", inset: 0, display: "flex",
          background: "linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.86) 36%, rgba(5,5,5,0.45) 70%, rgba(5,5,5,0.25) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex",
          background: "linear-gradient(0deg, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.1) 55%, rgba(5,5,5,0.35) 100%)" }} />

        {/* Top beige accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#c4a97e", display: "flex" }} />

        {/* Mission label */}
        <div style={{ display: "flex", color: "#c4a97e", fontSize: 13, letterSpacing: "0.3em",
          textTransform: "uppercase", marginBottom: 24, fontFamily: "monospace" }}>
          OL-001 / MISSION DOSSIER
        </div>

        {/* Name */}
        <div style={{ color: "#f0e6d3", fontSize: 88, fontWeight: 200, lineHeight: 0.92,
          letterSpacing: "-0.025em", marginBottom: 24, display: "flex" }}>
          Omar Lemkecher
        </div>

        {/* Role */}
        <div style={{ color: "#d4c5a9", fontSize: 26, fontWeight: 300, letterSpacing: "0.02em",
          marginBottom: 40, display: "flex" }}>
          Aerospace Engineering · UCLA Samueli
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 10 }}>
          {tags.map((tag) => (
            <div key={tag} style={{ border: "1px solid #4a3a26", color: "#cabb9f", fontSize: 11,
              letterSpacing: "0.18em", padding: "6px 14px", fontFamily: "monospace", display: "flex",
              background: "rgba(5,5,5,0.45)" }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Domain — bottom right */}
        <div style={{ position: "absolute", bottom: 72, right: 80, color: "#a89876", fontSize: 13,
          letterSpacing: "0.2em", fontFamily: "monospace", display: "flex" }}>
          omarlemkecher.com
        </div>

        {/* Section marker — top right */}
        <div style={{ position: "absolute", top: 72, right: 80, color: "#8a7458", fontSize: 11,
          letterSpacing: "0.25em", fontFamily: "monospace", display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: 4 }}>
          <span>// 01</span>
          <span>HERO</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
