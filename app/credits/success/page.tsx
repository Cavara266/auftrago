import { Suspense } from "react";
import CreditsSuccessClient from "./success-client";

type CreditsSuccessPageProps = {
  searchParams?: {
    session_id?: string;
  };
};

export default function CreditsSuccessPage({
  searchParams,
}: CreditsSuccessPageProps) {
  const sessionId = searchParams?.session_id ?? "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[460px] w-[460px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-20">

        <Suspense
          fallback={
            <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">

              <h1 className="text-3xl font-semibold sm:text-4xl">
                Zahlung wird verarbeitet
              </h1>

              <p className="mt-4 text-base text-white/65 sm:text-lg">
                Bitte kurz warten, wir bestätigen deine Zahlung und schreiben die Credits gut.
              </p>

              <div className="mt-8 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-[#7EC8FF]" />
              </div>

            </div>
          }
        >
          <CreditsSuccessClient sessionId={sessionId} />
        </Suspense>

      </div>
    </main>
  );
}