// Drug-Drug Interaction Database
// This is a simplified database for demonstration. In production, this would be
// sourced from clinical databases like DrugBank, Micromedex, or Indian drug interaction databases.

export type InteractionSeverity = "contraindicated" | "major" | "moderate" | "minor" | "unknown";

export interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: InteractionSeverity;
  description: string;
  recommendation: string;
  evidence: string;
}

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  // Antibiotics + Anticoagulants
  {
    drugA: "Amoxicillin",
    drugB: "Warfarin",
    severity: "major",
    description: "Amoxicillin may enhance the anticoagulant effect of warfarin, increasing bleeding risk",
    recommendation: "Monitor INR closely; consider dose adjustment of warfarin",
    evidence: "Well-documented clinical interaction",
  },
  {
    drugA: "Ciprofloxacin",
    drugB: "Warfarin",
    severity: "major",
    description: "Ciprofloxacin may increase warfarin levels and bleeding risk",
    recommendation: "Monitor INR; consider alternative antibiotic",
    evidence: "Well-documented clinical interaction",
  },
  
  // NSAIDs + Anticoagulants
  {
    drugA: "Ibuprofen",
    drugB: "Warfarin",
    severity: "major",
    description: "Increased risk of gastrointestinal bleeding",
    recommendation: "Avoid concurrent use; consider paracetamol as alternative",
    evidence: "Well-documented clinical interaction",
  },
  {
    drugA: "Aspirin",
    drugB: "Warfarin",
    severity: "major",
    description: "Significantly increased bleeding risk",
    recommendation: "Avoid unless specifically indicated; monitor closely",
    evidence: "Well-documented clinical interaction",
  },
  
  // ACE Inhibitors + Potassium-Sparing Diuretics
  {
    drugA: "Enalapril",
    drugB: "Spironolactone",
    severity: "major",
    description: "Increased risk of hyperkalemia",
    recommendation: "Monitor potassium levels regularly",
    evidence: "Well-documented clinical interaction",
  },
  
  // Beta Blockers + Calcium Channel Blockers
  {
    drugA: "Metoprolol",
    drugB: "Verapamil",
    severity: "moderate",
    description: "Additive effects on heart rate and blood pressure",
    recommendation: "Monitor blood pressure and heart rate; dose adjustment may be needed",
    evidence: "Moderate clinical evidence",
  },
  
  // SSRIs + MAO Inhibitors
  {
    drugA: "Fluoxetine",
    drugB: "Phenelzine",
    severity: "contraindicated",
    description: "Serotonin syndrome risk - potentially life-threatening",
    recommendation: "CONTRAINDICATED - Do not use together",
    evidence: "Black box warning",
  },
  
  // Statins + Macrolides
  {
    drugA: "Atorvastatin",
    drugB: "Clarithromycin",
    severity: "major",
    description: "Increased risk of myopathy and rhabdomyolysis",
    recommendation: "Consider temporary statin discontinuation or dose reduction",
    evidence: "Well-documented clinical interaction",
  },
  
  // Common Indian Drug Interactions
  {
    drugA: "Metformin",
    drugB: "Furosemide",
    severity: "moderate",
    description: "May increase risk of lactic acidosis in renal impairment",
    recommendation: "Monitor renal function; avoid in severe renal impairment",
    evidence: "Moderate clinical evidence",
  },
  {
    drugA: "Metformin",
    drugB: "Cimetidine",
    severity: "moderate",
    description: "May increase metformin levels",
    recommendation: "Monitor blood glucose; consider dose adjustment",
    evidence: "Moderate clinical evidence",
  },
];

export class DrugInteractionEngine {
  private interactions: DrugInteraction[];

  constructor() {
    this.interactions = DRUG_INTERACTIONS;
  }

  /**
   * Check for interactions between a list of medications
   */
  checkInteractions(medications: string[]): DrugInteraction[] {
    const foundInteractions: DrugInteraction[] = [];
    const normalizedMeds = medications.map((m) => this.normalizeDrugName(m));

    // Check all pairs
    for (let i = 0; i < normalizedMeds.length; i++) {
      for (let j = i + 1; j < normalizedMeds.length; j++) {
        const interaction = this.findInteraction(normalizedMeds[i], normalizedMeds[j]);
        if (interaction) {
          foundInteractions.push(interaction);
        }
      }
    }

    // Sort by severity
    const severityOrder: Record<InteractionSeverity, number> = {
      contraindicated: 0,
      major: 1,
      moderate: 2,
      minor: 3,
      unknown: 4,
    };

    return foundInteractions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  /**
   * Find interaction between two specific drugs
   */
  private findInteraction(drugA: string, drugB: string): DrugInteraction | null {
    return (
      this.interactions.find(
        (i) =>
          (this.normalizeDrugName(i.drugA) === drugA && this.normalizeDrugName(i.drugB) === drugB) ||
          (this.normalizeDrugName(i.drugA) === drugB && this.normalizeDrugName(i.drugB) === drugA)
      ) || null
    );
  }

  /**
   * Normalize drug name for matching (case-insensitive, remove spaces)
   */
  private normalizeDrugName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "");
  }

  /**
   * Get severity color for UI display
   */
  getSeverityColor(severity: InteractionSeverity): string {
    switch (severity) {
      case "contraindicated":
        return "bg-red-600 text-white";
      case "major":
        return "bg-red-100 text-red-800 border-red-300";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "minor":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "unknown":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Get severity label
   */
  getSeverityLabel(severity: InteractionSeverity): string {
    switch (severity) {
      case "contraindicated":
        return "CONTRAINDICATED";
      case "major":
        return "Major";
      case "moderate":
        return "Moderate";
      case "minor":
        return "Minor";
      case "unknown":
        return "Unknown";
      default:
        return "Unknown";
    }
  }
}

// Singleton instance
export const interactionEngine = new DrugInteractionEngine();
