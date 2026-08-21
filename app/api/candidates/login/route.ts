import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { createCandidateSession } from "@/lib/candidate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const email = clean(formData.get("email")).toLowerCase();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/login?error=missing", request.url),
      );
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/login?error=invalid", request.url),
      );
    }

    const account = await prisma.candidateAccount.findUnique({
      where: {
        candidateProfileId: profile.id,
      },
      select: {
        id: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!account || account.status !== "ACTIVE") {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/login?error=invalid", request.url),
      );
    }

    const passwordValid = await bcrypt.compare(password, account.passwordHash);

    if (!passwordValid) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/login?error=invalid", request.url),
      );
    }

    await createCandidateSession(account.id);

    return NextResponse.redirect(new URL("/arbeit-suchen/konto", request.url));
  } catch (error) {
    console.error("===== CANDIDATE LOGIN ERROR =====");
    console.error(error);
    console.error("=================================");

    return NextResponse.redirect(
      new URL("/arbeit-suchen/login?error=server", request.url),
    );
  }
}
