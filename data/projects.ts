export type ProcessStep = {
  title: string;
  description: string;
};

export type MediaItem =
  | { type: "image";   file: string; caption?: string }
  | { type: "video";   file: string; caption?: string }    // local .mp4/.webm in public/projects/<slug>/
  | { type: "youtube"; id: string;   caption?: string }    // YouTube video ID e.g. "dQw4w9WgXcQ"
  | { type: "model";   file: string; caption?: string };   // local .glb in public/projects/<slug>/

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  link?: string;
  period?: string;
  status?: string;
  coverFit?: "cover" | "contain";
  specs?: { label: string; value: string; redacted?: boolean }[];
  analysis?: { caption?: string; file: string }[];
  tests?:    { caption?: string; file: string }[];
  integration?: { caption?: string; file: string }[];
  // ── Project page sections ──────────────────────────────────────
  problem?: string;
  goals?: string[];
  myRole?: string;
  process?: ProcessStep[];
  outcome?: string;
  model3d?: string;        // .glb filename in public/projects/<slug>/
  model3dExploded?: string; // exploded view .glb (same folder)
  // Drop files in public/projects/<slug>/ then list them here
  media?: MediaItem[];
};

export const projects: Project[] = [
  {
    slug: "hybrid-rocket-feed-system",
    specs: [
      { label: "THRUST TARGET",   value: "586 lbf"         },
      { label: "MAX PRESSURE",    value: "750 psi MEOP"    },
      { label: "OXIDIZER",        value: "N₂O"             },
      { label: "FUEL",            value: "HTPB"            },
      { label: "TARGET APOGEE",   value: "13,400 ft"       },
      { label: "STATUS",          value: "Test & Integration" },
      { label: "CLASSIFICATION",  value: "UNCLASSIFIED", redacted: true },
    ],
    title: "Hybrid Rocket Feed System",
    description:
      "Lead engineer for a 586 lbf N₂O/HTPB hybrid rocket feed system targeting a club record 20,000 ft apogee. Designed full oxidizer plumbing at 750 psi MEOP, performed discharge coefficient modeling, FEA-validated endcaps and brackets, and led cold-flow and static fire campaigns.",
    tags: ["Propulsion", "SolidWorks", "FEA", "ANSYS", "N₂O", "Python"],
    github: "https://github.com/Oltunisie",
    period: "2025 – Present",
    status: "In Progress",

    problem: `The Rocket Project at UCLA was targeting a new altitude record of 20,000 ft with a 586 lbf N₂O/HTPB hybrid motor. The core challenge was designing an oxidizer feed system capable of reliably delivering N₂O at 750 psi MEOP while meeting strict mass, safety, and integration constraints — all without precedent in the club's history.

A hybrid feed system operates at the intersection of fluid mechanics, thermodynamics, and structural engineering. Getting it wrong means failed tests, wasted resources, or worse — a safety incident. The system had to be simple enough to operate in the field, yet robust enough to handle the transient pressure dynamics of a cold-flow and static fire campaign.`,

    goals: [
      "Design a complete oxidizer feed system (plumbing, fittings, valves, pressure relief) rated to 750 psi MEOP",
      "Characterize system pressure losses and transient flow behavior through discharge coefficient (Cd) modeling",
      "FEA-validate all structural components — tank endcaps, brackets, and bolted interfaces — to required margins of safety",
      "Execute hydrostatic proof testing, cold-flow qualification, and static fire integration campaigns",
      "Maximize delivered impulse through ullage volume optimization driven by test data",
    ],

    myRole: `As Feed Systems Lead, I owned the entire oxidizer delivery system end-to-end. I was responsible for the system architecture, component selection, all analysis work, and leading the test campaigns.

I performed the discharge coefficient calculations and flow modeling to size the orifices and predict pressure loss through the system. I designed and FEA-validated the lightweight oxidizer tank endcaps and support brackets under internal pressure, bolt preload, and bending loads — iterating through multiple designs to meet required margins while minimizing mass. I also ran the bolt bearing stress and bracket bending analyses.

On the test side, I built the cold-flow test setup, led the hydrostatic proof test campaign, and coordinated the static fire integration. Between test runs, I iterated on the ullage volume using real data to tune combustion stability and impulse delivery.`,

    process: [
      {
        title: "System Architecture & Requirements",
        description:
          "Defined the feed system requirements from the motor performance targets: 586 lbf thrust, N₂O oxidizer, 750 psi MEOP. Selected component types (ball valves, burst discs, check valves), laid out the plumbing schematic, and established the pressure relief strategy to ensure safe operation during all test phases.",
      },
      {
        title: "Flow Modeling & Cd Calculations",
        description:
          "Built a Python flow model of the oxidizer feed system to predict steady-state and transient pressure losses. Performed discharge coefficient calculations for each orifice and fitting, validated against published data, and used the model to size the feed system for the required oxidizer mass flow rate.",
      },
      {
        title: "Structural Analysis — Endcaps & Brackets",
        description:
          "Designed lightweight aluminum endcaps for the oxidizer tank and FEA-validated them in SolidWorks under internal pressure and bolt preload. Performed hand calculations and FEA for the support brackets under combined bending and shear. Iterated geometry to meet margin of safety requirements while keeping mass budget.",
      },
      {
        title: "Hydrostatic Proof Testing",
        description:
          "Oversaw hydrostatic proof testing of the pressure vessel and all plumbing interfaces at 1.5× MEOP. Instrumented the system with pressure transducers and load cells, monitored for leaks and deformation, and documented test results for structural qualification of the hardware.",
      },
      {
        title: "Cold-Flow & Static Fire Campaigns",
        description:
          "Led the cold-flow integration campaign to validate oxidizer flow rates, system timing, and valve actuation sequences. Used cold-flow data to refine the Cd model and iterate on ullage volume. Coordinated with the motor and avionics teams during static fire integration.",
      },
    ],

    outcome: `The feed system hardware is currently machined and in the test and integration phase. Hydrostatic proof testing has been completed, confirming structural qualification of the pressure vessel and plumbing interfaces. Cold-flow testing is ongoing, with each run providing data to refine the flow model and optimize ullage volume for maximum delivered impulse.

The system is on track to support a full static fire campaign ahead of the launch targeting the 20,000 ft altitude record — which would be the highest apogee in Rocket Project UCLA's history.`,

    model3d: "Prometheus_Feed_System_2026.glb",

    media: [
      { type: "image", file: "fire.jpg" },
      { type: "image", file: "HF2_group.jpg" },
      { type: "video", file: "HF2.mp4" },
      { type: "image", file: "Mach_diamonds.jpg" },
      { type: "image", file: "horizon.jpg" },
      { type: "image", file: "setup.jpg" }, 
      { type: "image", file: "FeedSystems_HF2.jpg" },
    ],
  },

  {
    slug: "cubesat-adcs-bruinspace",
    specs: [
      { label: "FORMAT",        value: "CubeSat"                     },
      { label: "CONTROL",       value: "3-Axis Active"               },
      { label: "ACTUATORS",     value: "Magnetorquers + Reaction Wheel" },
      { label: "SENSORS",       value: "Magnetometer · Sun Sensor · Gyro" },
      { label: "ORBIT",         value: "Low Earth Orbit"             },
      { label: "STATUS",        value: "In Development"              },
    ],
    title: "CubeSat ADCS — BruinSpace",
    description:
      "Leading design and development of the Attitude Determination and Control System for UCLA BruinSpace's satellite. Built the ADCS test setup to validate sensors, actuators, and control algorithms, and coordinating integration across electronics and structures subsystems.",
    tags: ["ADCS", "Control Systems", "Sensors", "Embedded", "Satellite"],
    github: "https://github.com/Oltunisie",
    period: "2025 – Present",
    status: "In Progress",

    problem: `BruinSpace is developing a CubeSat with a mission that requires precise attitude control in orbit. Without a functional ADCS, the satellite cannot point its payload, maintain a stable communication link, or meet mission objectives. The challenge is designing a system that is small enough to fit within CubeSat volume constraints, power-efficient enough to run continuously on a small solar array, and reliable enough to operate autonomously in the harsh environment of low Earth orbit.

The ADCS must handle detumbling after deployment, transition to a stable pointing mode, and interface cleanly with the avionics and structures subsystems — all with limited heritage and a student team.`,

    goals: [
      "Design a 3-axis Attitude Determination and Control System for a CubeSat within volume and power constraints",
      "Select and integrate sensors (magnetometers, sun sensors, gyroscopes) and actuators (magnetorquers, reaction wheels)",
      "Develop and simulate detumbling and pointing control algorithms",
      "Build a hardware-in-the-loop test setup to validate sensors, actuators, and control logic",
      "Coordinate ADCS integration with the electronics and structures subsystems",
    ],

    myRole: `As ADCS Lead, I drive the full technical development of the attitude system — from architecture decisions down to hardware testing. I made the sensor and actuator selection trade-offs, weighing performance against mass, power, and cost constraints typical of a CubeSat program.

I developed and assembled the ADCS test bench, which allows us to validate sensors and actuators in the lab before flight. I wrote the control algorithms and simulation framework to verify detumbling and pointing performance before moving to hardware. I also coordinate directly with the electronics team on PCB interfaces and with structures on mechanical mounting.`,

    process: [
      {
        title: "Requirements & Architecture Trade Study",
        description:
          "Defined ADCS requirements from the mission pointing budget. Performed trade studies on sensor and actuator architectures — comparing magnetometer-only versus multi-sensor fusion, and passive magnetic stabilization versus active three-axis control. Selected a three-axis active ADCS with magnetorquers and a reaction wheel.",
      },
      {
        title: "Sensor & Actuator Selection",
        description:
          "Selected magnetometers, sun sensors, and a MEMS gyroscope for attitude determination. Sized the magnetorquers for the required detumbling torque at the target orbit altitude. Designed the sensor placement to minimize magnetic interference from other subsystems.",
      },
      {
        title: "Control Algorithm Development",
        description:
          "Implemented a B-dot detumbling controller and a PD pointing controller in Python. Built a simulation environment with orbital dynamics and geomagnetic field models to validate control performance across the orbit. Tuned controller gains to meet settling time and pointing accuracy requirements.",
      },
      {
        title: "Test Setup Assembly & Validation",
        description:
          "Assembled a hardware-in-the-loop test bench to validate sensors, actuators, and the flight software stack. Built a Helmholtz cage to simulate the Earth's magnetic field for magnetometer calibration and magnetorquer testing.",
      },
    ],

    outcome: `The ADCS test setup is assembled and sensor validation testing is underway. The detumbling and pointing algorithms have been validated in simulation and are being tested on hardware. Subsystem integration with the electronics and structures teams is progressing in parallel.

The system represents one of the most technically complex subsystems on the satellite, and the work is building a strong foundation for BruinSpace's next mission.`,

    media: [],
  },

  {
    slug: "zero-g-experiments-cnes",
    coverFit: "contain",
    specs: [
      { label: "CAMPAIGN",      value: "66th Parabolic Flight"   },
      { label: "AGENCY",        value: "CNES"                    },
      { label: "0-g WINDOWS",   value: "~20 sec / parabola"      },
      { label: "LOCATION",      value: "Bordeaux, France"        },
      { label: "EXPERIMENTS",   value: "3 (Thermo · Newton · Centrifugal)" },
      { label: "OUTCOME",       value: "Full campaign success"   },
    ],
    title: "Zero-G Experiments — CNES",

    description:
      "Selected for the 66th Parabolic Flight Campaign of the French CNES. Designed and conducted microgravity experiments covering thermodynamics, centrifugal forces, and Newton's Laws aboard a Zero-G aircraft in Bordeaux.",
    tags: ["Microgravity", "Thermodynamics", "Experimental", "CNES"],
    period: "2022 – 2023",
    status: "Completed",

    problem: `Microgravity is one of the most difficult environments to study on Earth. Standard laboratory equipment behaves unpredictably in weightlessness, and the physics governing fluid behavior, heat transfer, and inertia change fundamentally without gravity. Our team at the Horizon Astronomy Club wanted to investigate these effects hands-on — but access to real microgravity is extremely limited.

The French National Space Studies Center (CNES) runs a yearly Parabolic Flight Campaign open to student teams. Competing for a spot required designing rigorous, scientifically valid experiments that could safely run during 20-second weightlessness windows aboard a modified Airbus A310, and convincing CNES experts our team was ready to execute.`,

    goals: [
      "Design experiments demonstrating physical phenomena that change meaningfully in microgravity",
      "Meet CNES safety and design review requirements for a manned flight campaign",
      "Execute all experiments within 20-second parabolic microgravity windows",
      "Collect usable data and document results for post-flight analysis",
      "Represent the Horizon Astronomy Club at an international level",
    ],

    myRole: `As Lead Programmer and Club President, I was responsible for coordinating the experiment design process and the technical development. I led the team through a full year of preparation — from concept selection through CNES design reviews to flight day operations.

I designed the data acquisition system used to log sensor data during the parabolas and oversaw the instrumentation integration on our experiment rigs. On flight day, I was part of the team that boarded the aircraft and ran the experiments in real-time during the parabolic maneuvers.`,

    process: [
      {
        title: "Experiment Concept & Selection",
        description:
          "The team brainstormed and evaluated dozens of experiment ideas across thermodynamics, fluid mechanics, and classical mechanics. We selected three experiments based on scientific relevance, feasibility within the flight constraints, and the ability to produce measurable data: a thermodynamic convection study, a centrifugal force demonstration, and a Newton's Laws validation.",
      },
      {
        title: "Design & CNES Review Process",
        description:
          "Over several months, we designed, built, and iterated on the experiment hardware to meet CNES safety requirements. This involved structural reviews, material compatibility checks, and multiple design presentations to CNES engineers. Each revision made the rigs safer, simpler, and more reliable.",
      },
      {
        title: "Flight Day Execution",
        description:
          "The campaign took place in Bordeaux aboard CNES's Zero-G aircraft. During each parabola, the aircraft follows a Keplerian arc that produces approximately 20 seconds of weightlessness. Our team ran the experiments across multiple parabolas, operating instruments, collecting data, and documenting observations in real-time.",
      },
      {
        title: "Post-Flight Analysis",
        description:
          "After the campaign, we processed the sensor data and video recordings to analyze the experimental results. The data confirmed our predictions for convection suppression and inertial behavior in microgravity, and was compiled into a final report submitted to CNES.",
      },
    ],

    outcome: `The campaign was a success. All three experiments ran as planned across the flight, and we collected clean data from each parabola. The experience of observing physics in real weightlessness — convection stopping, fluids floating free, forces behaving differently — was unlike anything achievable in a ground lab.

The win earned two of our students a flight aboard the CNES Zero-G aircraft, and positioned the club for two consecutive Young Searchers Prize victories in the years that followed. It remains one of the most formative engineering and leadership experiences of my career so far.`,

    media: [
      { type: "image", file: "zero-g.png" },
    ],
  },

  {
    slug: "space-probe-project-x",
    specs: [
      { label: "COMPETITION",   value: "Project X — Tunisia"     },
      { label: "AWARD",         value: "Young Searchers Prize"   },
      { label: "WINS",          value: "2 consecutive (2023·2024)" },
      { label: "2023 THEME",    value: "Space Probe Design"      },
      { label: "2024 THEME",    value: "Zero-G Experiment"       },
      { label: "2025",          value: "Awards Presenter"        },
    ],
    title: "Space Probe — Project X",
    description:
      "Won the Young Searchers Prize at the 2023 Project X engineering competition with a space probe design concept. Repeated the win in 2024 with a Zero-G experiment design, and was selected to present awards at the 2025 closing ceremony.",
    tags: ["Systems Design", "Space Probe", "Competition"],
    period: "2023 – 2025",
    status: "Completed",

    problem: `Project X is a national engineering competition in Tunisia that challenges student teams to tackle a new technical theme each year and present a fully developed engineering concept to a jury of industry experts and academics. The competition demands both technical depth and the ability to communicate ideas clearly under pressure — skills that are rare at the student level.

Our team entered three consecutive years, each time with a different theme and a different design challenge. The question each year was the same: can we out-engineer and out-present every other team in the country?`,

    goals: [
      "Develop a rigorous engineering concept that addresses the yearly competition theme",
      "Present a technically credible and well-communicated proposal to a jury of experts",
      "Win the Young Searchers Prize — the top award at Project X",
      "Build on each year's experience to deepen the technical quality of successive entries",
    ],

    myRole: `I led the technical development and the presentation strategy for our team across all three years. In 2023, I drove the space probe concept — defining the mission architecture, the systems breakdown, and the key engineering trades. In 2024, I built on the CNES Zero-G experience to develop our microgravity experiment design, bringing real flight data into the competition context.

In both winning years, I led the final jury presentation. In 2025, I was invited back to present the awards at the closing ceremony — recognizing the team's three-year run.`,

    process: [
      {
        title: "2023 — Space Probe Design",
        description:
          "The 2023 theme called for an innovative space exploration concept. Our team designed a compact space probe with a defined mission profile, instrument suite, and trajectory plan. I developed the systems architecture, performed the mass and power budget, and led the jury presentation. We won the Young Searchers Prize.",
      },
      {
        title: "2024 — Zero-G Experiment Design",
        description:
          "For 2024, the theme aligned with our CNES experience. We designed a suite of microgravity experiments with real scientific objectives, drawing on the lessons and data from the parabolic flight campaign. The proposal included detailed experiment hardware designs and expected results. We won for the second consecutive year.",
      },
      {
        title: "2025 — Recognition",
        description:
          "In 2025, having won the award two years in a row, I was selected by the organizers to present the awards at the Project X closing ceremony — acknowledging the team's consistency and impact on the competition.",
      },
    ],

    outcome: `Three consecutive years of recognition at Project X — two first-place wins (2023, 2024) and a closing ceremony invitation in 2025. Beyond the awards, the competition sharpened our ability to develop engineering concepts under tight constraints, communicate complex ideas to expert audiences, and iterate rapidly on feedback.

The 2024 win was especially meaningful because it connected directly to real experimental work — the proposal was grounded in data and experience from the CNES Zero-G campaign, not just theory.`,

    media: [],
  },
];
