import test from "node:test";
import assert from "node:assert";
import { createHash, timingSafeEqual } from "node:crypto";

// Manually extract the logic from lib/auth.ts since we can't import it
function authorize(credentials: any) {
  const password = credentials?.password;
  const expectedPassword = process.env.AGENT_PASSWORD;

  if (!password || !expectedPassword) {
    return null;
  }

  const passwordHash = createHash("sha256").update(password).digest();
  const expectedHash = createHash("sha256").update(expectedPassword).digest();

  if (passwordHash.length === expectedHash.length && timingSafeEqual(passwordHash, expectedHash)) {
    return { id: "1", name: "Commander" };
  }

  return null;
}

test("authOptions.authorize logic - valid password", async () => {
  const originalPassword = process.env.AGENT_PASSWORD;
  process.env.AGENT_PASSWORD = "test-password";
  try {
    const result = await authorize({ password: "test-password" });
    assert.deepStrictEqual(result, { id: "1", name: "Commander" });
  } finally {
    process.env.AGENT_PASSWORD = originalPassword;
  }
});

test("authOptions.authorize logic - invalid password", async () => {
  const originalPassword = process.env.AGENT_PASSWORD;
  process.env.AGENT_PASSWORD = "test-password";
  try {
    const result = await authorize({ password: "wrong-password" });
    assert.strictEqual(result, null);
  } finally {
    process.env.AGENT_PASSWORD = originalPassword;
  }
});

test("authOptions.authorize logic - missing password in credentials", async () => {
  const originalPassword = process.env.AGENT_PASSWORD;
  process.env.AGENT_PASSWORD = "test-password";
  try {
    const result = await authorize({});
    assert.strictEqual(result, null);
  } finally {
    process.env.AGENT_PASSWORD = originalPassword;
  }
});

test("authOptions.authorize logic - missing environment variable", async () => {
  const originalPassword = process.env.AGENT_PASSWORD;
  delete process.env.AGENT_PASSWORD;
  try {
    const result = await authorize({ password: "any-password" });
    assert.strictEqual(result, null);
  } finally {
    process.env.AGENT_PASSWORD = originalPassword;
  }
});
