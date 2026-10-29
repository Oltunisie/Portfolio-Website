import Link from "next/link";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-space-grotesk)";

/* ─────────────────────────── building blocks ─────────────────────────── */

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-16 px-6 md:px-16 lg:px-24">
      <div className="flex items-center gap-6 mb-10">
        <span className="text-[10px] tracking-[0.3em] text-[#c4a97e]" style={{ fontFamily: MONO }}>// {num}</span>
        <h2 className="text-2xl md:text-3xl font-light text-[#f0e6d3] tracking-tight" style={{ fontFamily: SANS }}>{title}</h2>
        <div className="flex-1 h-px bg-[#1a1208]" />
      </div>
      {children}
    </section>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-12 mb-4 text-lg font-light text-[#e8dcc6]" style={{ fontFamily: SANS }}>{children}</h3>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-3xl text-base md:text-lg leading-relaxed text-[#a89876] mb-5" style={{ fontFamily: SANS }}>
      {children}
    </p>
  );
}

/* Two-column label / value spec table */
function SpecTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="max-w-2xl border border-[#181410] divide-y divide-[#181410]">
      {rows.map(([label, value], i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] gap-6 px-5 py-3">
          <span className="text-[11px] tracking-[0.15em] text-[#8a7458]" style={{ fontFamily: MONO }}>{label}</span>
          <span className="text-sm text-right text-[#e8dcc6]" style={{ fontFamily: SANS }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

/* Multi-column data table with header row */
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto border border-[#181410]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#2e2010]">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-[10px] tracking-[0.2em] text-[#c4a97e] font-normal whitespace-nowrap" style={{ fontFamily: MONO }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-[#181410] last:border-0">
              {r.map((c, ci) => (
                <td key={ci} className={`px-4 py-3 text-sm whitespace-nowrap ${ci === 0 ? "text-[#cabb9f]" : "text-[#a89876]"}`} style={{ fontFamily: SANS }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Horizontal stat strip */
function SpecStrip({ items, cols = 7 }: { items: [string, string][]; cols?: number }) {
  // literal classes so Tailwind doesn't purge them
  const colClass = cols === 3 ? "lg:grid-cols-3" : cols === 6 ? "lg:grid-cols-6" : "lg:grid-cols-7";
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 ${colClass} gap-[1px] bg-[#181410] border border-[#181410]`}>
      {items.map(([label, value], i) => (
        <div key={i} className="bg-[#050505] px-4 py-4">
          <div className="text-[9px] tracking-[0.25em] text-[#6b5a3e] mb-1.5" style={{ fontFamily: MONO }}>{label}</div>
          <div className="text-sm text-[#f0e6d3]" style={{ fontFamily: SANS }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-sm border border-[#181410] bg-[#030303] p-5 text-[12px] leading-relaxed text-[#b9a888]" style={{ fontFamily: MONO }}>
      <code>{children}</code>
    </pre>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t} className="border border-[#2e2010] text-[#cabb9f] text-[11px] tracking-[0.15em] px-3 py-1.5" style={{ fontFamily: MONO }}>{t}</span>
      ))}
    </div>
  );
}

/* Architecture flow chain */
function FlowChain({ steps }: { steps: { label: string; note?: string; branch?: boolean }[] }) {
  return (
    <div className="max-w-2xl border border-[#181410] bg-[#030303] p-5" style={{ fontFamily: MONO }}>
      {steps.map((s, i) => (
        <div key={i} className={`flex items-baseline gap-3 py-1.5 ${s.branch ? "pl-8" : ""}`}>
          <span className="text-[#c4a97e] text-xs">{i === 0 ? "◆" : "→"}</span>
          <span className="text-sm text-[#e8dcc6]">{s.label}</span>
          {s.note && <span className="text-[11px] text-[#6b5a3e]">{s.note}</span>}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────── the page ──────────────────────────────── */

export default function LiquidFeedSystemPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f0e6d3]">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[#1a1208]">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0d0a05 0%,#050505 55%,#07060c 100%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#c4a97e 1px,transparent 1px),linear-gradient(90deg,#c4a97e 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c4a97e]/60" />

        <div className="relative px-6 md:px-16 lg:px-24 pt-8 pb-14">
          <div className="flex items-center justify-between">
            <Link href="/#projects"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-[#050505]/70 backdrop-blur border border-[#6b5a3e] hover:border-[#c4a97e] hover:bg-[#c4a97e] text-[11px] tracking-[0.2em] text-[#cabb9f] hover:text-[#080603] rounded-sm transition-colors duration-200"
              style={{ fontFamily: MONO }}>
              <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span> ALL PROJECTS
            </Link>
            <div className="text-right" style={{ fontFamily: MONO }}>
              <div className="text-[8px] tracking-[0.3em] text-[#2a1f10]">MISSION DOSSIER</div>
              <div className="text-[9px] tracking-[0.2em] text-[#c4a97e] mt-0.5">OL-005</div>
            </div>
          </div>

          <div className="mt-20 flex items-center gap-3" style={{ fontFamily: MONO }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] text-[#6b5a3e]">ACTIVE · IDR COMPLETE</span>
            <span className="text-[10px] tracking-[0.15em] text-[#2a1f10]">· 2026 – PRESENT</span>
          </div>

          <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-[#f0e6d3] leading-[0.95]" style={{ fontFamily: SANS }}>
            Liquid Propulsion Feed System
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-[#a89876] font-light leading-relaxed" style={{ fontFamily: SANS }}>
            First liquid propulsion system in UCLA Rocket Project history, a LOX/ethanol
            pressure-fed stack at 585 psi MEOP, simulated end-to-end in Python.
          </p>

          <div className="mt-6">
            <TagRow tags={["Python", "CoolProp", "SolidWorks", "FEA", "Cryogenics", "Pressure Systems"]} />
          </div>
        </div>
      </div>

      {/* ── Role bar ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#181410]">
        {([
          ["ROLE", "Feed System Lead"],
          ["TEAM", "Rocket Project at UCLA"],
          ["PERIOD", "Aug 2026 – Present"],
          ["STATUS", "Active — IDR Complete"],
        ] as [string, string][]).map(([l, v]) => (
          <div key={l} className="bg-[#050505] px-5 py-5">
            <div className="text-[9px] tracking-[0.28em] text-[#3a2e1e] mb-2" style={{ fontFamily: MONO }}>{l}</div>
            <div className="text-base font-light text-[#f0e6d3]" style={{ fontFamily: SANS }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Key specs strip ────────────────────────────────────── */}
      <div className="px-6 md:px-16 lg:px-24 py-16 border-b border-[#0f0d09]">
        <SpecStrip items={[
          ["MEOP", "585 psi"],
          ["COPV PRESSURE", "4,500 psi"],
          ["PROPELLANTS", "LOX / Ethanol"],
          ["PRESSURANT", "Helium (COPV)"],
          ["BURN TIME", "~5 s"],
          ["REGULATION", "Dual-stage dome"],
          ["TEAM SIZE", "5 engineers"],
        ]} />
      </div>

      {/* ── 01 System Overview ─────────────────────────────────── */}
      <Section num="01" title="System Overview">
        <Prose>
          UCLA Rocket Project&rsquo;s 2026&ndash;27 vehicle is its first liquid-propelled rocket,
          targeting the collegiate altitude record of 20 km. I lead the feed system: everything
          from the COPV to the injector face. The system is helium pressure-fed, a 12 L COPV stores
          helium at 4,500 psi, a dual-stage regulator drops it to 535 psi, and that pressure drives
          LOX and ethanol through separate plumbing lines to the combustion chamber.
        </Prose>
        <Prose>
          Every component was sized, analyzed, and documented from scratch. The feed system passed
          its Initial Design Review (IDR) on October 25, 2026.
        </Prose>

        <SubHead>Architecture</SubHead>
        <FlowChain steps={[
          { label: "COPV", note: "4,500 psi He" },
          { label: "Pilot Regulator", note: "hand-loaded, sets dome setpoint" },
          { label: "Dome Regulator", note: "high-flow, set at 535 psia" },
          { label: "Press Manifold", note: "tee split" },
          { label: "LOX Line", note: "-6 SS → LOX Tank (600 psi MEOP)", branch: true },
          { label: "Fuel Line", note: "-6 SS → Ethanol Tank (600 psi MEOP)", branch: true },
          { label: "Injector" },
        ]} />

        <SubHead>Base parameters</SubHead>
        <SpecTable rows={[
          ["TOTAL MASS FLOW RATE", "3.01 kg/s"],
          ["O/F RATIO", "1.3"],
          ["PRE-FIRE TANK PRESSURE", "535 psia"],
          ["STEADY-STATE TANK PRESSURE", "488 psi"],
          ["ENGINE BAY LINE SIZE", "-12 AN"],
          ["PRESS BAY LINE SIZE", "-6 AN"],
          ["FOS YIELD / ULTIMATE", "1.75 / 2.0"],
        ]} />
      </Section>

      {/* ── 02 Pressurant Simulation ───────────────────────────── */}
      <Section num="02" title="Pressurant Simulation (Python)">
        <Prose>
          I built a full end-to-end Python simulation of the helium pressurant system, from COPV
          blowdown through the regulator, down both propellant lines, and into the tanks. The
          simulation steps through time, propagating pressure, temperature, and density through
          every component using real fluid properties from CoolProp.
        </Prose>

        <SubHead>COPV Blowdown — Polytropic Cooling</SubHead>
        <Prose>
          The COPV is modeled as isentropic expansion (&gamma; = 1.667 for helium). As helium mass
          flows out, both pressure and temperature drop, the COPV ends the burn at ~668 psi and
          141.7 K, from a start at 4,500 psi. This temperature drop is critical: it drives
          downstream density calculations and sets regulator inlet conditions.
        </Prose>
        <DataTable
          headers={["PARAMETER", "INITIAL", "FINAL"]}
          rows={[
            ["COPV pressure", "4,500 psi", "668 psi"],
            ["COPV temperature", "—", "141.7 K"],
            ["He mass", "1.176 lbm", "0.395 lbm"],
            ["COPV pressure after pre-press", "4,133 psi", "—"],
          ]}
        />

        <SubHead>Regulator Model — Joule–Thomson Expansion</SubHead>
        <Prose>
          The dome regulator is modeled as isenthalpic (Joule&ndash;Thomson) expansion. Enthalpy is
          conserved across the orifice: downstream temperature is derived from upstream enthalpy at
          COPV conditions, not just from the pressure ratio. The helium exiting the regulator is
          therefore colder than a naive isentropic model predicts, which matters for density tracking
          downstream.
        </Prose>
        <Code>{`h_in  = PropsSI('H', 'P', P_copv, 'T', T_copv, 'Helium')
T_reg = PropsSI('T', 'P', P_reg,  'H', h_in,   'Helium')`}</Code>

        <SubHead>Buffer Phase — Ullage Expansion</SubHead>
        <Prose>
          Before the regulator opens, the ullage polytropically expands as tank pressure drops from
          535 &rarr; 490 psi. This ~45 ms transient is modeled explicitly using the volume ratio and
          &gamma;.
        </Prose>

        <SubHead>Pressure Ladder — Line Losses</SubHead>
        <Prose>
          Darcy&ndash;Weisbach friction losses for the tubing, plus K-factor and Cv losses for every
          fitting in both lines. LOX and fuel lines are computed separately, updating pressure,
          temperature, and density at each component.
        </Prose>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mb-6">
          <div className="border border-[#181410] p-5">
            <div className="text-[10px] tracking-[0.2em] text-[#c4a97e] mb-3" style={{ fontFamily: MONO }}>LOX LINE FITTINGS</div>
            <p className="text-sm text-[#a89876]" style={{ fontFamily: SANS }}>reducer → tee → check valve (Cv) → manifold tee → 2× bends</p>
          </div>
          <div className="border border-[#181410] p-5">
            <div className="text-[10px] tracking-[0.2em] text-[#c4a97e] mb-3" style={{ fontFamily: MONO }}>FUEL LINE FITTINGS</div>
            <p className="text-sm text-[#a89876]" style={{ fontFamily: SANS }}>reducer → tee → 2× bends → check valve (Cv) → manifold tee → 2× bends → elbow</p>
          </div>
        </div>
        <SpecTable rows={[
          ["LOX LINE — TOTAL ΔP", "~28 psi"],
          ["FUEL LINE — TOTAL ΔP", "~10 psi"],
        ]} />
      </Section>

      {/* ── 03 Choking Analysis ────────────────────────────────── */}
      <Section num="03" title="Choking Analysis">
        <Prose>
          Choked flow through the dome regulator is a stability feature, not a concern. When the flow
          is choked, downstream pressure fluctuations cannot propagate upstream, making the
          regulator&rsquo;s setpoint independent of what happens in the lines. I verified that the
          flow stays choked for the majority of the burn.
        </Prose>
        <Prose>
          For helium (&gamma; = 1.667), the critical pressure ratio is P&#8322;/P&#8321; &le; 0.488.
          Flow chokes when COPV pressure exceeds 1,045 psi (= 490 psi / 0.488). Since the COPV starts
          at 4,500 psi and only reaches this threshold near the end of the burn, the system runs
          choked for ~80% of burn time.
        </Prose>
        <DataTable
          headers={["PARAMETER", "VALUE", "UNITS"]}
          rows={[
            ["γ (helium)", "1.667", "—"],
            ["Critical pressure ratio", "0.488", "—"],
            ["Reg downstream pressure", "510", "psi"],
            ["COPV pressure at unchoke", "1,045", "psi"],
          ]}
        />
      </Section>

      {/* ── 04 Cryogenic Thermal Analysis ──────────────────────── */}
      <Section num="04" title="Cryogenic Thermal Analysis">
        <Prose>
          LOX at 90 K presents real thermal challenges. I built a heat-transfer script covering two
          regimes: steady-state boiloff during hold, and fill boiloff during the chill-in transient.
        </Prose>

        <SubHead>A · Steady-State Heat Leak</SubHead>
        <Prose>
          Natural convection from ambient air to the LOX tank surface is computed via the
          Churchill&ndash;Chu correlation for external natural convection on a vertical cylinder
          (Gr &rarr; Ra = Gr&nbsp;&times;&nbsp;Pr &rarr; Nu &rarr; h_conv). Radiation is added via a
          linearized Stefan&ndash;Boltzmann term (&epsilon; = 0.9). The total heat leak sets the
          steady-state boiloff rate and bounds the thermal-expansion overpressure risk.
        </Prose>
        <SpecTable rows={[
          ["LOX STEADY-STATE BOILOFF ṁ", "0.0068 kg/s"],
          ["LOX WARM RATE", "0.032 K/s"],
          ["TIME TO CRITICAL TEMPERATURE", "328.7 s"],
        ]} />

        <SubHead>B · Fill Boiloff (Chill-In Model)</SubHead>
        <Prose>
          When LOX first contacts the warm aluminum walls (~298 K) it boils violently. The total LOX
          boiled off is set entirely by the thermal energy stored in the aluminum walls, not by the
          heat transfer coefficient. I used a lumped-capacitance model, validated by a Biot number
          of Bi &asymp; 0.004 &lt;&lt; 0.1.
        </Prose>
        <Code>{`# NIST 6061-T6 aluminum cp(T) — valid 4–300 K
def cp_al(T):
    x = np.log10(T)
    log_cp = (46.6467 - 314.292*x + 866.662*x**2 - 1298.3*x**3
              + 1162.27*x**4 - 637.795*x**5 + 210.351*x**6
              - 38.3094*x**7 + 2.96344*x**8)
    return 10**log_cp  # J/kg·K

H_vap = PropsSI('H','T',90,'Q',1,'Oxygen') - PropsSI('H','T',90,'Q',0,'Oxygen')
# → 213,100 J/kg

Q_total   = m_wall * quad(cp_al, T_lox, T_atm)[0]  # J
m_boiloff = Q_total / H_vap                         # → ~4 kg LOX`}</Code>
        <SpecTable rows={[
          ["WALL MASS (Al only)", "5.26 kg"],
          ["H_vap (LOX at 90 K)", "213,100 J/kg"],
          ["TOTAL HEAT ABSORBED BY WALL", "~850 kJ"],
          ["LOX BOILED OFF DURING FILL", "~4 kg (lower bound)"],
        ]} />
        <Prose>
          This is a lower bound, no ambient heat leak and no fitting thermal mass included. The
          boiling regime depends on wall superheat: film boiling dominates until the Leidenfrost
          transition (~150 K &Delta;T for LOX on aluminum), after which nucleate boiling takes over
          with a much higher heat transfer coefficient.
        </Prose>
      </Section>

      {/* ── 05 Structural Analyses ─────────────────────────────── */}
      <Section num="05" title="Structural Analyses">
        <Prose>
          Every load-bearing component went through hand calculations and, where needed, ANSYS FEA.
        </Prose>

        <SubHead>A · Press Manifold Bolts</SubHead>
        <Prose>
          The press manifold mounts to the carbon-fiber body tube with two 10-32 Black Oxide bolts.
          The critical load case is recovery deceleration (197 ft/s&sup2;) applied to the 8 lb press
          bay mass. The manifold&rsquo;s curved face sits flush against the body tube, eliminating
          bending moments and leaving pure shear on the bolts.
        </Prose>
        <div className="grid lg:grid-cols-2 gap-6 items-start mb-2">
          <SpecTable rows={[
            ["MAX ACCELERATION (RECOVERY)", "197 ft/s²"],
            ["PRESS BAY MASS", "8 lbm"],
            ["COPV MASS (11″ above)", "16 lbm"],
            ["BOLT SPEC", "10-32 Black Oxide"],
            ["D_major / D_minor", "0.190 / 0.151 in"],
            ["BODY TUBE THICKNESS", "0.100 in"],
          ]} />
          <DataTable
            headers={["CHECK", "STRESS (psi)", "MOS YIELD", "MOS ULT"]}
            rows={[
              ["Shear", "4,103", "6.2", "10.0"],
              ["Bearing", "3,867", "4.7", "—"],
            ]}
          />
        </div>
        <Prose>
          FEA was also run in ANSYS for recovery and vertical-flight acceleration cases, with point
          masses for the press bay (8 lbm) and COPV (16 lbm, 11″ above the manifold) and revolute
          joints simulating the bolt connections.
        </Prose>

        <SubHead>B · SS 316 Helium Tubing — Hoop Stress</SubHead>
        <Prose>
          The press bay uses -6 stainless tubing at COPV pressure (4,500 psi). The thin-wall
          approximation is invalid here (t/r_i = 0.43 &gt;&gt; 0.1), so I used the thick-wall
          Lam&eacute; equation.
        </Prose>
        <Code>{`σ_hoop = P × (r_i² + r_o²) / (r_o² − r_i²)`}</Code>
        <SpecTable rows={[
          ["LINE SIZE", "-6 SS 316"],
          ["OD / WALL / ID", "0.375 / 0.065 / 0.245 in"],
          ["COPV PRESSURE", "4,500 psi"],
          ["σ_hoop (Lamé)", "12,981 psi"],
          ["MOS YIELD / ULTIMATE (annealed 316)", "0.32 / 1.89"],
          ["-2 LINE TO PILOT REG (4,300 psi)", "σ_hoop 13,438 psi · MOS 0.28 / 1.79"],
        ]} />

        <SubHead>C · Big Bracket (Engine Bay)</SubHead>
        <Prose>
          The engine bay&rsquo;s main structural bracket supports both main propellant valves and
          their Bimba pneumatic actuators. It was validated in three load cases; hand calcs covered
          the legs and the &ldquo;diving board&rdquo; cantilever geometry in bending, and FEA
          confirmed.
        </Prose>
        <DataTable
          headers={["LOAD CASE", "MAX STRESS", "MOS YIELD", "MOS ULT"]}
          rows={[
            ["Actuation load (377 lbf)", "19 ksi", "0.19", "0.17"],
            ["Inertial / recovery", "1.1 ksi", "19.4", "19.1"],
            ["Vibrational (200–550 Hz)", "2.2 ksi", "9.6", "9.4"],
          ]}
        />
      </Section>

      {/* ── 06 Hardware ────────────────────────────────────────── */}
      <Section num="06" title="Hardware Design">
        <div className="grid md:grid-cols-2 gap-[1px] bg-[#181410] border border-[#181410] mb-10">
          {([
            ["Press Manifold", "Curved body-tube interface, tee branch, two bolt holes, ORB/SAE ports."],
            ["Press Bay Assembly", "Full planar tube routing (all bends in one plane), manifold, dome reg, PT support bracket."],
            ["PT Support Bracket", "PLA 3D-printed; hex cutouts index on AN fitting flats, clamps into the press bracket."],
            ["LOX Manifold", "2.3″ × 1.5″ × 1.4″ 6061-T6 Al; integrates relief valve and check valve."],
            ["Fuel Manifold", "1.3″ cube; AN ports with O-ring face seal, replacing multiple inline fittings."],
            ["Fuel CV Support Bracket", "Al 6061, bolted to the body tube, 0.1″ tolerance for the PTFE sleeve."],
            ["Engine Bay", "Big bracket, main and vent valves, Bimba actuators, -12 AN flex lines."],
            ["System Schematic", "Full feed-system P&ID from the IDR."],
          ] as [string, string][]).map(([name, desc]) => (
            <div key={name} className="bg-[#050505] p-5">
              <div className="text-sm text-[#f0e6d3] mb-1.5" style={{ fontFamily: SANS }}>{name}</div>
              <p className="text-[13px] leading-relaxed text-[#8b7d6b]" style={{ fontFamily: SANS }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#c4a97e] mb-3" style={{ fontFamily: MONO }}>PRESS BAY</div>
            <SpecStrip cols={3} items={[
              ["MASS", "8 lb"],
              ["LENGTH", "9.7 in"],
              ["TUBE OD", "0.375 in"],
              ["TUBE WALL", "0.065 in"],
              ["MATERIAL", "SS 316 / Al 6061"],
              ["TUBING", "-6 (press bay)"],
            ]} />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#c4a97e] mb-3" style={{ fontFamily: MONO }}>ENGINE BAY</div>
            <SpecStrip cols={3} items={[
              ["MASS", "13.8 lb"],
              ["LENGTH", "20.92 in"],
              ["MAIN LINES", "-12 AN"],
            ]} />
          </div>
        </div>
      </Section>

      {/* ── 07 Diffuser ────────────────────────────────────────── */}
      <Section num="07" title="Diffuser">
        <Prose>
          A diffuser was designed to slow helium entering the LOX tank from the pressurization inlet,
          preventing direct impingement on the cryogenic propellant. The design is based on the NASA
          TN-D3458 turbulent free-jet decay model; a perforated-plate approach was selected for
          manufacturing simplicity and even flow distribution. The -6 line is welded internally to
          the diffuser body.
        </Prose>
        <SpecTable rows={[
          ["HOLE DIAMETER", "3.18 mm"],
          ["AREA PER HOLE", "7.92 mm²"],
          ["NUMBER OF HOLES", "30"],
          ["TOTAL OPEN AREA", "238 mm²"],
          ["AREA INCREASE RATIO", "11.8×"],
        ]} />
      </Section>

      {/* ── 08 Tools & Methods ─────────────────────────────────── */}
      <Section num="08" title="Tools & Methods">
        <TagRow tags={[
          "Python", "CoolProp", "SolidWorks", "ANSYS",
          "NIST Cryogenics DB", "scipy", "matplotlib", "Darcy–Weisbach",
          "Churchill–Chu", "Lumped Capacitance", "Lamé Thick-Wall",
        ]} />
        <div className="mt-6 max-w-3xl space-y-2 text-sm text-[#8b7d6b]" style={{ fontFamily: MONO }}>
          <p>SIM SUITE · config.py · main.py · PressureLadder.py · losses.py · plots.py · LOX_heat_transfer.py</p>
          <p>FLUID PROPS · CoolProp PropsSI (helium + LOX)</p>
          <p>FEA · ANSYS (press manifold, big bracket, fuel CV support)</p>
        </div>
      </Section>

      {/* ── 09 What's Next ─────────────────────────────────────── */}
      <Section num="09" title="What's Next">
        <div className="max-w-2xl space-y-3">
          {[
            "CDR (Critical Design Review) — manufacturing sign-off",
            "Hot-fire static test campaign",
            "Flight vehicle integration",
            "20 km collegiate altitude attempt",
          ].map((t) => (
            <div key={t} className="flex gap-3 items-start">
              <span className="shrink-0 text-[#c4a97e] text-[10px] mt-1.5" style={{ fontFamily: MONO }}>◆</span>
              <p className="text-base text-[#a89876]" style={{ fontFamily: SANS }}>{t}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Footer nav ─────────────────────────────────────────── */}
      <div className="border-t border-[#1a1208] px-6 md:px-16 lg:px-24 py-12">
        <Link href="/#projects"
          className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#7a6a4e] hover:text-[#c4a97e] transition-colors duration-200"
          style={{ fontFamily: MONO }}>
          <span className="transition-transform duration-150 group-hover:-translate-x-1">←</span> BACK TO ALL PROJECTS
        </Link>
      </div>
    </div>
  );
}
