import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin-auth";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || "";
  // Hardening: the cookie-signing key must exist and be independent of the
  // password. Otherwise knowing the password is enough to forge a session.
  if (!secret || secret === getAdminPassword()) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to a value distinct from ADMIN_PASSWORD.",
    );
  }
  return secret;
}

/**
 * Timing-safe check of a submitted admin password against the configured one.
 * Returns false (never throws) when the password is unconfigured.
 */
export function verifyAdminPassword(submitted: string) {
  const expected = getAdminPassword();
  if (!expected) return false;
  return safeEqual(submitted, expected);
}

function createSessionSignature(password: string) {
  return createHmac("sha256", getSessionSecret())
    .update(`admin-session:${password}`)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export async function isAdminAuthenticated() {
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  // A misconfigured secret must fail closed (redirect to login), not 500.
  try {
    const expected = createSessionSignature(adminPassword);
    return safeEqual(token, expected);
  } catch {
    return false;
  }
}

export async function setAdminSession() {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createSessionSignature(adminPassword), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
