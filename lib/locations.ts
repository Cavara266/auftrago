export type Location = {
  kanton: string; // z.B. "zuerich"
  city: string;   // z.B. "zuerich"
  label: string;  // z.B. "Zürich"
};

export const locations: Location[] = [
  { kanton: "zuerich", city: "zuerich", label: "Zürich" },
  { kanton: "aargau", city: "baden", label: "Baden" },
  { kanton: "aargau", city: "wettingen", label: "Wettingen" },
];