"use client";

function CopyBtn({ value }: { value: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(value)}
      className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70 ring-1 ring-white/10 hover:bg-white/10"
    >
      Copy
    </button>
  );
}

export default function ContactCard({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="rounded-2xl bg-emerald-500/10 p-4 ring-1 ring-emerald-500/20">
      <div className="text-sm font-semibold text-emerald-100">Kontakt freigeschaltet</div>

      <div className="mt-3 grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
          <div className="min-w-0">
            <div className="text-xs text-white/55">Name</div>
            <div className="truncate text-white">{name}</div>
          </div>
          <CopyBtn value={name} />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
          <div className="min-w-0">
            <div className="text-xs text-white/55">Telefon</div>
            <div className="truncate text-white">{phone}</div>
          </div>
          <CopyBtn value={phone} />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
          <div className="min-w-0">
            <div className="text-xs text-white/55">E-Mail</div>
            <div className="truncate text-white">{email}</div>
          </div>
          <CopyBtn value={email} />
        </div>
      </div>
    </div>
  );
}