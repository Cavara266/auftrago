import { Suspense } from "react";
import AnfrageClient from "./anfrage-client";

export default function AnfragePage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-20%] top-[-10%] h-[260px] w-[260px] rounded-full bg-cyan-400/12 blur-3xl sm:left-[-10%] sm:h-[380px] sm:w-[380px]" />
            <div className="absolute right-[-20%] top-[10%] h-[280px] w-[280px] rounded-full bg-sky-400/10 blur-3xl sm:right-[-10%] sm:h-[420px] sm:w-[420px]" />
            <div className="absolute bottom-[-10%] left-[10%] h-[240px] w-[240px] rounded-full bg-blue-500/10 blur-3xl sm:left-[20%] sm:h-[340px] sm:w-[340px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
          </div>

          <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-20">
            <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur sm:rounded-[34px] sm:p-8 md:p-10">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Anfrageformular wird geladen
              </h1>

              <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                Bitte kurz warten, wir bereiten das Anfrageformular für dich vor.
              </p>

              <div className="mt-8 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-[#7EC8FF]" />
              </div>
            </div>
          </div>
        </main>
      }
    >
      <AnfrageClient />
    </Suspense>
  );
}