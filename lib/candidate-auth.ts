import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type CandidateAuthUser = {
  id: string;
  candidateProfileId: string;
  email: string;
  credits: number;
  status: string;
};

export type CandidateSession = {
  user: CandidateAuthUser;
};

type CandidateSessionPayload = {
  candidateAccountId: string;
  sessionVersion: number;
  expiresAt: number;
};

const COOKIE_NAME = "auftrago_candidate_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;

function getSecret() {
  const secret =
    process.env.CANDIDATE_SESSION_SECRET || process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("CANDIDATE_SESSION_SECRET oder AUTH_SECRET fehlt.");
  }

  return secret;
}

function encodePayload(payload: CandidateSessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(encodedPayload: string): CandidateSessionPayload | null {
  try {
    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");

    const payload = JSON.parse(decoded) as CandidateSessionPayload;

    if (
      !payload.candidateAccountId ||
      typeof payload.candidateAccountId !== "string" ||
      typeof payload.sessionVersion !== "number" ||
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
    .createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function verifySignature(encodedPayload: string, signature: string) {
  const expected = createSignature(encodedPayload);

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function createToken(accountId: string, sessionVersion: number) {
  const payload: CandidateSessionPayload = {
    candidateAccountId: accountId,
    sessionVersion,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };

  const encodedPayload = encodePayload(payload);
  const signature = createSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function readToken(token: string): CandidateSessionPayload | null {
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

export async function createCandidateSession(accountId: string) {
  const account = await prisma.candidateAccount.findUnique({
    where: {
      id: accountId,
    },
    select: {
      id: true,
      sessionVersion: true,
    },
  });

  if (!account) {
    throw new Error("CandidateAccount nicht gefunden.");
  }

  const token = createToken(account.id, account.sessionVersion);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearCandidateSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getCandidateSession(): Promise<CandidateSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = readToken(token);

  if (!payload) {
    return null;
  }

  const account = await prisma.candidateAccount.findUnique({
    where: {
      id: payload.candidateAccountId,
    },
    select: {
      id: true,
      candidateProfileId: true,
      credits: true,
      status: true,
      sessionVersion: true,
      candidateProfile: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!account) {
    return null;
  }

  if (account.sessionVersion !== payload.sessionVersion) {
    return null;
  }

  if (account.status !== "ACTIVE") {
    return null;
  }

  return {
    user: {
      id: account.id,
      candidateProfileId: account.candidateProfileId,
      email: account.candidateProfile.email ?? "",
      credits: account.credits,
      status: account.status,
    },
  };
}

export async function requireCandidate() {
  const session = await getCandidateSession();

  if (!session) {
    throw new Error("CANDIDATE_UNAUTHORIZED");
  }

  return session.user;
}
