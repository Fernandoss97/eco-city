"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { WasteType } from "@/lib/api";
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
  reciclavel: "bg-waste-recyclable",
  organico: "bg-waste-organic",
  rejeito: "bg-waste-rejeito",
  especial: "bg-waste-special",
};

const wasteDescription: Record<WasteType, string> = {
  reciclavel: "Papel, papelão, plástico, metal e vidro",
  organico: "Restos de comida, resíduos de jardim e itens compostáveis",
  rejeito: "Resíduos gerais que não podem ser reciclados ou compostados",
  especial: "Eletroeletrônicos, pilhas, lâmpadas e itens volumosos",
};

function formatCep(cep: string): string {
  return cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep;
}

type Props = {
  state: FinderState;
  onSearch: (cep: string) => void;
};

export function ScheduleFinder({ state, onSearch }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
  };

  const isInvalid = state.kind === "error";

  return (
    <Card className="p-7">
      <h3 className="text-[16px] font-semibold text-ink">
        Encontre o seu cronograma de coleta
      </h3>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="cep"
          className="mt-5 block text-[13px] font-medium text-[#D97706]"
        >
          Digite seu CEP
        </label>
        <div className="mt-2 flex gap-3">
          <Input
            id="cep"
            name="cep"
            placeholder="86300-000"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            invalid={isInvalid}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={9}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="shrink-0"
            disabled={state.kind === "loading"}
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
            Cronograma de Coleta para:{" "}
            <span className="text-ink">
              {state.cepLookup.logradouro || "—"}
              {state.cepLookup.neighborhood?.name &&
                ` · ${state.cepLookup.neighborhood.name}`}{" "}
              ({formatCep(state.cepLookup.cep)})
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
                    className={`size-10 shrink-0 rounded-full ${dotColor[item.waste_type]}`}
                  />
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

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Button variant="primary" disabled>
              Definir lembretes
            </Button>
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
          Digite o CEP para visualizar o cronograma de coleta da sua região.
        </p>
      )}
    </Card>
  );
}
