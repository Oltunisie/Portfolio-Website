import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";

export const dynamic     = "force-static";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt         = "Project — Omar Lemkecher";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx     = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  const num     = String((idx < 0 ? 0 : idx) + 1).padStart(3, "0");
  const tags    = (project?.tags ?? []).slice(0, 5);
  const title   = project?.title ?? "Project";
  const meta    = [project?.period, project?.status].filter(Boolean).join("  ·  ");

  return new ImageResponse(
    (
      <div style={{
        background: "#050505", width: "100%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "72px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, display: "flex",
          background: "linear-gradient(135deg, #0d0a05 0%, #050505 70%, #030208 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex",
          backgroundImage: "linear-gradient(rgba(196,169,126,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(196,169,126,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#c4a97e", display: "flex" }} />
        <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,169,126,0.07) 0%, transparent 70%)", display: "flex" }} />

        {/* Mission label */}
        <div style={{ display: "flex", color: "#c4a97e", fontSize: 13, letterSpacing: "0.3em",
          textTransform: "uppercase", marginBottom: 24, fontFamily: "monospace" }}>
          OL-{num} / MISSION DOSSIER
        </div>

        {/* Project title */}
        <div style={{ color: "#f0e6d3", fontSize: title.length > 26 ? 64 : 80, fontWeight: 200,
          lineHeight: 0.96, letterSpacing: "-0.025em", marginBottom: 24, maxWidth: 980, display: "flex" }}>
          {title}
        </div>

        {/* Period · status */}
        {meta && (
          <div style={{ display: "flex", color: "#8a7a5a", fontSize: 24, fontWeight: 300, marginBottom: 40 }}>
            {meta}
          </div>
        )}

        {/* Tags */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <div key={tag} style={{ border: "1px solid #2e2010", color: "#6b5a3e", fontSize: 12,
              letterSpacing: "0.16em", padding: "6px 14px", fontFamily: "monospace", display: "flex" }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Author — bottom right */}
        <div style={{ position: "absolute", bottom: 72, right: 80, display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: 4 }}>
          <div style={{ color: "#cabb9f", fontSize: 20, fontWeight: 300, display: "flex" }}>Omar Lemkecher</div>
          <div style={{ color: "#3a2e1e", fontSize: 13, letterSpacing: "0.2em", fontFamily: "monospace", display: "flex" }}>
            omarlemkecher.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
