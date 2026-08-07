export function stableIndex(seed: string, length: number): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return length ? hash % length : 0;
}

export function choose<T>(
  seed: string,
  values: readonly T[],
): T {
  if (values.length === 0) {
    throw new Error("SEO_VARIATION_VALUES_EMPTY");
  }

  return values[stableIndex(seed, values.length)];
}

export function chooseMany<T>(
  seed: string,
  values: readonly T[],
  amount: number,
): T[] {
  if (values.length === 0 || amount <= 0) {
    return [];
  }

  const wanted = Math.min(amount, values.length);

  return [...values]
    .map((value, index) => ({
      value,
      weight: stableIndex(`${seed}-${index}`, 1_000_000),
    }))
    .sort((a, b) => a.weight - b.weight)
    .slice(0, wanted)
    .map((entry) => entry.value);
}
