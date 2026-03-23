import { execFile } from "child_process";
import { promisify } from "util";
import { parse } from "shell-quote";

const execFileAsync = promisify(execFile);

export interface ShellResult {
  stdout: string;
  stderr: string;
  success: boolean;
}

export async function runCommand(command: string, cwd: string = process.cwd()): Promise<ShellResult> {
  const parsedArgs = parse(command);

  const args: string[] = [];
  for (const arg of parsedArgs) {
    if (typeof arg === "string") {
      args.push(arg);
    } else if (typeof arg === "object") {
      if ("pattern" in arg && arg.op === "glob") {
        args.push(arg.pattern);
      } else if ("op" in arg) {
        args.push(arg.op);
      }
    }
  }

  if (args.length === 0) {
    return { stdout: "", stderr: "Empty command", success: false };
  }

  const cmd = args[0];
  const cmdArgs = args.slice(1);

  try {
    const { stdout, stderr } = await execFileAsync(cmd, cmdArgs, { cwd, shell: false });
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
