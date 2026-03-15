import { runCommand, ShellResult } from "./shell";
import { generateRepairPrompt } from "./engine";
import prisma from "../prisma";

export async function attemptRepair(
  sessionId: string,
  failedCommand: string,
  errorLog: ShellResult
): Promise<boolean> {
  // Log the error and activity concurrently
  await Promise.all([
    prisma.errorLog.create({
      data: {
        sessionId,
        command: failedCommand,
        error: `STDOUT: ${errorLog.stdout}\nSTDERR: ${errorLog.stderr}`,
      },
    }),
    prisma.activity.create({
      data: {
        sessionId,
        type: "THOUGHT",
        content: `Self-Conscious Loop triggered: Command '${failedCommand}' failed. Attempting repair...`,
      },
    }),
  ]);

  try {
    // Generate repair code/action from the LLM
    const repairCommand = await generateRepairPrompt(failedCommand, errorLog.stderr);

    await prisma.activity.create({
      data: {
        sessionId,
        type: "THOUGHT",
        content: `Generated repair action: ${repairCommand}`,
      },
    });

    if (repairCommand) {
      await prisma.activity.create({
        data: {
          sessionId,
          type: "COMMAND",
          content: repairCommand,
        },
      });

      const repairResult = await runCommand(repairCommand);

      const content = repairResult.success
        ? `Repair successful for command '${failedCommand}'.`
        : `Repair failed for command '${failedCommand}'. Manual intervention may be needed.`;

      await prisma.activity.create({
        data: {
          sessionId,
          type: "THOUGHT",
          content,
        },
      });

      return repairResult.success;
    }
    return false;

  } catch (error: unknown) {
    console.error("Repair loop failed:", error);
    return false;
  }
}
