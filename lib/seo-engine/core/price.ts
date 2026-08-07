export function formatPrice(value: number): string {
  return value.toLocaleString("de-CH");
}

export function formatPriceRange(
  from?: number | null,
  to?: number | null,
): string | null {
  if (
    typeof from !== "number" ||
    typeof to !== "number"
  ) {
    return null;
  }

  return `CHF ${formatPrice(from)} bis CHF ${formatPrice(to)}`;
}
