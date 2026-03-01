export type OutputType = "code" | "script" | "app" | "report" | "workflow" | "unknown";

export interface ExtractedMetadata {
  outputType: OutputType;
  frameworks: string[];
  levelOfDetail: "high" | "medium" | "low";
  dependencies: string[];
}

export interface PromptMetadata {
  recommendedStructure: string;
  suggestedLibraries: string[];
  estimatedSteps: string[];
}

export interface OptimizationResult {
  originalInput: string;
  optimizedPrompt: string;
  metadata: PromptMetadata;
  extractedMetadata: ExtractedMetadata;
  explanations: Record<string, string>; // Maps parts of the prompt to an explanation
}
