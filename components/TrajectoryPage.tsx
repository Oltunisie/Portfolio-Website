"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ─── Milestone data ──────────────────────────────────────────── */
interface Node {
  id:       string;
  year:     string;
  title:    string;
  sub:      string;
  detail:   string;
  phase:    string;
  type:     "origin" | "milestone" | "major" | "active" | "future" | "star";
  cx:       number;
  cy:       number;
  labelPos: "above" | "below";
}

const NODES: Node[] = [
  {
    id: "origins", year: "2022", cx: 60,   cy: 420,
    title: "Launch Site", sub: "Sfax, Tunisia",
    detail: "Founded the Horizon Astronomy Club. First exposure to aerospace. The mission begins.",
    phase: "PRE-LAUNCH", type: "origin", labelPos: "below",
  },
  {
    id: "cnes", year: "2022–23", cx: 210,  cy: 355,
    title: "Zero-G Campaign", sub: "CNES · Bordeaux",
    detail: "Selected for the 66th Parabolic Flight Campaign. Three microgravity experiments aboard a modified Airbus A310.",
    phase: "PHASE I", type: "major", labelPos: "above",
  },
  {
    id: "px1", year: "2023", cx: 340,  cy: 295,
    title: "Young Searchers Prize", sub: "Project X · 1st Win",
    detail: "Space probe design concept. First-place win at the national engineering competition, Tunisia.",
    phase: "PHASE I", type: "milestone", labelPos: "below",
  },
  {
    id: "ucla", year: "2023", cx: 470,  cy: 235,
    title: "UCLA Samueli", sub: "Los Angeles, CA",
    detail: "Enrolled in Aerospace Engineering. 4.0 GPA. Westwood, CA. The trajectory steepens.",
    phase: "PHASE II", type: "major", labelPos: "above",
  },
  {
    id: "px2", year: "2024", cx: 590,  cy: 196,
    title: "Back-to-Back Win", sub: "Project X · 2nd Win",
    detail: "Zero-G experiment design based on CNES flight data. Second consecutive national champion.",
    phase: "PHASE II", type: "milestone", labelPos: "below",
  },
  {
    id: "bruinspace", year: "2025", cx: 710,  cy: 158,
    title: "ADCS Lead", sub: "BruinSpace · CubeSat",
    detail: "Leading attitude determination and control system development for UCLA BruinSpace's satellite mission.",
    phase: "PHASE III", type: "active", labelPos: "above",
  },
  {
    id: "rocket", year: "2025", cx: 840,  cy: 123,
    title: "Feed Systems Lead", sub: "Hybrid Rocket · 586 lbf",
    detail: "Designing a 750 psi N₂O feed system for UCLA Rocket Project. Target apogee: 13,400 ft.",
    phase: "PHASE III", type: "active", labelPos: "below",
  },
  {
    id: "intern", year: "2026", cx: 975,  cy: 88,
    title: "Summer Internship", sub: "Target · 2026",
    detail: "Seeking propulsion, ADCS, or systems engineering role. Open to opportunities.",
    phase: "PHASE IV", type: "future", labelPos: "above",
  },
  {
    id: "grad", year: "2028", cx: 1105, cy: 58,
    title: "Graduation", sub: "UCLA Samueli",
    detail: "B.S. Aerospace Engineering · Expected June 2028. The ascent completes.",
    phase: "PHASE IV", type: "future", labelPos: "below",
  },
  {
    id: "orbit", year: "★", cx: 1215, cy: 32,
    title: "Target Orbit", sub: "SpaceX · NASA · Blue Origin",
    detail: "The mission continues. Building the future of flight — one equation at a time.",
    phase: "ORBIT", type: "star", labelPos: "above",
  },
];

/* Smooth bezier path through all node positions */
const PATH = `
  M 60,420
  C 100,415 155,385 210,355
  C 250,335 290,315 340,295
  C 380,277 420,257 470,235
  C 515,217 550,210 590,196
  C 635,182 668,170 710,158
  C 750,147 790,136 840,123
  C 880,112 925,100 975,88
  C 1015,77 1058,67 1105,58
  C 1148,48 1178,40 1215,32
`.trim();

/* Dashed line from path to label */
const DASH_LEN = 28;

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-space-grotesk)";

/* ─── Node dot ────────────────────────────────────────────────── */
function NodeDot({ node, active, onEnter, onLeave }:
  { node: Node; active: boolean; onEnter: () => void; onLeave: () => void }) {

  const isActive = node.type === "active";
  const isStar   = node.type === "star";
  const isFuture = node.type === "future";

  return (
    <g onMouseEnter={onEnter} onMouseLeave={onLeave}
       style={{ cursor: "pointer" }}>

      {/* Pulse ring for active nodes */}
      {isActive && (
        <motion.circle cx={node.cx} cy={node.cy} r={12}
          stroke="#c4a97e" strokeWidth="1" fill="none"
          animate={{ r: [10, 18, 10], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
      )}

      {/* Hover ring */}
      {active && (
        <motion.circle cx={node.cx} cy={node.cy} r={16}
          stroke="#c4a97e" strokeWidth="1" fill="none"
          initial={{ r: 6, opacity: 0 }}
          animate={{ r: 16, opacity: 0.5 }}
          transition={{ duration: 0.25 }} />
      )}

      {/* Main dot */}
      {isStar ? (
        <motion.text x={node.cx} y={node.cy + 6} textAnchor="middle"
          fill={active ? "#f0e6d3" : "#c4a97e"} fontSize="16"
          style={{ fontFamily: MONO, userSelect: "none" }}>
          ★
        </motion.text>
      ) : (
        <motion.circle cx={node.cx} cy={node.cy}
          r={active ? 7 : isActive ? 5 : 4}
          fill={
            active   ? "#f0e6d3" :
            isActive ? "#c4a97e" :
            isFuture ? "#3a2e1e" :
            node.type === "major" ? "#8a7a5a" : "#4a3824"
          }
          stroke={active || isActive ? "#c4a97e" : "#2e2010"}
          strokeWidth="1"
          animate={{ r: active ? 7 : isActive ? 5 : 4 }}
          transition={{ duration: 0.2 }} />
      )}

      {/* Tick line to label */}
      <line
        x1={node.cx} y1={node.cy + (node.labelPos === "below" ? 6 : -6)}
        x2={node.cx} y2={node.cy + (node.labelPos === "below" ? DASH_LEN : -DASH_LEN)}
        stroke="#1e1508" strokeWidth="1" strokeDasharray="3 3" />

      {/* Year label */}
      <text
        x={node.cx}
        y={node.cy + (node.labelPos === "below" ? DASH_LEN + 13 : -DASH_LEN - 4)}
        textAnchor="middle" fill={active ? "#c4a97e" : "#3a2e1e"}
        fontSize="9" style={{ fontFamily: MONO, letterSpacing: "0.15em" }}>
        {node.year}
      </text>
    </g>
  );
}

/* ─── Detail panel ────────────────────────────────────────────── */
function DetailPanel({ node }: { node: Node | null }) {
  return (
    <motion.div
      key={node?.id ?? "empty"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: node ? 1 : 0, y: node ? 0 : 8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute bottom-0 left-0 right-0 border-t border-[#1a1208] bg-[#050505]/95 backdrop-blur-sm"
      style={{ fontFamily: MONO, minHeight: "88px" }}
    >
      {node && (
        <div className="px-6 md:px-16 lg:px-24 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-16">
          <div className="flex items-center gap-3">
            <span className="text-[9px] tracking-[0.25em] text-[#c4a97e]">{node.phase}</span>
            <span className="text-[9px] text-[#2a1f10]">·</span>
            <span className="text-[9px] tracking-[0.2em] text-[#4a3824]">{node.year}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-light text-[#f0e6d3] mb-1" style={{ fontFamily: SANS }}>
              {node.title}
              <span className="text-[#4a3824] text-xs ml-2" style={{ fontFamily: MONO }}>
                · {node.sub}
              </span>
            </p>
            <p className="text-xs text-[#6b5a3e] leading-relaxed" style={{ fontFamily: SANS }}>
              {node.detail}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function TrajectoryPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  const activeNode = NODES.find(n => n.id === hovered) ?? null;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col" style={{ fontFamily: MONO }}>

      {/* ── Navbar back link ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-5 border-b border-[#0f0d09]">
        <Link href="/"
          className="text-[9px] tracking-[0.25em] text-[#4a3824] hover:text-[#c4a97e] transition-colors duration-200">
          ← BACK TO DOSSIER
        </Link>
        <span className="text-[9px] tracking-[0.25em] text-[#c4a97e]">◆ OL-001 · TRAJECTORY</span>
      </div>

      {/* ── Section header ─────────────────────────────────────── */}
      <div className="px-6 md:px-16 lg:px-24 pt-16 pb-8">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[10px] tracking-[0.3em] text-[#c4a97e] mb-4">
          ◆ OL-001
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-extralight text-[#f0e6d3] tracking-tight mb-3"
          style={{ fontFamily: SANS }}>
          // 06&nbsp;&nbsp;Trajectory
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-[11px] tracking-[0.12em] text-[#5a4a30]">
          From Sfax to Westwood — hover each node to read the mission log.
        </motion.p>
      </div>

      {/* ── SVG trajectory ─────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <div className="overflow-x-auto pb-24" style={{ scrollbarWidth: "none" }}>
          <div style={{ minWidth: "900px" }}>
            <svg
              viewBox="0 0 1300 480"
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
              style={{ height: "min(55vh, 460px)" }}
            >
              {/* Subtle horizontal grid lines */}
              {[100, 200, 300, 400].map(y => (
                <line key={y} x1="40" y1={y} x2="1260" y2={y}
                  stroke="#0f0d09" strokeWidth="1" />
              ))}

              {/* Phase labels (left axis) */}
              {[
                { y: 45,  label: "ORBIT"   },
                { y: 110, label: "PHASE IV" },
                { y: 185, label: "PHASE III"},
                { y: 255, label: "PHASE II" },
                { y: 335, label: "PHASE I"  },
                { y: 415, label: "LAUNCH"   },
              ].map(p => (
                <text key={p.y} x="36" y={p.y + 4} textAnchor="end"
                  fill="#1e1508" fontSize="8"
                  style={{ fontFamily: MONO, letterSpacing: "0.15em" }}>
                  {p.label}
                </text>
              ))}

              {/* Glow behind path */}
              <motion.path d={PATH}
                stroke="#c4a97e" strokeWidth="6" fill="none" strokeLinecap="round"
                opacity={0.04}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.8, ease: "easeInOut", delay: 0.4 }}
              />

              {/* Main trajectory path */}
              <motion.path d={PATH}
                stroke="#c4a97e" strokeWidth="1.5" fill="none" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.8, ease: "easeInOut", delay: 0.4 }}
              />

              {/* Velocity indicators — small perpendicular ticks along the path */}
              {NODES.slice(0, -1).map((n, i) => {
                const next = NODES[i + 1];
                const mx = (n.cx + next.cx) / 2;
                const my = (n.cy + next.cy) / 2;
                const dx = next.cx - n.cx;
                const dy = next.cy - n.cy;
                const len = Math.sqrt(dx*dx + dy*dy);
                const px = -dy / len * 6;
                const py =  dx / len * 6;
                return (
                  <motion.line key={n.id}
                    x1={mx - px} y1={my - py} x2={mx + px} y2={my + py}
                    stroke="#2e2010" strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 + i * 0.05 }}
                  />
                );
              })}

              {/* Nodes */}
              {NODES.map((node, i) => (
                <motion.g key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                >
                  <NodeDot
                    node={node}
                    active={hovered === node.id}
                    onEnter={() => setHovered(node.id)}
                    onLeave={() => setHovered(null)}
                  />
                </motion.g>
              ))}

              {/* "CURRENT POSITION" callout */}
              {["bruinspace", "rocket"].map(id => {
                const n = NODES.find(x => x.id === id)!;
                return (
                  <motion.text key={id}
                    x={n.cx + 14} y={n.cy - 8}
                    fill="#c4a97e" fontSize="7" opacity={0.5}
                    style={{ fontFamily: MONO, letterSpacing: "0.12em" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 3.2 }}>
                    ACTIVE
                  </motion.text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Detail panel — sticks to bottom */}
        <DetailPanel node={activeNode} />
      </div>

      {/* ── Phase legend ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.5 }}
        className="px-6 md:px-16 lg:px-24 pb-8 pt-4 flex flex-wrap gap-6 border-t border-[#0f0d09]"
      >
        {[
          { dot: "#4a3824", label: "MILESTONE"    },
          { dot: "#8a7a5a", label: "MAJOR EVENT"  },
          { dot: "#c4a97e", label: "ACTIVE ●"     },
          { dot: "#3a2e1e", label: "UPCOMING"     },
          { dot: "#c4a97e", label: "★ TARGET"     },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: l.dot }} />
            <span className="text-[8px] tracking-[0.2em] text-[#3a2e1e]">{l.label}</span>
          </div>
        ))}

        <div className="ml-auto">
          <span className="text-[8px] tracking-[0.15em] text-[#1e1508]">
            OL-001 · MISSION TRAJECTORY MAP
          </span>
        </div>
      </motion.div>
    </div>
  );
}
