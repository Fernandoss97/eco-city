import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const materials = [
  "Papel e papelão",
  "Vidro",
  "Plástico",
  "Metal",
  "Eletrônicos",
  "Baterias",
  "Têxteis",
];

const hours = [
  { id: "agora", label: "Aberto Agora" },
  { id: "fds", label: "Fim de semana" },
  { id: "h24", label: "Aberto 24/7" },
];

export function FiltersSidebar() {
  return (
    <Card className="p-5">
      <fieldset>
        <legend className="text-[13px] font-semibold text-ink">
          Filtrar por material
        </legend>
        <ul className="mt-3 space-y-2">
          {materials.map((m) => (
            <li key={m} className="flex items-center gap-2">
              <input
                id={`mat-${m}`}
                type="checkbox"
                className="size-4 accent-brand-500"
              />
              <label
                htmlFor={`mat-${m}`}
                className="text-[13px] text-ink-soft"
              >
                {m}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-[13px] font-semibold text-ink">
          Distância
        </legend>
        <input
          type="range"
          min={0}
          max={20}
          defaultValue={5}
          className="mt-3 w-full accent-brand-500"
          aria-label="Distância em quilômetros"
        />
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-[13px] font-semibold text-ink">Horário</legend>
        <ul className="mt-3 space-y-2">
          {hours.map((h) => (
            <li key={h.id} className="flex items-center gap-2">
              <input
                id={`hr-${h.id}`}
                type="radio"
                name="hr"
                className="size-4 accent-brand-500"
              />
              <label
                htmlFor={`hr-${h.id}`}
                className="text-[13px] text-ink-soft"
              >
                {h.label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <Button variant="primary" className="mt-6 w-full">
        Aplicar filtros
      </Button>
    </Card>
  );
}
