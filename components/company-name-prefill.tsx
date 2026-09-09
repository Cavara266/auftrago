"use client";

import { useEffect } from "react";

export default function CompanyNamePrefill() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyName = params.get("firma")?.trim();

    if (!companyName) return;

    const input = document.querySelector<HTMLInputElement>(
      'input[name="firma"]'
    );

    if (!input || input.value.trim()) return;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set;

    nativeSetter?.call(input, companyName);

    input.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true,
      })
    );
  }, []);

  return null;
}
