"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
    >
      {pending
        ? "Speichert..."
        : "Speichern"}
    </button>
  );
}
