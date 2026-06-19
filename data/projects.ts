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
  slidesPdf?: string;      // PDF slideshow filename in public/projects/<slug>/
  appScreens?: { file: string; caption?: string }[]; // phone screenshots, shown uncropped
  experiments?: { title: string; blurb: string; pdf?: string }[]; // experiment cards with optional PDF
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
    slug: "automatic-syringe-pump",
    specs: [
      { label: "SCHOOL",      value: "Lycée Pierre Mendès France, Tunis" },
      { label: "COURSE",      value: "Engineering Sciences (11th grade)" },
      { label: "CONTROL",     value: "Arduino + Phone App"               },
      { label: "ACTUATION",   value: "Stepper Motor, Rack & Pinion"      },
      { label: "FABRICATION", value: "3D Printed + Laser-Cut Enclosure"  },
      { label: "BUILT",       value: "From Scratch in ~4 Weeks"          },
    ],
    title: "Automatic Syringe Pump",
    description:
      "My first full engineering project, built from scratch in 11th-grade Engineering Sciences at Lycée Pierre Mendès France in Tunis. An automatic syringe pump that delivers a controlled infusion to hospitalized patients with minimal human action, driven by a stepper-motor rack-and-pinion and controlled from a phone app. This was the project that made me fall in love with engineering.",
    tags: ["Arduino", "CAD", "3D Printing", "Mechatronics", "App", "High School"],
    period: "2024",
    status: "Completed",

    problem: `The class theme was "Assistive Products for Health and Safety." Hospitalized patients often need a continuous, precisely dosed infusion, and doing that by hand is tedious and error-prone. Our objective was to design an automatic syringe pump that administers an infusion by adjustable parameters (time, quantity, flow rate), limiting human action to reduce both effort and the risk of error.

This was the first time I took a project through the complete engineering cycle, from a blank page and a need, all the way to a working prototype.`,

    goals: [
      "Deliver an infusion controlled by time, quantity, and flow rate",
      "Limit human intervention to reduce the risk of dosing errors",
      "Control the pump from a phone app",
      "Go through the full engineering cycle: needs analysis, design, fabrication, programming, testing",
      "Build a working prototype on a tight four-week schedule",
    ],

    myRole: `I worked on this as part of a small team in the Engineering Sciences class, and it was my first taste of owning a project end to end. I was involved across the whole cycle: the functional needs analysis, the trade studies on the mechanism and electronics, the CAD and fabrication of the parts, the Arduino programming, and the final assembly and testing.

More than any single deliverable, this project is where I learned what engineering actually feels like: taking an open-ended need, breaking it into decisions, and iterating from idea to hardware that works.`,

    process: [
      {
        title: "01 · NEEDS ANALYSIS & SPECIFICATIONS",
        description:
          "Started with a functional analysis of the need: who and what the system serves (the patient, the injected product, the medical staff) and what it must do, deliver a product at a controlled, selectable flow rate. This set the specifications the rest of the project had to meet.",
      },
      {
        title: "02 · BRAINSTORMING & COMPONENT SELECTION",
        description:
          "Worked through the key design decisions as a team: which transmission (worm screw vs. rack and pinion), which motor (stepper vs. DC), and which controller (Arduino vs. micro:bit). We chose a rack-and-pinion driven by a stepper motor and controlled by an Arduino, for simplicity, controllable power, and precise, repeatable motion.",
      },
      {
        title: "03 · DESIGN & FABRICATION",
        description:
          "Designed the mechanism and enclosure in CAD, then brought it to life: 3D-printed the moving parts and laser-cut the acrylic housing. The rack-and-pinion converts the stepper's rotation into the linear push that drives the syringe plunger.",
      },
      {
        title: "04 · PROGRAMMING & APP",
        description:
          "Wrote the Arduino control program to drive the stepper at the commanded flow rate, and built a phone app so a user could set the infusion parameters and start or stop the pump without touching the hardware.",
      },
      {
        title: "05 · ASSEMBLY & TESTING",
        description:
          "Assembled the full system and ran the first tests, checking that the pump delivered fluid steadily at the set rate and responded correctly to the app. We iterated on the fit and the control until the prototype ran reliably, all within the four-week deadline.",
      },
    ],

    outcome: `We delivered a working automatic syringe pump prototype within the four-week schedule: a phone-controlled device that drives a syringe through a stepper-motor rack-and-pinion to deliver fluid at a set rate, exactly what the brief asked for.

Beyond the device itself, this is the project that got me hooked on engineering. It was my first time going from a blank page to working hardware, my first full engineering cycle, and the first time I felt the pull of turning an idea into something real. Everything I have done since, from rocket feed systems to pressure-vessel analysis, started here.`,

    slidesPdf: "syringe-pump-slides.pdf",

    design: [
      { file: "usercase_diagram.jpg", caption: "Use case diagram from the needs analysis" },
      { file: "specs_def.jpg", caption: "Specifications definition" },
    ],

    analysis: [
      { file: "mechanisms.jpg", caption: "Transmission trade study: rack & pinion vs. belt-and-pulley vs. linear actuator" },
      { file: "graphs.jpg", caption: "Kinematic linkage and kinematics graphs of the chosen mechanism" },
    ],

    tests: [
      { file: "cad.png", caption: "CAD model of the syringe pump assembly" },
    ],

    appScreens: [
      { file: "app_screen1.png", caption: "MediPulse home screen" },
      { file: "app_screen2.png", caption: "Bluetooth connection and infusion mode (continuous, single, repeated)" },
      { file: "app_screen3.png", caption: "Continuous infusion setup: time and volume" },
    ],

    media: [
      { type: "image", file: "cad.png" },
    ],
  },

  {
    slug: "zero-g-experiments-cnes",
    coverFit: "contain",
    specs: [
      { label: "CAMPAIGN",      value: "66th Parabolic Flight"   },
      { label: "AGENCY",        value: "CNES"                    },
      { label: "0-g WINDOWS",   value: "~20 sec / parabola"      },
      { label: "LOCATION",      value: "Bordeaux, France"        },
      { label: "EXPERIMENTS",   value: "6 across physics & chemistry" },
      { label: "OUTCOME",       value: "Full campaign success"   },
    ],
    title: "Zero-G Experiments, CNES",

    description:
      "Selected for the 66th Parabolic Flight Campaign of the French CNES. Designed and ran six original microgravity experiments spanning fluid dynamics, thermodynamics, chemistry, and classical mechanics, aboard a Zero-G aircraft over Bordeaux.",
    tags: ["Microgravity", "Fluid Dynamics", "Experimental", "CNES"],
    period: "2023 – 2024",
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
          "We brainstormed and evaluated dozens of ideas across fluid mechanics, thermodynamics, chemistry, and classical mechanics, then selected six experiments that would change meaningfully in weightlessness and still produce clear, observable results inside a 20-second window. Each one started as a concept sketch and a CAD model.",
      },
      {
        title: "Build & CNES Safety Review",
        description:
          "Over several months we built and iterated on the experiment rigs to pass CNES's safety requirements: aluminum-frame structures, sealed acrylic enclosures, and self-contained fluid apparatus. This meant structural reviews, material-compatibility checks, and repeated design presentations to CNES engineers, each revision making the hardware safer, simpler, and more reliable.",
      },
      {
        title: "Ground Testing",
        description:
          "Before flight, we ran every experiment on the ground to rehearse the procedure and set a 1-g baseline, from spinning up a vortex on a magnetic stirrer to tracking how a dye disperses through water. Ground testing is what let us trust the few seconds we would get in the air.",
      },
      {
        title: "Flight Day & Results",
        description:
          "The campaign took place in Bordeaux aboard CNES's Zero-G aircraft. During each parabola the aircraft follows a Keplerian arc that produces about 20 seconds of weightlessness. We ran the experiments across multiple parabolas, operating the rigs and capturing data in real time, then processed the results afterward. Observing physics in real weightlessness, convection stopping, fluids floating free, forces behaving differently, was unlike anything a ground lab can offer.",
      },
    ],

    outcome: `The campaign was a success. All six experiments ran as planned across the flight, and we collected clean data from each parabola. Seeing the predictions hold in real weightlessness, after a year of design, building, and CNES reviews, made every late night worth it.

The campaign earned two of our students a flight aboard the CNES Zero-G aircraft and positioned the club for two consecutive Young Searchers Prize victories in the years that followed. It remains one of the most formative engineering and leadership experiences of my career so far.`,

    design: [
      { file: "cad_centrifuge.jpg", caption: "CAD design of the centrifuge / artificial-gravity experiment" },
      { file: "sketch_oildrop.jpg", caption: "Whiteboard design sketch for the oil-drop experiment" },
    ],

    analysis: [
      { file: "build_frame.jpg", caption: "Building the aluminum experiment frame" },
      { file: "build_enclosure.jpg", caption: "Sealed acrylic enclosure on its base" },
      { file: "build_apparatus.jpg", caption: "Fluid apparatus: chamber, syringes, and tubing" },
    ],

    tests: [
      { file: "test_vortex.jpg", caption: "Ground test: vortex on a magnetic stirrer" },
      { file: "test_dye.jpg", caption: "Ground test: dye dispersion in test tubes" },
    ],

    experiments: [
      { title: "Vortex", blurb: "How a maelstrom forms, and what happens to a vortex when gravity is taken away.", pdf: "exp-vortex.pdf" },
      { title: "Thermodynamics", blurb: "Hot rises and cold sinks on Earth. Testing whether natural convection survives in weightlessness.", pdf: "exp-thermodynamics.pdf" },
      { title: "Centrifuge", blurb: "Spinning to create artificial gravity, a building block for long-duration space travel.", pdf: "exp-centrifuge.pdf" },
      { title: "Miscibility & Decantation", blurb: "How immiscible liquids separate, or refuse to, when there is no gravity to drive decantation.", pdf: "exp-miscibility.pdf" },
      { title: "Dye Diffusion", blurb: "Watching a dye spread to isolate pure molecular diffusion from gravity-driven mixing.", pdf: "exp-diffusion.pdf" },
      { title: "Newton's 3rd Law", blurb: "The Mentos-and-soda geyser as a clean demonstration of action and reaction.", pdf: "exp-newton.pdf" },
    ],

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
  "automatic-syringe-pump",
  "zero-g-experiments-cnes",
];

export const projects: Project[] = [...projectsRaw].sort(
  (a, b) => PROJECT_ORDER.indexOf(a.slug) - PROJECT_ORDER.indexOf(b.slug)
);
