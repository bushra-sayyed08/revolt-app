export interface DiagnosisStep {
  stepNumber: number;
  title: string;
  instruction: string;
  safetyTip?: string;
  toolsNeeded: string[];
}

export interface SalvageableComponent {
  name: string;
  reusePotential: string;
  estimatedValue: string;
  safeToExtract: boolean;
}

export interface DiagnosisResult {
  deviceName: string;
  deviceCategory: string;
  confidenceScore: number;
  identifiedIssue: {
    summary: string;
    rootCause: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    repairDifficulty: "Beginner" | "Intermediate" | "Advanced";
  };
  safetyNotice: string;
  toolsRequired: string[];
  repairSteps: DiagnosisStep[];
  salvageableParts: SalvageableComponent[];
  impactMetrics: {
    co2SavedKg: number;
    eWasteDivertedKg: number;
    moneySavedEstimatedUsd: number;
    waterConservedLitres: number;
  };
  localActionAdvice: string;
}

export const SAMPLE_DIAGNOSES: Record<string, DiagnosisResult> = {
  microwave: {
    deviceName: "Home Microwave Oven (Inverter/Transformer issue)",
    deviceCategory: "Home Appliance",
    confidenceScore: 94,
    identifiedIssue: {
      summary: "Blown Thermal Fuse / High-Voltage Diode failure",
      rootCause: "Overheating or internal surge tripped the thermal cutoff fuse. Display powers on but no heating occurs.",
      severity: "High",
      repairDifficulty: "Intermediate"
    },
    safetyNotice: "DANGER: High-voltage capacitors can hold a lethal electrical charge even when unplugged. Always unplug the unit and discharge the capacitor using an insulated screwdriver before touching internal terminals.",
    toolsRequired: ["Phillips Screwdriver (#2)", "Needle Nose Pliers", "Replacement 15A 250V Thermal Fuse", "Insulated Gloves"],
    repairSteps: [
      {
        stepNumber: 1,
        title: "Total Power Isolation",
        instruction: "Unplug the microwave completely from the wall socket. Wait at least 15 minutes before proceeding.",
        safetyTip: "Never attempt to open or repair while plugged into AC mains.",
        toolsNeeded: ["None"]
      },
      {
        stepNumber: 2,
        title: "Remove Outer Shroud",
        instruction: "Unscrew the 4-6 perimeter screws on the rear and sides of the metal chassis and slide the casing back.",
        safetyTip: "Wear work gloves to avoid sharp sheet metal edges.",
        toolsNeeded: ["Phillips Screwdriver (#2)"]
      },
      {
        stepNumber: 3,
        title: "Locate & Test Thermal Cutoff Fuse",
        instruction: "Inspect the white ceramic thermal fuse mounted near the magnetron cavity. Check for discoloration or continuity break.",
        safetyTip: "Do not touch the high voltage transformer or capacitor leads.",
        toolsNeeded: ["Needle Nose Pliers"]
      },
      {
        stepNumber: 4,
        title: "Replace Fuse & Secure Connections",
        instruction: "Unclip the blown fuse from its mounting bracket and snap in the matching rated replacement fuse securely.",
        safetyTip: "Ensure crimp spade terminals are tightly fitted and not loose.",
        toolsNeeded: ["Needle Nose Pliers"]
      },
      {
        stepNumber: 5,
        title: "Reassemble and Test with Water Cup",
        instruction: "Screw outer shroud back tightly. Plug in, put a cup of water inside, and run for 30 seconds to confirm heating.",
        safetyTip: "Never run a microwave empty without water or food load.",
        toolsNeeded: ["Phillips Screwdriver (#2)"]
      }
    ],
    salvageableParts: [
      {
        name: "Turn Table Synchronous Motor (21V/220V)",
        reusePotential: "Great for DIY rotating displays, wind-chime turntables, or solar trackers.",
        estimatedValue: "$12",
        safeToExtract: true
      },
      {
        name: "Door Microswitches (x3 SPDT snap action)",
        reusePotential: "High durability switches for home automation, 3D printer limit switches, or robotics.",
        estimatedValue: "$8",
        safeToExtract: true
      },
      {
        name: "High Power Cooling Fan with Shroud",
        reusePotential: "Excellent for soldering fume extractors or workshop bench ventilation.",
        estimatedValue: "$15",
        safeToExtract: true
      }
    ],
    impactMetrics: {
      co2SavedKg: 38.5,
      eWasteDivertedKg: 14.2,
      moneySavedEstimatedUsd: 120,
      waterConservedLitres: 480
    },
    localActionAdvice: "If the magnetron tube itself has failed with vacuum loss, take the unit to a certified e-waste recycler to safely recover copper coils."
  },
  pcb: {
    deviceName: "Power Supply Unit / Motherboard Circuit",
    deviceCategory: "Electronics / Computing",
    confidenceScore: 91,
    identifiedIssue: {
      summary: "Swollen / Bulging Electrolytic Filter Capacitors",
      rootCause: "Electrolyte degradation caused top vent bulging on two 1000uF 25V filter capacitors, causing unstable rail voltage.",
      severity: "Medium",
      repairDifficulty: "Beginner"
    },
    safetyNotice: "Allow all capacitors to discharge. Work on an anti-static mat and use adequate ventilation when desoldering.",
    toolsRequired: ["25W-40W Soldering Iron", "Desoldering Wick or Pump", "Rosin-core Solder (Lead-free)", "Replacement Low-ESR Capacitors (1000uF 25V)"],
    repairSteps: [
      {
        stepNumber: 1,
        title: "Inspect and Note Polarity",
        instruction: "Locate the bulging capacitor. Note the negative stripe marking on the side of the cylindrical canister and corresponding PCB silkscreen.",
        safetyTip: "Installing electrolytic capacitors in reverse polarity can cause them to burst when powered.",
        toolsNeeded: ["Magnifying Glass / Light"]
      },
      {
        stepNumber: 2,
        title: "Desolder Faulty Component",
        instruction: "Apply hot soldering iron tip to the rear solder joints while gently wiggling the capacitor from the top side until freed. Use wick to clean the holes.",
        safetyTip: "Do not hold heat on the copper trace for more than 4 seconds to avoid pad lifting.",
        toolsNeeded: ["Soldering Iron", "Desoldering Wick"]
      },
      {
        stepNumber: 3,
        title: "Insert and Solder Replacement",
        instruction: "Insert the new capacitor matching the negative stripe to ground. Solder both leads cleanly and trim excess wire leads with snips.",
        safetyTip: "Check for solder bridges between adjacent traces.",
        toolsNeeded: ["Soldering Iron", "Rosin-core Solder"]
      }
    ],
    salvageableParts: [
      {
        name: "Ferrite Core Toroidal Inductors",
        reusePotential: "RF choke filters, buck converter DIY projects, or clean audio power supplies.",
        estimatedValue: "$6",
        safeToExtract: true
      },
      {
        name: "Aluminum Anodized Heatsinks",
        reusePotential: "Thermal cooling blocks for Raspberry Pi, LED drivers, or audio amplifiers.",
        estimatedValue: "$10",
        safeToExtract: true
      }
    ],
    impactMetrics: {
      co2SavedKg: 24.0,
      eWasteDivertedKg: 1.8,
      moneySavedEstimatedUsd: 75,
      waterConservedLitres: 290
    },
    localActionAdvice: "Lead-free solder and trimmed component leads should be deposited in metals recycling or specialized e-drop bins."
  },
  earphones: {
    deviceName: "Over-Ear Wireless Headphones",
    deviceCategory: "Audio & Wearables",
    confidenceScore: 96,
    identifiedIssue: {
      summary: "Degraded Lithium-Polymer Battery / Broken Hinge Wire",
      rootCause: "Battery chemistry wear causing immediate shutdown on unplug, or flex fatigue in headband wiring harness.",
      severity: "Low",
      repairDifficulty: "Beginner"
    },
    safetyNotice: "Do not puncture, bend or heat lithium pouch cells. Puncturing may cause thermal runaway and fire.",
    toolsRequired: ["Plastic Spudger / Guitar Pick", "T5 Torx / Mini Phillips", "Replacement 3.7V Li-Po Cell (with protection circuit)"],
    repairSteps: [
      {
        stepNumber: 1,
        title: "Detach Ear Cushion",
        instruction: "Gently twist or pry the leatherette ear cushion counter-clockwise to reveal internal cup retaining screws.",
        safetyTip: "Use plastic tools to avoid tearing the foam membrane.",
        toolsNeeded: ["Plastic Spudger"]
      },
      {
        stepNumber: 2,
        title: "Disconnect Old Battery Safely",
        instruction: "Unplug the mini JST connector or desolder the red (+) and black (-) leads one by one, immediately taping bare wire ends.",
        safetyTip: "Never short positive and negative leads together.",
        toolsNeeded: ["Tweezers / Mini Iron"]
      },
      {
        stepNumber: 3,
        title: "Adhere New Battery & Close",
        instruction: "Use non-conductive double-sided tape to seat the new battery firmly. Reconnect and snap cushion back on.",
        safetyTip: "Ensure wires are not pinched in the shell closure seam.",
        toolsNeeded: ["Double-sided adhesive"]
      }
    ],
    salvageableParts: [
      {
        name: "40mm Neodymium Audio Drivers",
        reusePotential: "Can be repurposed into retro audio speakers, headphone modding, or helmet intercoms.",
        estimatedValue: "$20",
        safeToExtract: true
      },
      {
        name: "MEMS Microphones & Bluetooth 5.0 Module",
        reusePotential: "ESP32 voice assistant microphones or custom Bluetooth audio receivers.",
        estimatedValue: "$14",
        safeToExtract: true
      }
    ],
    impactMetrics: {
      co2SavedKg: 14.8,
      eWasteDivertedKg: 0.45,
      moneySavedEstimatedUsd: 90,
      waterConservedLitres: 160
    },
    localActionAdvice: "Drop the degraded swollen Li-Po battery at retail battery drop boxes (e.g. Best Buy, Call2Recycle, or local municipal depots)."
  }
};
