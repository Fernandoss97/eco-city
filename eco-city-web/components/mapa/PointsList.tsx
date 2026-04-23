"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { CollectionPoint } from "@/lib/api";
import { MATERIAL_LABEL } from "./materials";

type Props = {
  points: CollectionPoint[];
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
};

function buildPageList(current: number, last: number): (number | "…")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const set = new Set<number>([1, last, current, current - 1, current + 1]);
  const pages = [...set].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < pages.length; i++) {
    out.push(pages[i]);
    if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) out.push("…");
  }
  return out;
}

function formatHours(hours: CollectionPoint["hours"]): string {
  if (!hours) return "Horário não informado";
  const entries = Object.entries(hours);
  if (entries.length === 0) return "Horário não informado";
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

export function PointsList({
  points,
  total,
  currentPage,
  lastPage,
  loading,
  error,
  onPageChange,
}: Props) {
  const pages = buildPageList(currentPage, lastPage);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[16px] font-semibold text-ink">
          {loading
            ? "Carregando pontos…"
            : `${total} ${total === 1 ? "Ponto" : "Pontos"} de Coleta encontrados`}
        </h3>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-line bg-surface-alt p-4 text-[13px] text-ink-soft">
          {error}
        </div>
      )}

      {!loading && !error && points.length === 0 && (
        <div className="rounded-md border border-line bg-surface-alt p-6 text-center text-[13px] text-ink-soft">
          Nenhum ponto encontrado para os filtros selecionados.
        </div>
      )}

      <ul className={cn("space-y-4", loading && "opacity-60")} aria-busy={loading}>
        {points.map((p) => (
          <li key={p.id}>
            <Card className="flex items-start gap-4 p-5">
              <span
                aria-hidden="true"
                className={cn(
                  "size-12 shrink-0 rounded-full",
                  p.type === "especial" ? "bg-[#FFEDD5]" : "bg-brand-100",
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-ink">{p.name}</div>
                <div className="mt-0.5 text-[12px] text-ink-mute">{p.address}</div>
                {p.neighborhood && (
                  <div className="mt-0.5 text-[12px] text-ink-mute">
                    {p.neighborhood.name} · {p.neighborhood.city}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.accepted_materials.map((m) => (
                    <Badge key={m} tone="neutral">
                      {MATERIAL_LABEL[m] ?? m}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 text-[12px] text-ink-soft">
                  <span>{formatHours(p.hours)}</span>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {lastPage > 1 && (
        <nav
          aria-label="Paginação de pontos"
          className="mt-6 flex items-center justify-center gap-2"
        >
          <button
            disabled={currentPage <= 1 || loading}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 rounded-md border border-line bg-surface px-3 text-[13px] text-ink-soft hover:bg-line-soft disabled:opacity-40"
          >
            Anterior
          </button>
          {pages.map((p, i) => {
            const isActive = p === currentPage;
            const isEllipsis = p === "…";
            return (
              <button
                key={`${p}-${i}`}
                disabled={isEllipsis || loading}
                onClick={() => !isEllipsis && onPageChange(p as number)}
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
          <button
            disabled={currentPage >= lastPage || loading}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 rounded-md border border-line bg-surface px-3 text-[13px] text-ink-soft hover:bg-line-soft disabled:opacity-40"
          >
            Próximo
          </button>
        </nav>
      )}
    </div>
  );
}
