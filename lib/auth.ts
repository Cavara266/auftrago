import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  companyName: string;
  contactName: string;
  role: "provider";
  credits: number;
  status: "PENDING" | "APPROVED" | "BLOCKED";
};

export type Session = {
  user: AuthUser;
};

type SessionPayload = {
  providerId: string;
  expiresAt: number;
};

const SESSION_COOKIE_NAME = "auftrago_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET fehlt.");
  }

  return secret;
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encodedPayload: string): SessionPayload | null {
  try {
    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as SessionPayload;

    if (
      !payload.providerId ||
      typeof payload.providerId !== "string" ||
      !payload.expiresAt ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function createSignature(encodedPayload: string) {
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function verifySignature(encodedPayload: string, signature: string) {
  const expectedSignature = createSignature(encodedPayload);

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function createSessionToken(providerId: string) {
  const payload: SessionPayload = {
    providerId,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };

  const encodedPayload = encodePayload(payload);
  const signature = createSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function readSessionToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  if (!verifySignature(encodedPayload, signature)) {
    return null;
  }

  const payload = decodePayload(encodedPayload);

  if (!payload) {
    return null;
  }

  if (payload.expiresAt <= Date.now()) {
    return null;
  }

  return payload;
}

async function getProviderFromSession(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = readSessionToken(token);

  if (!payload) {
    return null;
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: payload.providerId,
    },
    select: {
      id: true,
      email: true,
      companyName: true,
      contactName: true,
      credits: true,
      status: true,
    },
  });

  if (!provider || provider.status === "BLOCKED") {
    return null;
  }

  return {
    id: provider.id,
    email: provider.email,
    name: provider.contactName,
    companyName: provider.companyName,
    contactName: provider.contactName,
    role: "provider",
    credits: provider.credits,
    status: provider.status,
  };
}

export async function requireUser(): Promise<AuthUser | null> {
  return getProviderFromSession();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return getProviderFromSession();
}

export async function getSession(): Promise<Session | null> {
  const user = await getProviderFromSession();

  if (!user) {
    return null;
  }

  return {
    user,
  };
}

export async function createSession(user: AuthUser): Promise<Session> {
  const token = createSessionToken(user.id);
  const cookieStore = cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  return {
    user,
  };
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function clearSessionUser(): Promise<void> {
  await clearSession();
}

export async function setSessionUser(user: AuthUser): Promise<Session> {
  return createSession(user);
}