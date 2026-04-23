export const MATERIAL_OPTIONS = [
  { id: "papel", label: "Papel e papelão" },
  { id: "vidro", label: "Vidro" },
  { id: "plastico", label: "Plástico" },
  { id: "metal", label: "Metal" },
  { id: "eletronico", label: "Eletrônicos" },
  { id: "pilha_bateria", label: "Pilhas e baterias" },
] as const;

export const MATERIAL_LABEL: Record<string, string> = Object.fromEntries(
  MATERIAL_OPTIONS.map((m) => [m.id, m.label]),
);
