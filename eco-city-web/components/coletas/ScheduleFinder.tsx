"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Neighborhood, WasteType } from "@/lib/api";
import type { FinderState } from "./ColetasClient";

const WEEKDAY_LABEL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const dotColor: Record<WasteType, string> = {
  convencional: "bg-waste-convencional",
  seletiva: "bg-waste-seletiva",
  especial: "bg-waste-especial",
};

const dotIcon: Record<WasteType, React.ReactNode> = {
  convencional: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  ),
  seletiva: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  ),
  especial: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

const wasteDescription: Record<WasteType, string> = {
  convencional: "Lixo doméstico geral e resíduos não recicláveis",
  seletiva: "Papel, papelão, plástico, metal e vidro",
  especial: "Eletroeletrônicos, pilhas, lâmpadas e itens volumosos",
};

type Props = {
  state: FinderState;
  neighborhoods: Neighborhood[];
  onSearch: (neighborhoodId: number) => void;
};

export function ScheduleFinder({ state, neighborhoods, onSearch }: Props) {
  const [selected, setSelected] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) onSearch(Number(selected));
  };

  return (
    <Card className="p-7">
      <h3 className="text-[16px] font-semibold text-ink">
        Encontre o seu cronograma de coleta
      </h3>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="neighborhood"
          className="mt-5 block text-[13px] font-medium text-ink-soft"
        >
          Selecione seu bairro
        </label>
        <div className="mt-2 flex gap-3">
          <select
            id="neighborhood"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 rounded-md border border-line bg-surface px-3 py-2 text-[14px] text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:opacity-50"
            disabled={neighborhoods.length === 0}
          >
            <option value="">
              {neighborhoods.length === 0 ? "Carregando bairros…" : "Selecione um bairro"}
            </option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="shrink-0"
            disabled={!selected || state.kind === "loading"}
          >
            {state.kind === "loading" ? "Buscando…" : "Pesquisar"}
          </Button>
        </div>
      </form>

      {state.kind === "error" && (
        <p className="mt-3 text-[13px] text-danger" role="alert">
          {state.message}
        </p>
      )}

      {state.kind === "ready" && (
        <>
          <p className="mt-5 text-[13px] text-ink-soft">
            Cronograma de coleta para:{" "}
            <span className="font-medium text-ink">
              {state.neighborhood.name} — {state.neighborhood.city}
            </span>
          </p>

          {state.weekly.length === 0 ? (
            <p className="mt-4 rounded-md border border-line bg-surface-alt p-4 text-[13px] text-ink-soft">
              Nenhum cronograma cadastrado para este bairro ainda.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line-soft">
              {state.weekly.map((item) => (
                <li
                  key={`${item.waste_type}-${item.weekday}-${item.start_time}`}
                  className="flex items-center gap-4 py-4"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${dotColor[item.waste_type]}`}
                  >
                    {dotIcon[item.waste_type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-ink">
                      {item.waste_type_label}
                    </div>
                    <div className="text-[12px] text-ink-mute">
                      {wasteDescription[item.waste_type]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-medium text-ink">
                      Toda {WEEKDAY_LABEL[item.weekday].toLowerCase()}
                    </div>
                    <div className="text-[12px] text-ink-mute">
                      {item.start_time} - {item.end_time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Button variant="secondary" disabled>
              Adicionar ao calendário
            </Button>
            <Button variant="secondary" disabled>
              Imprimir programação
            </Button>
          </div>
        </>
      )}

      {state.kind === "idle" && (
        <p className="mt-5 text-[13px] text-ink-soft">
          Selecione um bairro para visualizar o cronograma de coleta da sua região.
        </p>
      )}
    </Card>
  );
}
