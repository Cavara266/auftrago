"use client";

import type { FormEvent } from "react";
import { useFormStatus } from "react-dom";

import { deleteLeadAction } from "./actions";

type DeleteLeadButtonProps = {
  leadId: string;
  label?: string;
  className?: string;
};

function SubmitButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      style={
        className
          ? undefined
          : {
              width: "100%",
              padding: "15px",
              borderRadius: 16,
              border: "1px solid rgba(239,68,68,0.35)",
              background: "linear-gradient(135deg,#dc2626,#ef4444)",
              color: "#ffffff",
              fontWeight: 900,
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.6 : 1,
            }
      }
    >
      {pending ? "Lead wird gelöscht ..." : label}
    </button>
  );
}

export default function DeleteLeadButton({
  leadId,
  label = "🗑 Lead endgültig löschen",
  className,
}: DeleteLeadButtonProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      "Möchtest du diesen Lead wirklich endgültig löschen?\n\nAlle zugehörigen Käufe werden ebenfalls gelöscht. Dieser Vorgang kann nicht rückgängig gemacht werden."
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteLeadAction} onSubmit={handleSubmit}>
      <input type="hidden" name="leadId" value={leadId} />
      <SubmitButton label={label} className={className} />
    </form>
  );
}
