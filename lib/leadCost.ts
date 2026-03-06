export function leadCost(service: string) {
  const s = (service || "").toLowerCase();

  if (s.includes("reinigung")) return 5;
  if (s.includes("hauswartung")) return 8;
  if (s.includes("umzug")) return 10;

  return 5; // default
}