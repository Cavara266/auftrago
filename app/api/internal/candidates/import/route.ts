import { NextResponse } from "next/server";
import {
  importCandidates,
  type CandidateImportInput,
} from "@/lib/candidates/import";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const configuredSecret =
    process.env.CANDIDATE_IMPORT_SECRET;

  if (!configuredSecret) {
    return NextResponse.json(
      {
        error:
          "CANDIDATE_IMPORT_SECRET ist nicht konfiguriert.",
      },
      {
        status: 503,
      }
    );
  }

  const suppliedSecret =
    request.headers.get("x-import-secret");

  if (suppliedSecret !== configuredSecret) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = (await request.json()) as {
      candidates?: CandidateImportInput[];
    };

    if (!Array.isArray(body.candidates)) {
      return NextResponse.json(
        {
          error:
            "Body muss candidates[] enthalten.",
        },
        {
          status: 400,
        }
      );
    }

    if (body.candidates.length > 500) {
      return NextResponse.json(
        {
          error:
            "Maximal 500 Kandidaten pro Import.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await importCandidates(
      body.candidates
    );

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Candidate import failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Import fehlgeschlagen.",
      },
      {
        status: 500,
      }
    );
  }
}
