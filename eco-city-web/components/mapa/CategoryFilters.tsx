import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Category = { label: string; active?: boolean };

const categories: Category[] = [
  { label: "Pontos de reciclagem", active: true },
  { label: "Resíduos Especiais" },
  { label: "Resíduos Orgânicos" },
  { label: "Resíduos em Geral" },
];

export function CategoryFilters() {
  return (
    <Card className="p-4">
      <ul className="flex flex-wrap gap-3">
        {categories.map((c) => (
          <li key={c.label}>
            <button
              type="button"
              className={cn(
                "h-9 rounded-full px-4 text-[13px] font-medium transition-colors",
                c.active
                  ? "bg-brand-500 text-white hover:bg-brand-600"
                  : "border border-brand-500 bg-surface text-brand-600 hover:bg-brand-50",
              )}
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
