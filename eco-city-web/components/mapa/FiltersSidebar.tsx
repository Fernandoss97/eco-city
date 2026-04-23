"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Neighborhood } from "@/lib/api";
import { MATERIAL_OPTIONS } from "./materials";

type Props = {
  neighborhoods: Neighborhood[];
  initial: { materials: string[]; neighborhoodId: number | null };
  onApply: (next: { materials: string[]; neighborhoodId: number | null }) => void;
};

export function FiltersSidebar({ neighborhoods, initial, onApply }: Props) {
  const [materials, setMaterials] = useState<string[]>(initial.materials);
  const [neighborhoodId, setNeighborhoodId] = useState<number | null>(
    initial.neighborhoodId,
  );

  useEffect(() => {
    setMaterials(initial.materials);
    setNeighborhoodId(initial.neighborhoodId);
  }, [initial.materials, initial.neighborhoodId]);

  const toggleMaterial = (id: string) => {
    setMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  return (
    <Card className="p-5">
      <fieldset>
        <legend className="text-[13px] font-semibold text-ink">
          Filtrar por material
        </legend>
        <ul className="mt-3 space-y-2">
          {MATERIAL_OPTIONS.map((m) => (
            <li key={m.id} className="flex items-center gap-2">
              <input
                id={`mat-${m.id}`}
                type="checkbox"
                checked={materials.includes(m.id)}
                onChange={() => toggleMaterial(m.id)}
                className="size-4 accent-brand-500"
              />
              <label
                htmlFor={`mat-${m.id}`}
                className="text-[13px] text-ink-soft"
              >
                {m.label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-[13px] font-semibold text-ink">Bairro</legend>
        <select
          value={neighborhoodId ?? ""}
          onChange={(e) =>
            setNeighborhoodId(e.target.value ? Number(e.target.value) : null)
          }
          className="mt-3 h-9 w-full rounded-md border border-line bg-surface px-2 text-[13px] text-ink focus-visible:border-brand-500 focus-visible:outline-none"
        >
          <option value="">Todos os bairros</option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </fieldset>

      <Button
        variant="primary"
        className="mt-6 w-full"
        onClick={() => onApply({ materials, neighborhoodId })}
      >
        Aplicar filtros
      </Button>
    </Card>
  );
}
