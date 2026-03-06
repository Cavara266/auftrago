import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RateEntry = {
  count: number;
  firstRequestAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;

const globalForRateLimit = globalThis as typeof globalThis & {
  anfrageRateLimit?: Map<string, RateEntry>;
};

const rateLimitStore =
  globalForRateLimit.anfrageRateLimit ?? new Map<string, RateEntry>();

if (!globalForRateLimit.anfrageRateLimit) {
  globalForRateLimit.anfrageRateLimit = rateLimitStore;
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing) {
    rateLimitStore.set(ip, {
      count: 1,
      firstRequestAt: now,
    });
    return false;
  }

  if (now - existing.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, {
      count: 1,
      firstRequestAt: now,
    });
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);

  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Zu viele Anfragen in kurzer Zeit. Bitte versuche es in einigen Minuten erneut.",
        },
        { status: 429 }
      );
    }

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const city = String(body.city ?? "").trim();
    const category = String(body.category ?? "").trim();
    const description = String(body.description ?? "").trim();

    const website = String(body.website ?? "").trim();
    const formStartedAt = Number(body.formStartedAt ?? 0);

    if (website) {
      return NextResponse.json({ ok: true });
    }

    const submittedTooFast =
      Number.isFinite(formStartedAt) &&
      formStartedAt > 0 &&
      Date.now() - formStartedAt < 2500;

    if (submittedTooFast) {
      return NextResponse.json(
        { ok: false, error: "Anfrage konnte nicht verarbeitet werden." },
        { status: 400 }
      );
    }

    if (!name || !phone || !email || !city || !category || !description) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Felder ausfüllen." },
        { status: 400 }
      );
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json(
        { ok: false, error: "Bitte eine gültige E-Mail eingeben." },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Bitte die Anfrage etwas genauer beschreiben." },
        { status: 400 }
      );
    }

    const title = `${category} in ${city}`;

    const lead = await prisma.lead.create({
      data: {
        title,
        category,
        city,
        description,
        contactName: name,
        contactPhone: phone,
        contactEmail: email,
        priceCredits: 4,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
    });
  } catch (error) {
    console.error("ANFRAGE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Serverfehler.",
      },
      { status: 500 }
    );
  }
}