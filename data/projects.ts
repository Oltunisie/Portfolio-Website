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
  design?: { caption?: string; file: string }[];
  analysis?: { caption?: string; file: string }[];
  tests?:    { caption?: string; file: string }[];
  integration?: { caption?: string; file: string }[];
  // ── Project page sections ──────────────────────────────────────
  problem?: string;
  goals?: string[];
  myRole?: string;
  process?: ProcessStep[];
  outcome?: string;
  failures?: { body: string; images?: { file: string; caption?: string }[] };
  model3d?: string;        // .glb filename in public/projects/<slug>/
  model3dExploded?: string; // exploded view .glb (same folder)
  // Drop files in public/projects/<slug>/ then list them here
  media?: MediaItem[];
};

const projectsRaw: Project[] = [
  {
    slug: "hybrid-rocket-feed-system",
    specs: [
      { label: "THRUST TARGET",   value: "586 lbf"         },
      { label: "MAX PRESSURE",    value: "750 psi MEOP"    },
      { label: "OXIDIZER",        value: "N₂O"             },
      { label: "FUEL",            value: "HTPB"            },
      { label: "APOGEE",          value: "13,400 ft"       },
      { label: "STATUS",          value: "Successful Launch" },
    ],
    title: "Hybrid Rocket Feed System",
    description:
      "Lead engineer for a 586 lbf N₂O/HTPB hybrid rocket feed system targeting a club record 20,000 ft apogee. Designed full oxidizer plumbing at 750 psi MEOP, performed discharge coefficient modeling, FEA-validated endcaps and brackets, and led cold-flow and static fire campaigns.",
    tags: ["Propulsion", "SolidWorks", "FEA", "ANSYS", "N₂O", "Python"],
    github: "https://github.com/Oltunisie",
    period: "2025 – Present",
    status: "Done",

    problem: `As Feed Systems Lead, I designed and tested a complete 750 psi N₂O oxidizer feed system for UCLA's hybrid rocket targeting a 20,000 ft altitude record. The challenge: reliable N₂O delivery at extreme pressure while meeting mass, safety, and integration constraints, all with zero margin for failure.`,

    goals: [
      "Design complete plumbing architecture (tank, valves, relief, fittings) rated 750 psi MEOP",
      "Model discharge coefficient (Cd) and pressure losses using Python + experimental validation",
      "FEA-validate endcaps and brackets to required margins of safety",
      "Execute hydrostatic proof, cold-flow, and static fire test campaigns",
      "Optimize ullage volume for maximum delivered impulse using live test data",
    ],

    myRole: `I owned the oxidizer delivery system end-to-end: architecture, component selection, all structural and fluid analysis, and leadership of the test campaigns. I built the discharge coefficient model in Python, designed and iterated the tank endcaps and brackets through FEA, constructed the cold-flow test rig, and led the hydrostatic and static fire campaigns.`,

    process: [
      {
        title: "01 · DESIGN",
        description:
          "Selected components (ball valves, pneumatic actuators, check valves) and laid out the plumbing schematic to deliver N₂O at 750 psi while maintaining simplicity for field operation. Designed lightweight aluminum endcaps for the pressure vessel and support brackets for structural integration.",
      },
      {
        title: "02 · ANALYSIS",
        description:
          "Built a  flow model to predict steady-state and transient pressure losses. Performed discharge coefficient (Cd) calculations for each orifice and fitting, validating against published data from peer-reviewed sources. FEA-validated all structural components under combined loading (internal pressure, bolt preload, bending). Factor of Safety on endcaps:  2 (yield), 2.5 (ultimate). ",
      },
      {
        title: "03 · MANUFACTURING & TESTING",
        description:
          "Machined aluminum endcaps and brackets, then executed hydrostatic proof testing at 1.5× MEOP (1125 psi). System passed with zero leaks. Led cold-flow campaign validating oxidizer flow rates, system timing, and valve sequences, each run instrumented with pressure transducers.",
      },
      {
        title: "04 · STATIC FIRE & RESULTS",
        description:
          "Coordinated static fire integration with motor and avionics teams. Launch day: 586 lbf thrust confirmed. System delivered stable combustion and record apogee.",
      },
    ],

    outcome: `The system performed flawlessly under test and in flight. Hydrostatic proof testing confirmed structural integrity at 1.5× operational pressure (1125 psi). Cold-flow campaign validated all flow paths and valve timing. Static fire delivered 586 lbf sustained thrust and achieved 13,400 ft apogee.

This was real engineering: pressure testing, iteration from FEA to hardware, instrumented testing, and flight-proven performance. The work proved that with rigorous analysis and testing discipline, a student team can design systems that operate at professional aerospace standards.`,

    model3d: "Prometheus_Feed_System_2026.glb",
    model3dExploded: "Exploded_Feed_System_Assembly_v2.glb",

    design: [
      { file: "Endcap.png", caption: "Endcap design and geometry" },
      { file: "P&ID.png", caption: "Plumbing and instrumentation diagram" },
      { file: "feedsystem_plumbing.JPG", caption: "Feed system plumbing layout" },
    ],

    analysis: [
      { file: "endcap_fea.png", caption: "Endcap von Mises stress at 750 psi MEOP" },
      { file: "bracket_fea.png", caption: "Support bracket FEA under combined loading" },
      { file: "hf3graphs.png", caption: "HF3 performance data" },
      { file: "waterflow_data.png", caption: "Cold flow waterflow test data" },
    ],

    tests: [
      { file: "endcap_machining1.jpg", caption: "Endcap after CNC machining" },
      { file: "endcap_machining2.jpg", caption: "Finished endcap assembly" },
      { file: "bracket_machining.jpg", caption: "Support bracket post-machining" },
      { file: "machining.jpg", caption: "Radial Holes Manufacturing" },
      { file: "me_and_endcap.PNG", caption: "Endcap integration" },
      { file: "endcap_removal.PNG", caption: "Endcap removal after testing" },
      { file: "waterflow1.png", caption: "Pressure vs time during cold flow test" },
      { file: "waterflow_vid.mp4", caption: "Cold-flow / water-flow test" },
    ],

    media: [
      { type: "image", file: "fire.jpg" },
      { type: "image", file: "HF2_group.jpg" },
      { type: "video", file: "HF2.mp4" },
      { type: "video", file: "static_fire.mp4", caption: "Static fire test" },
      { type: "video", file: "launch_cam.mp4", caption: "Launch camera" },
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
    title: "CubeSat ADCS, BruinSpace",
    description:
      "Leading design and development of the Attitude Determination and Control System for UCLA BruinSpace's satellite. Built the ADCS test setup to validate sensors, actuators, and control algorithms, and coordinating integration across electronics and structures subsystems.",
    tags: ["ADCS", "Control Systems", "Sensors", "Embedded", "Satellite"],
    github: "https://github.com/Oltunisie",
    period: "2025 – Present",
    status: "In Progress",

    problem: `BruinSpace is developing a CubeSat with a mission that requires precise attitude control in orbit. Without a functional ADCS, the satellite cannot point its payload, maintain a stable communication link, or meet mission objectives. The challenge is designing a system that is small enough to fit within CubeSat volume constraints, power-efficient enough to run continuously on a small solar array, and reliable enough to operate autonomously in the harsh environment of low Earth orbit.

The ADCS must handle detumbling after deployment, transition to a stable pointing mode, and interface cleanly with the avionics and structures subsystems, all with limited heritage and a student team.`,

    goals: [
      "Design a 3-axis Attitude Determination and Control System for a CubeSat within volume and power constraints",
      "Select and integrate sensors (magnetometers, sun sensors, gyroscopes) and actuators (magnetorquers, reaction wheels)",
      "Develop and simulate detumbling and pointing control algorithms",
      "Build a hardware-in-the-loop test setup to validate sensors, actuators, and control logic",
      "Coordinate ADCS integration with the electronics and structures subsystems",
    ],

    myRole: `As ADCS Lead, I drive the full technical development of the attitude system, from architecture decisions down to hardware testing. I made the sensor and actuator selection trade-offs, weighing performance against mass, power, and cost constraints typical of a CubeSat program.

I developed and assembled the ADCS test bench, which allows us to validate sensors and actuators in the lab before flight. I wrote the control algorithms and simulation framework to verify detumbling and pointing performance before moving to hardware. I also coordinate directly with the electronics team on PCB interfaces and with structures on mechanical mounting.`,

    process: [
      {
        title: "Requirements & Architecture Trade Study",
        description:
          "Defined ADCS requirements from the mission pointing budget. Performed trade studies on sensor and actuator architectures, comparing magnetometer-only versus multi-sensor fusion, and passive magnetic stabilization versus active three-axis control. Selected a three-axis active ADCS with magnetorquers and a reaction wheel.",
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
    title: "Zero-G Experiments, CNES",

    description:
      "Selected for the 66th Parabolic Flight Campaign of the French CNES. Designed and conducted microgravity experiments covering thermodynamics, centrifugal forces, and Newton's Laws aboard a Zero-G aircraft in Bordeaux.",
    tags: ["Microgravity", "Thermodynamics", "Experimental", "CNES"],
    period: "2022 – 2023",
    status: "Completed",

    problem: `Microgravity is one of the most difficult environments to study on Earth. Standard laboratory equipment behaves unpredictably in weightlessness, and the physics governing fluid behavior, heat transfer, and inertia change fundamentally without gravity. Our team at the Horizon Astronomy Club wanted to investigate these effects hands-on, but access to real microgravity is extremely limited.

The French National Space Studies Center (CNES) runs a yearly Parabolic Flight Campaign open to student teams. Competing for a spot required designing rigorous, scientifically valid experiments that could safely run during 20-second weightlessness windows aboard a modified Airbus A310, and convincing CNES experts our team was ready to execute.`,

    goals: [
      "Design experiments demonstrating physical phenomena that change meaningfully in microgravity",
      "Meet CNES safety and design review requirements for a manned flight campaign",
      "Execute all experiments within 20-second parabolic microgravity windows",
      "Collect usable data and document results for post-flight analysis",
      "Represent the Horizon Astronomy Club at an international level",
    ],

    myRole: `As Lead Programmer and Club President, I was responsible for coordinating the experiment design process and the technical development. I led the team through a full year of preparation, from concept selection through CNES design reviews to flight day operations.

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

    outcome: `The campaign was a success. All three experiments ran as planned across the flight, and we collected clean data from each parabola. The experience of observing physics in real weightlessness, convection stopping, fluids floating free, forces behaving differently, was unlike anything achievable in a ground lab.

The win earned two of our students a flight aboard the CNES Zero-G aircraft, and positioned the club for two consecutive Young Searchers Prize victories in the years that followed. It remains one of the most formative engineering and leadership experiences of my career so far.`,

    media: [
      { type: "image", file: "zero-g.png" },
    ],
  },

  {
    slug: "pressure-vessel-analysis",
    specs: [
      { label: "MEOP",          value: "750 psi"            },
      { label: "PROOF PRESSURE", value: "1125 psi (1.5×)"   },
      { label: "FoS, YIELD",   value: "2.0"                },
      { label: "FoS, ULTIMATE", value: "2.5"               },
      { label: "MATERIAL",      value: "6061-T6 Aluminum"   },
      { label: "METHOD",        value: "FEA (ANSYS) + Hand Calc" },
    ],
    title: "Pressure Vessel Analysis",
    description:
      "Structural analysis of the hybrid rocket's N₂O oxidizer tank and endcaps at 750 psi MEOP. Sized the pressure vessel by hand, FEA-validated the tank wall and endcaps under combined loading, and confirmed margins of safety with a hydrostatic proof test at 1.5× operating pressure.",
    tags: ["FEA", "ANSYS", "Pressure Vessel", "Structures", "SolidWorks"],
    period: "2025",
    status: "Completed",

    problem: `The oxidizer feed system stores N₂O at 750 psi MEOP, and the tank and its endcaps sit directly in the pressure boundary, a failure here is catastrophic. The challenge was to prove, analytically and with FEA, that both the tank wall and the endcaps carry the internal pressure (plus bolt preload on the caps) with required margins of safety, while staying as light as possible.

There was no room for "looks strong enough." Every load path had to be backed by hand calculations, correlated with finite-element analysis, and finally confirmed on the bench with a hydrostatic proof test.`,

    goals: [
      "Size the tank wall and endcaps to contain 750 psi MEOP within required margins of safety",
      "Validate against both yield (FoS 2.0) and ultimate (FoS 2.5)",
      "FEA the endcaps under combined loading, internal pressure plus bolt preload",
      "Correlate FEA results with closed-form hoop/longitudinal stress hand calculations",
      "Confirm structural integrity with a hydrostatic proof test at 1.5× MEOP (1125 psi)",
    ],

    myRole: `I owned the structural analysis of the pressure vessel end-to-end. I built the closed-form sizing calculations for the tank wall (hoop and longitudinal stress) and the endcaps, set up and ran the FEA in ANSYS under combined pressure and bolt-preload loading, and reconciled the two methods to make sure the model and the math agreed before committing to hardware. I then defined and supported the hydrostatic proof test that validated the analysis on the real article.`,

    process: [
      {
        title: "01 · HAND CALCULATIONS & SIZING",
        description:
          "Started from first principles: hoop and longitudinal stress for the tank wall, bolt-circle and gasket loads for the endcaps. Sized wall thickness and endcap geometry in 6061-T6 aluminum to meet a factor of safety of 2.0 on yield and 2.5 on ultimate at 750 psi MEOP. These closed-form numbers set the baseline and the targets the FEA had to match.",
      },
      {
        title: "02 · ENDCAP FEA",
        description:
          "Modeled the endcaps in ANSYS under combined loading, internal pressure plus bolt preload, to capture stress concentrations the hand calculations can't see (fillets, bolt holes, sealing surfaces). Checked peak von Mises stress against the material allowables and confirmed the endcaps held the required margins of safety.",
      },
      {
        title: "03 · TANK WALL ANALYSIS",
        description:
          "Modeled the tank wall in ANSYS under the 750 psi MEOP pressure case, using a symmetry model to resolve the hoop and radial stress fields efficiently. Verified that the FEA results agreed with the closed-form hoop/longitudinal predictions, confirming the wall held the required margins of safety.",
      },
      {
        title: "04 · HYDROSTATIC PROOF TEST",
        description:
          "Validated the analysis on the real hardware with a hydrostatic proof test at 1.5× MEOP (1125 psi). The vessel held with zero leaks and no yielding, confirming the analysis and clearing the pressure vessel for the cold-flow and static fire campaigns.",
      },
    ],

    outcome: `Both the tank and the endcaps were validated analytically, confirmed in FEA, and proof-tested to 1.5× operating pressure (1125 psi) with zero leaks and no permanent deformation. The hand calculations and FEA agreed, which is exactly what you want before trusting a pressure vessel with a high-pressure oxidizer.

The work turned "we think it's strong enough" into a defensible margin of safety backed by two independent methods and a physical proof test, the standard real aerospace pressure vessels are held to.`,

    failures: {
      body: `Our endcap initially leaked, which forced us to rethink our O-rings and the groove geometry, the thickness, and the whole sealing approach. After remachining the grooves we reached a good compromise that resolved the leaking. But when we moved on to proof-testing the tank, a far worse failure appeared: the tank holes bored out completely, a catastrophic failure that threatened to push back our entire timeline.

We traced the root cause to a mismatch in our calculation values. To solve it, we spent five days non-stop adding 8 holes to the endcap to add strength, cycling through remachining and many iterations. After a focused hydrostatic proof-testing campaign, we finally resolved the issue, a hard lesson in how the smallest mistakes can destroy a project.`,
      images: [
        { file: "tank_bearing.png", caption: "Tank holes bored out during proof testing, the catastrophic failure" },
      ],
    },

    design: [
      { file: "tank_wall_calcs.png", caption: "Tank wall hoop & longitudinal stress hand calculations" },
      { file: "bolt_calcs.png", caption: "Endcap bolt-circle sizing calculations" },
    ],

    analysis: [
      { file: "endcap_mesh.png", caption: "Endcap FEA mesh" },
      { file: "endcap_fea_stress.png", caption: "Endcap von Mises stress at 750 psi MEOP" },
      { file: "endcap_fea_crossection.png", caption: "Endcap stress, cross-section view" },
    ],

    tests: [
      { file: "hoop_stress_fea.png", caption: "Tank wall hoop stress (FEA) at 750 psi MEOP" },
      { file: "radial_stress_fea.png", caption: "Tank wall radial stress (FEA)" },
      { file: "hoop_stress_symmetry_fea.png", caption: "Hoop stress, symmetry model" },
    ],

    integration: [
      { file: "hydrostat.png", caption: "Hydrostatic proof test, 1125 psi (1.5× MEOP), zero leaks" },
    ],

    media: [
      { type: "image", file: "machining.jpg" },
    ],
  },
];

// Display order across the site (home grid, project prev/next, static params)
const PROJECT_ORDER = [
  "hybrid-rocket-feed-system",
  "pressure-vessel-analysis",
  "cubesat-adcs-bruinspace",
  "zero-g-experiments-cnes",
];

export const projects: Project[] = [...projectsRaw].sort(
  (a, b) => PROJECT_ORDER.indexOf(a.slug) - PROJECT_ORDER.indexOf(b.slug)
);
