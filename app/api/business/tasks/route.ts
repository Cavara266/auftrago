import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

export async function POST(
  request: Request
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(
      body.title || ""
    ).trim();

    if (!title) {
      return NextResponse.json(
        { error: "Titel fehlt." },
        { status: 400 }
      );
    }

    const priority =
      priorities.includes(
        String(body.priority)
      )
        ? String(body.priority)
        : "MEDIUM";

    const dueAt =
      body.dueAt
        ? new Date(body.dueAt)
        : null;

    const valueCents =
      Number.isFinite(
        Number(body.value)
      )
        ? Math.max(
            0,
            Math.round(
              Number(body.value) * 100
            )
          )
        : 0;

    const task =
      await prisma.businessWorkflowTask.create({
        data: {
          providerId: user.id,
          sourceType: "MANUAL",
          sourceId: crypto.randomUUID(),

          title,

          description:
            typeof body.description === "string"
              ? body.description.trim() || null
              : null,

          assigneeName:
            typeof body.assigneeName === "string"
              ? body.assigneeName.trim() || null
              : null,

          notes:
            typeof body.notes === "string"
              ? body.notes.trim() || null
              : null,

          priority,
          valueCents,
          dueAt,
          status: "OPEN",
        },
      });

    return NextResponse.json({
      ok: true,
      task,
    });
  } catch (error) {
    console.error(
      "BUSINESS TASK CREATE ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Aufgabe konnte nicht erstellt werden.",
      },
      { status: 500 }
    );
  }
}
