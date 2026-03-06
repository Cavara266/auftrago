"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("demo@auftrago.local");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.error || "Login fehlgeschlagen.");
        setLoading(false);
        return;
      }

      window.location.href = data.redirectTo || "/dashboard";
    } catch (err) {
      setError("Serverfehler.");
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-white/70">E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-indigo-400/60"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">Passwort</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-indigo-400/60"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
      >
        {loading ? "Einloggen..." : "Einloggen"}
      </button>

      <div className="text-xs text-white/45">
        Demo Zugang: demo@auftrago.local / demo1234
      </div>
    </form>
  );
}