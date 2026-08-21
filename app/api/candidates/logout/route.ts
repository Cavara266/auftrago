import { NextResponse } from "next/server";

import { clearCandidateSession } from "@/lib/candidate-auth";

export async function POST(request: Request) {
  await clearCandidateSession();

  return NextResponse.redirect(new URL("/arbeit-suchen/login", request.url));
}
