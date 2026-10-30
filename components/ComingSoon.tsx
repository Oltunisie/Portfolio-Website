import Link from "next/link";
import type { Project } from "@/data/projects";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-space-grotesk)";

export default function ComingSoon({ project }: { project: Project }) {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] text-[#f0e6d3] px-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(#c4a97e 1px,transparent 1px),linear-gradient(90deg,#c4a97e 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c4a97e]/60" />

      <div className="relative z-10 text-center max-w-xl">
        <p className="text-[10px] tracking-[0.35em] text-[#c4a97e] mb-6" style={{ fontFamily: MONO }}>
          ◆ MISSION DOSSIER
        </p>
        <h1 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.02] mb-6" style={{ fontFamily: SANS }}>
          {project.title}
        </h1>

        <div className="inline-flex items-center gap-2.5 px-5 py-2 border border-[#6b5a3e] rounded-sm mb-8" style={{ fontFamily: MONO }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c4a97e] animate-pulse" />
          <span className="text-[11px] tracking-[0.3em] text-[#cabb9f]">UPDATING SOON</span>
        </div>

        <p className="text-sm md:text-base text-[#8a7a5a] leading-relaxed mb-10" style={{ fontFamily: SANS }}>
          This dossier is being finalized, simulation plots, CAD renders, and the full
          write-up are on the way. Check back shortly.
        </p>

        <Link href="/#projects"
          className="group inline-flex items-center gap-2 px-5 py-2.5 border border-[#6b5a3e] hover:border-[#c4a97e] hover:bg-[#c4a97e] text-[11px] tracking-[0.2em] text-[#cabb9f] hover:text-[#080603] rounded-sm transition-colors duration-200"
          style={{ fontFamily: MONO }}>
          <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span> ALL PROJECTS
        </Link>
      </div>
    </main>
  );
}
