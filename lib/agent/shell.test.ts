import test from "node:test";
import assert from "node:assert";
import { runCommand } from "./shell.ts";

test("runCommand - successful execution", async () => {
  const result = await runCommand("echo 'hello world'");
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.stdout.trim(), "hello world");
  assert.strictEqual(result.stderr, "");
});

test("runCommand - failing execution", async () => {
  const result = await runCommand("node -e 'console.error(\"error message\"); process.exit(1)'");
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.stdout, "");
  // The exact error message output by node includes the command line string,
  // but let's check if it contains the error text we output
  assert.ok(result.stderr.includes("error message"));
});

test("runCommand - invalid command", async () => {
  const result = await runCommand("thiscommanddoesnotexist123");
  assert.strictEqual(result.success, false);
  assert.ok(result.stderr.includes("not found") || result.stderr.includes("not recognized") || result.stderr.includes("ENOENT") || result.stderr.includes("thiscommanddoesnotexist123"));
});

test("runCommand - handles cwd correctly", async () => {
  // Use /tmp as cwd to test with an absolute path
  const result = await runCommand("pwd", "/tmp");
  assert.strictEqual(result.success, true);
  // Ensure the actual output is the requested working directory
  assert.strictEqual(result.stdout.trim(), "/tmp");
});
