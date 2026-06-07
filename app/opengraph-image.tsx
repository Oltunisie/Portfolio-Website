import { ImageResponse } from "next/og";

export const dynamic     = "force-static";
export const alt         = "Omar Lemkecher — Aerospace Engineering · UCLA";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const tags = ["Propulsion", "FEA", "SolidWorks", "ADCS", "Python"];

  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #0d0a05 0%, #050505 70%, #030208 100%)",
          display: "flex",
        }} />

        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(196,169,126,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(196,169,126,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          display: "flex",
        }} />

        {/* Top beige accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "#c4a97e",
          display: "flex",
        }} />

        {/* Radial glow top-right */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,169,126,0.06) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Mission label */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          color: "#c4a97e",
          fontSize: 13,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: 28,
          fontFamily: "monospace",
        }}>
          <span>OL-001 / MISSION DOSSIER</span>
        </div>

        {/* Name */}
        <div style={{
          color: "#f0e6d3",
          fontSize: 88,
          fontWeight: 200,
          lineHeight: 0.92,
          letterSpacing: "-0.025em",
          marginBottom: 28,
        }}>
          Omar Lemkecher
        </div>

        {/* Role */}
        <div style={{
          color: "#8a7a5a",
          fontSize: 26,
          fontWeight: 300,
          letterSpacing: "0.02em",
          marginBottom: 44,
        }}>
          Aerospace Engineering · UCLA Samueli · 4.0 GPA
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 10 }}>
          {tags.map((tag) => (
            <div key={tag} style={{
              border: "1px solid #2e2010",
              color: "#6b5a3e",
              fontSize: 11,
              letterSpacing: "0.18em",
              padding: "5px 14px",
              fontFamily: "monospace",
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Domain — bottom right */}
        <div style={{
          position: "absolute", bottom: 72, right: 80,
          color: "#3a2e1e",
          fontSize: 13,
          letterSpacing: "0.2em",
          fontFamily: "monospace",
          display: "flex",
        }}>
          omarlemkecher.com
        </div>

        {/* Section marker */}
        <div style={{
          position: "absolute", top: 72, right: 80,
          color: "#2a1f10",
          fontSize: 11,
          letterSpacing: "0.25em",
          fontFamily: "monospace",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        }}>
          <span>// 01</span>
          <span>HERO</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
