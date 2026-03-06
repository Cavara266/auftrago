import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const SESSION_COOKIE_NAME = "session";

export async function setSessionUser(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionUser() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function requireUser() {
  const userId = await getSessionUserId();

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      companyName: true,
      phone: true,
      city: true,
      credits: true,
    },
  });

  if (!user) return null;

  return user;
}