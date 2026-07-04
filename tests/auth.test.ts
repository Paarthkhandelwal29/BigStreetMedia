import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// auth.ts imports next/headers at module load (for cookies()). We never call
// cookies() in these tests, but mock it so the import resolves under node.
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { verifyAdminPassword } from "@/lib/cms/auth";

describe("verifyAdminPassword", () => {
  const original = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "s3cret-pass";
  });
  afterEach(() => {
    process.env.ADMIN_PASSWORD = original;
  });

  it("accepts the exact configured password", () => {
    expect(verifyAdminPassword("s3cret-pass")).toBe(true);
  });

  it("rejects a wrong password of equal length", () => {
    expect(verifyAdminPassword("x3cret-pass")).toBe(false);
  });

  it("rejects a wrong password of different length", () => {
    expect(verifyAdminPassword("nope")).toBe(false);
    expect(verifyAdminPassword("")).toBe(false);
  });

  it("rejects everything when no password is configured", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyAdminPassword("anything")).toBe(false);
    expect(verifyAdminPassword("")).toBe(false);
  });
});
