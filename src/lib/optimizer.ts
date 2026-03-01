import { OptimizationResult, OutputType, ExtractedMetadata, PromptMetadata } from "@/types";

// Helper function to extract framework, language, and environment from user input
function extractFrameworks(input: string): string[] {
  const commonFrameworks = ["react", "next.js", "nextjs", "vue", "angular", "node", "node.js", "python", "django", "flask", "ruby", "rails", "go", "rust", "typescript", "javascript", "bash"];
  const found: string[] = [];
  const lowerInput = input.toLowerCase();

  commonFrameworks.forEach(fw => {
    if (lowerInput.includes(fw)) {
      found.push(fw);
    }
  });

  // Clean up duplicates (e.g., node and node.js)
  if (found.includes("node.js") && found.includes("node")) {
    found.splice(found.indexOf("node"), 1);
  }
  if (found.includes("next.js") && found.includes("nextjs")) {
    found.splice(found.indexOf("nextjs"), 1);
  }

  return found;
}

// Helper to guess output type based on keywords
function guessOutputType(input: string): OutputType {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes("app") || lowerInput.includes("application") || lowerInput.includes("webapp")) return "app";
  if (lowerInput.includes("script") || lowerInput.includes("cli") || lowerInput.includes("tool")) return "script";
  if (lowerInput.includes("report") || lowerInput.includes("document") || lowerInput.includes("summary")) return "report";
  if (lowerInput.includes("workflow") || lowerInput.includes("pipeline") || lowerInput.includes("ci/cd")) return "workflow";
  if (lowerInput.includes("function") || lowerInput.includes("class") || lowerInput.includes("code")) return "code";

  return "app"; // Default assumption
}

// Extractor function for metadata
function extractMetadata(input: string): ExtractedMetadata {
  const outputType = guessOutputType(input);
  const frameworks = extractFrameworks(input);

  // Simple heuristic for level of detail based on word count
  const wordCount = input.split(/\s+/).length;
  const levelOfDetail = wordCount > 50 ? "high" : (wordCount > 20 ? "medium" : "low");

  // Simple dependency extraction heuristic
  const dependencies: string[] = [];
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes("database") || lowerInput.includes("sql") || lowerInput.includes("postgres")) dependencies.push("PostgreSQL");
  if (lowerInput.includes("api") || lowerInput.includes("fetch")) dependencies.push("Axios/Fetch");
  if (lowerInput.includes("auth") || lowerInput.includes("login")) dependencies.push("Authentication Provider (e.g. NextAuth/Auth0)");
  if (lowerInput.includes("ui") || lowerInput.includes("style") || lowerInput.includes("tailwind")) dependencies.push("Tailwind CSS");

  return {
    outputType,
    frameworks,
    levelOfDetail,
    dependencies
  };
}

// Generate the optimized prompt string
function generateOptimizedPrompt(input: string, extracted: ExtractedMetadata): string {
  const fwString = extracted.frameworks.length > 0 ? extracted.frameworks.join(", ") : "an appropriate framework";
  const typeString = extracted.outputType;

  let prompt = `You are Jules, an expert software engineer. Your task is to build a ${typeString} based on the following requirements:

REQUIREMENTS:
"${input}"

TECHNICAL STACK:
- Framework/Language: ${fwString}
- Key Dependencies: ${extracted.dependencies.length > 0 ? extracted.dependencies.join(", ") : "Standard libraries as needed"}

INSTRUCTIONS:
1. *Analysis & Planning:* Before writing code, use the \`set_plan\` tool to create a clear, step-by-step plan for implementing this ${typeString}. Include a step to initialize the project, a step to implement the core logic, and a step to test the functionality.
2. *Environment Setup:* Ensure all necessary dependencies are installed in the workspace. Use \`run_in_bash_session\` to initialize the project and install packages.
3. *Implementation Details:*
   - Write clean, modular, and well-documented code.
   - For any UI components or web apps, ensure a responsive design.
   - For scripts or backend code, include proper error handling and logging.
4. *Verification:* After creating or modifying files, verify your changes by running tests or using read-only tools like \`cat\` or \`ls\`.
5. *Pre-commit & Submission:* Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done. Once all checks pass, submit your work.

Please begin by exploring the workspace, checking for any existing \`AGENTS.md\` or \`README.md\` files, and setting your plan.`;

  return prompt;
}

// Generate the metadata and explanations
export function optimizePrompt(input: string): OptimizationResult {
  const extracted = extractMetadata(input);
  const optimizedPrompt = generateOptimizedPrompt(input, extracted);

  const recommendedStructure = extracted.outputType === "app"
    ? "src/\n  components/\n  lib/\n  app/ (or pages/)\npublic/\npackage.json"
    : (extracted.outputType === "script"
      ? "src/\n  main.ts\n  utils.ts\npackage.json"
      : "Standard project structure based on framework");

  const metadata: PromptMetadata = {
    recommendedStructure,
    suggestedLibraries: extracted.dependencies,
    estimatedSteps: [
      "1. Analyze requirements and set a plan.",
      "2. Initialize project and install dependencies.",
      "3. Implement core features.",
      "4. Test and verify changes.",
      "5. Complete pre-commit checks and submit."
    ]
  };

  const explanations: Record<string, string> = {
    "You are Jules, an expert software engineer.": "Establishes the persona and sets a high baseline for code quality.",
    "TECHNICAL STACK:": "Clearly defines the constraints and tools to be used, reducing ambiguity for the AI.",
    "use the `set_plan` tool": "Forces the AI to think step-by-step and create a structured plan before writing code.",
    "Complete pre-commit steps": "Ensures the AI runs necessary checks and verifications before finalizing the task."
  };

  return {
    originalInput: input,
    optimizedPrompt,
    metadata,
    extractedMetadata: extracted,
    explanations
  };
}
