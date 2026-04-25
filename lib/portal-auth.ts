import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "portal_session";

type SessionPayload = {
  email: string;
  exp: number;
};

function getSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing PORTAL_SESSION_SECRET");
  }
  return secret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function encode(payload: SessionPayload) {
  const json = JSON.stringify(payload);
  const base = Buffer.from(json).toString("base64url");
  const signature = sign(base);
  return `${base}.${signature}`;
}

function decode(token: string): SessionPayload | null {
  const [base, signature] = token.split(".");
  if (!base || !signature) return null;

  const expected = sign(base);
  if (expected !== signature) return null;

  try {
    const json = Buffer.from(base, "base64url").toString("utf8");
    const payload = JSON.parse(json) as SessionPayload;
    if (!payload?.email || !payload?.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createPortalSession(email: string) {
  const store = await cookies();

  const token = encode({
    email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
  });

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearPortalSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getPortalSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function requirePortalSession() {
  const session = await getPortalSession();
  return session;
}