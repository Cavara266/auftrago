"use client";

type OpenLeadButtonProps = {
  leadId: string;
};

export default function OpenLeadButton({
  leadId,
}: OpenLeadButtonProps) {
  function openLead() {
    const target = `/leads/${encodeURIComponent(leadId)}`;
    window.location.href = target;
  }

  return (
    <button
      type="button"
      onClick={openLead}
      className="relative z-20 inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-white transition hover:bg-white/[0.12]"
      aria-label="Lead-Details öffnen"
    >
      Details →
    </button>
  );
}