import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface ShellResult {
  stdout: string;
  stderr: string;
  success: boolean;
}

export async function runCommand(command: string, cwd: string = process.cwd()): Promise<ShellResult> {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    return { stdout, stderr, success: true };
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    return {
      stdout: err.stdout || "",
      stderr: err.stderr || err.message || String(error),
      success: false,
    };
  }
}
