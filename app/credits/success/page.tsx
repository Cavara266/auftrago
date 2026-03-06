import { Suspense } from "react";
import CreditsSuccessClient from "./success-client";

type CreditsSuccessPageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default function CreditsSuccessPage({
  searchParams,
}: CreditsSuccessPageProps) {
  const sessionId = searchParams.session_id ?? "";

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050816] px-6 py-20 text-white">
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
            <h1 className="text-4xl font-semibold">Zahlung wird verarbeitet</h1>
            <p className="mt-4 text-lg text-white/65">Bitte kurz warten ...</p>
          </div>
        </main>
      }
    >
      <CreditsSuccessClient sessionId={sessionId} />
    </Suspense>
  );
}