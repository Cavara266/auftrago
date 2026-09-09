import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const allowedStatuses = [
  "OPEN",
  "IN_PROGRESS",
  "DONE",
];

const allowedPriorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const task =
      await prisma.businessWorkflowTask.findFirst({
        where: {
          id,
          providerId: user.id,
        },
      });

    if (!task) {
      return NextResponse.json(
        { error: "Aufgabe nicht gefunden." },
        { status: 404 }
      );
    }

    const status =
      typeof body.status === "string" &&
      allowedStatuses.includes(
        body.status
      )
        ? body.status
        : task.status;

    const priority =
      typeof body.priority === "string" &&
      allowedPriorities.includes(
        body.priority
      )
        ? body.priority
        : task.priority;

    const dueAt =
      body.dueAt === null
        ? null
        : typeof body.dueAt === "string" &&
          body.dueAt
        ? new Date(body.dueAt)
        : task.dueAt;

    const updated =
      await prisma.businessWorkflowTask.update({
        where: {
          id: task.id,
        },
        data: {
          status,
          priority,
          dueAt,

          title:
            typeof body.title === "string"
              ? body.title.trim() || task.title
              : task.title,

          description:
            typeof body.description === "string"
              ? body.description.trim() || null
              : task.description,

          assigneeName:
            typeof body.assigneeName === "string"
              ? body.assigneeName.trim() || null
              : task.assigneeName,

          notes:
            typeof body.notes === "string"
              ? body.notes.trim() || null
              : task.notes,

          completedAt:
            status === "DONE"
              ? task.completedAt || new Date()
              : null,
        },
      });

    return NextResponse.json({
      ok: true,
      task: updated,
    });
  } catch (error) {
    console.error(
      "BUSINESS TASK UPDATE ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Aufgabe konnte nicht aktualisiert werden.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const task =
      await prisma.businessWorkflowTask.findFirst({
        where: {
          id,
          providerId: user.id,
        },
      });

    if (!task) {
      return NextResponse.json(
        { error: "Aufgabe nicht gefunden." },
        { status: 404 }
      );
    }

    await prisma.businessWorkflowTask.delete({
      where: {
        id: task.id,
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "BUSINESS TASK DELETE ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Aufgabe konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}
