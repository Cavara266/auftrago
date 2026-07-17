"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type NotificationLead = {
  id: string;
  title: string;
  region: string;
  category: string;
  price: number;
  createdAt: string;
};

type Props = {
  initialLeads: NotificationLead[];
};

const STORAGE_KEY = "auftrago-known-lead-ids";

function getStoredIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function relativeTime(createdAt: string) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
  );

  if (minutes < 1) return "Gerade eingetroffen";
  if (minutes < 60) return `Vor ${minutes} Min.`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Vor ${hours} Std.`;

  return `Vor ${Math.floor(hours / 24)} Tagen`;
}

export default function ProviderNotificationBell({
  initialLeads,
}: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [unreadIds, setUnreadIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const storedIds = getStoredIds();

    if (storedIds.length === 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialLeads.map((lead) => lead.id))
      );

      return;
    }

    const knownIds = new Set(storedIds);

    setUnreadIds(
      initialLeads
        .filter((lead) => !knownIds.has(lead.id))
        .map((lead) => lead.id)
    );
  }, [initialLeads]);

  const refreshNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/provider/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        setConnected(false);
        return;
      }

      const data = (await response.json()) as {
        leads: NotificationLead[];
      };

      const storedIds = getStoredIds();
      const knownIds = new Set(storedIds);

      const newIds = data.leads
        .filter((lead) => !knownIds.has(lead.id))
        .map((lead) => lead.id);

      if (newIds.length > 0) {
        setUnreadIds((current) => [
          ...new Set([...newIds, ...current]),
        ]);
      }

      const nextStoredIds = [
        ...new Set([
          ...data.leads.map((lead) => lead.id),
          ...storedIds,
        ]),
      ].slice(0, 100);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextStoredIds)
      );

      setLeads(data.leads);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(
      refreshNotifications,
      8000
    );

    return () => window.clearInterval(interval);
  }, [refreshNotifications]);

  function toggleNotifications() {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen) {
      setUnreadIds([]);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleNotifications}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl shadow-lg transition hover:-translate-y-0.5 hover:bg-white/10"
        aria-label="Benachrichtigungen"
      >
        🔔

        {unreadIds.length > 0 ? (
          <span className="absolute -right-2 -top-2 flex min-h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#0d1c34] bg-red-500 px-1 text-[11px] font-black text-white">
            {unreadIds.length > 99
              ? "99+"
              : unreadIds.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Benachrichtigungen schliessen"
          />

          <section className="absolute right-0 z-50 mt-3 w-[min(390px,calc(100vw-32px))] overflow-hidden rounded-[26px] border border-white/10 bg-[#081326] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-200/65">
                  Live Center
                </div>

                <h2 className="mt-1 text-lg font-bold">
                  Neue Kundenanfragen
                </h2>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-black ${
                  connected
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                }`}
              >
                {connected ? "● LIVE" : "● OFFLINE"}
              </span>
            </header>

            <div className="max-h-[500px] space-y-2 overflow-y-auto p-3">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl border border-white/5 bg-white/[0.035] p-4 transition hover:border-sky-300/25 hover:bg-white/[0.07]"
                >
                  <div className="truncate text-sm font-bold">
                    🔥 {lead.title}
                  </div>

                  <div className="mt-2 text-xs text-white/45">
                    📍 {lead.region} · {lead.category}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-sky-200/65">
                      {relativeTime(lead.createdAt)}
                    </span>

                    <span className="rounded-full bg-yellow-400/10 px-2.5 py-1 text-[10px] font-black text-yellow-200">
                      {lead.price} Credits
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <footer className="border-t border-white/10 p-3">
              <Link
                href="/leads"
                className="flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-sm font-black"
              >
                Alle Leads ansehen →
              </Link>
            </footer>
          </section>
        </>
      ) : null}
    </div>
  );
}