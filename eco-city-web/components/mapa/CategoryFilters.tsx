"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { CollectionPointType } from "@/lib/api";

type Category = { label: string; value: CollectionPointType | null };

const categories: Category[] = [
  { label: "Todos", value: null },
  { label: "Pontos de reciclagem", value: "reciclagem" },
  { label: "Resíduos especiais", value: "especial" },
];

type Props = {
  activeType: CollectionPointType | null;
  onChange: (type: CollectionPointType | null) => void;
};

export function CategoryFilters({ activeType, onChange }: Props) {
  return (
    <Card className="p-4">
      <ul className="flex flex-wrap gap-3">
        {categories.map((c) => {
          const isActive = c.value === activeType;
          return (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => onChange(c.value)}
                aria-pressed={isActive}
                className={cn(
                  "h-9 rounded-full px-4 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "border border-brand-500 bg-surface text-brand-600 hover:bg-brand-50",
                )}
              >
                {c.label}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
