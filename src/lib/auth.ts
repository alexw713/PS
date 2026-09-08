import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "ps_admin_session";

function secret() {
  return process.env.SESSION_SECRET || "dev-insecure-secret";
}

export function createSessionToken(username: string) {
  const payload = Buffer.from(JSON.stringify({ u: username, t: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.t || Date.now() - data.t > 7 * 24 * 60 * 60 * 1000) return false;
    return data.u === (process.env.ADMIN_USERNAME || "admin");
  } catch {
    return false;
  }
}

export function checkCredentials(username: string, password: string) {
  const u = process.env.ADMIN_USERNAME || "admin";
  const p = process.env.ADMIN_PASSWORD || "changeme";
  return username === u && password === p;
}

export async function isAdminAuthenticated() {
  const jar = cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}

export { COOKIE };
