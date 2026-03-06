"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  timeoutMs?: number;
};

type ToastContextValue = {
  push: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = uid();
    const toast: Toast = { id, timeoutMs: 3500, ...t };
    setToasts((prev) => [...prev, toast]);

    const ms = toast.timeoutMs ?? 3500;
    window.setTimeout(() => remove(id), ms);
  }, [remove]);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Container */}
      <div className="fixed right-4 top-4 z-[9999] flex w-[360px] max-w-[92vw] flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "rounded-xl border p-4 shadow-lg backdrop-blur",
              "bg-white/5 border-white/10",
              t.type === "success" ? "ring-1 ring-emerald-500/30" : "",
              t.type === "error" ? "ring-1 ring-red-500/30" : "",
              t.type === "info" ? "ring-1 ring-blue-500/30" : "",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {t.title ? (
                  <div className="text-sm font-semibold text-white">{t.title}</div>
                ) : null}
                <div className="text-sm text-white/80">{t.message}</div>
              </div>

              <button
                onClick={() => remove(t.id)}
                className="text-white/60 hover:text-white transition"
                aria-label="Toast schließen"
              >
                ✕
              </button>
            </div>

            {/* little bar */}
            <div className="mt-3 h-[2px] w-full bg-white/10 overflow-hidden rounded">
              <div
                className={[
                  "h-full w-full origin-left animate-[toastbar_linear]",
                  t.type === "success" ? "bg-emerald-400/70" : "",
                  t.type === "error" ? "bg-red-400/70" : "",
                  t.type === "info" ? "bg-blue-400/70" : "",
                ].join(" ")}
                style={{ animationDuration: `${(t.timeoutMs ?? 3500) / 1000}s` }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes toastbar_linear {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}