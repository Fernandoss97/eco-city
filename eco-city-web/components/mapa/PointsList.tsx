import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

type Point = {
  name: string;
  address: string;
  hours: string;
  distance: string;
  materials: string[];
};

const points: Point[] = [
  {
    name: "Centro de Reciclagem Central",
    address: "Rua Alegrete, 1001",
    hours: "Aberto: 08h - 18h",
    distance: "1,3 km de distância",
    materials: ["Papel", "Vidro", "Plástico", "Metal"],
  },
  {
    name: "Depósito de Reciclagem",
    address: "Rua Primavera, 1357",
    hours: "Aberto: 09h - 19h",
    distance: "1,5 km de distância",
    materials: ["Papel", "Plástico", "Metal"],
  },
  {
    name: "Ponto de Coleta",
    address: "Rua Alegrete, 1003",
    hours: "Aberto: 08h - 18h",
    distance: "1,2 km de distância",
    materials: ["Papel", "Plástico", "Baterias"],
  },
];

const pages = [1, 2, 3, "…", 8] as const;

export function PointsList() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[16px] font-semibold text-ink">
          12 Pontos de Coleta Encontrados
        </h3>
        <label className="flex items-center gap-2 text-[13px] text-ink-soft">
          Ordenar por:
          <select className="h-8 rounded-md border border-line bg-surface px-2 text-[13px] text-ink focus-visible:border-brand-500 focus-visible:outline-none">
            <option>Distância</option>
            <option>Nome</option>
          </select>
        </label>
      </div>

      <ul className="space-y-4">
        {points.map((p) => (
          <li key={p.name}>
            <Card className="flex items-start gap-4 p-5">
              <span
                aria-hidden="true"
                className="size-12 shrink-0 rounded-full bg-brand-100"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-ink">
                  {p.name}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-mute">
                  {p.address}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.materials.map((m) => (
                    <Badge key={m} tone="neutral">
                      {m}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 text-[12px] text-ink-soft">
                  <span>{p.hours}</span>
                  <span>{p.distance}</span>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <nav
        aria-label="Paginação de pontos"
        className="mt-6 flex items-center justify-center gap-2"
      >
        <button className="h-8 rounded-md border border-line bg-surface px-3 text-[13px] text-ink-soft hover:bg-line-soft">
          Anterior
        </button>
        {pages.map((p, i) => {
          const isActive = p === 1;
          const isEllipsis = p === "…";
          return (
            <button
              key={i}
              disabled={isEllipsis}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "h-8 min-w-8 rounded-md border px-2 text-[13px]",
                isActive
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-line bg-surface text-ink-soft hover:bg-line-soft",
                isEllipsis && "cursor-default border-transparent bg-transparent",
              )}
            >
              {p}
            </button>
          );
        })}
        <button className="h-8 rounded-md border border-line bg-surface px-3 text-[13px] text-ink-soft hover:bg-line-soft">
          Próximo
        </button>
      </nav>
    </div>
  );
}
