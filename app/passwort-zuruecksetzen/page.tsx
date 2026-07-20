import type { Metadata } from "next";
import { Suspense } from "react";

import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Neues Passwort festlegen | Auftrago",
  description:
    "Lege ein neues Passwort für dein Auftrago-Anbieterkonto fest.",
};

export default function ResetPasswordPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 18px",
        background:
          "radial-gradient(circle at top, #1f2937 0%, #111827 38%, #030712 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "34px",
          borderRadius: "22px",
          background: "rgba(255,255,255,0.98)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          color: "#111827",
        }}
      >
        <div
          style={{
            marginBottom: "28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-1px",
              color: "#111827",
            }}
          >
            Auftrago
          </div>

          <h1
            style={{
              margin: "26px 0 10px",
              fontSize: "28px",
              lineHeight: 1.2,
              color: "#111827",
            }}
          >
            Neues Passwort festlegen
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              lineHeight: 1.7,
              fontSize: "15px",
            }}
          >
            Wähle ein sicheres neues Passwort für dein
            Anbieterkonto.
          </p>
        </div>

        <Suspense
          fallback={
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Seite wird geladen...
            </p>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}