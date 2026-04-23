"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { DayCollections, WasteType } from "@/lib/api";

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const pillColor: Record<WasteType, string> = {
  reciclavel: "bg-[#DCFCE7] text-[#166534]",
  organico: "bg-[#F3E0CC] text-[#7C4A1E]",
  rejeito: "bg-[#E5E7EB] text-[#4B5563]",
  especial: "bg-[#FFEDD5] text-[#9A3412]",
};

const wasteShortLabel: Record<WasteType, string> = {
  reciclavel: "Recicláveis",
  organico: "Orgânicos",
  rejeito: "Rejeitos",
  especial: "Especiais",
};

const legend: { label: string; type: WasteType }[] = [
  { label: "Resíduos Recicláveis", type: "reciclavel" },
  { label: "Resíduos Orgânicos", type: "organico" },
  { label: "Rejeitos", type: "rejeito" },
  { label: "Resíduos Especiais", type: "especial" },
];

type Props = {
  month: string;
  monthLabel: string;
  days: DayCollections[];
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentMonth: boolean;
};

function todayDate(): number {
  return new Date().getDate();
}

export function MonthlyCalendar({
  month,
  monthLabel,
  days,
  loading,
  onPrev,
  onNext,
  onToday,
  isCurrentMonth,
}: Props) {
  // Padding cells before the 1st (so the grid lines up with weekdays).
  const firstDayWeekday = days[0]?.weekday ?? 0;
  const padding = Array.from({ length: firstDayWeekday });
  const today = todayDate();

  return (
    <Card className="p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" aria-label="Mês anterior" onClick={onPrev}>
            &lt;
          </Button>
          <span className="px-2 text-[14px] font-semibold capitalize text-ink">
            {monthLabel}
          </span>
          <Button variant="secondary" size="sm" aria-label="Próximo mês" onClick={onNext}>
            &gt;
          </Button>
          <Button variant="secondary" size="sm" className="ml-2" onClick={onToday}>
            Hoje
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Mês</Button>
          <Button variant="secondary" size="sm" disabled>Semana</Button>
          <Button variant="secondary" size="sm" disabled>Dia</Button>
        </div>
      </div>

      <h3 className="mt-5 text-[16px] font-semibold text-ink">
        Calendário de Coleta
      </h3>

      <div
        className={`mt-4 grid grid-cols-7 border-l border-t border-line ${loading ? "opacity-60" : ""}`}
        aria-busy={loading}
      >
        {weekdays.map((wd) => (
          <div
            key={wd}
            className="border-r border-b border-line bg-surface-alt px-2 py-2 text-center text-[12px] font-medium text-ink-soft"
          >
            {wd}
          </div>
        ))}

        {padding.map((_, i) => (
          <div
            key={`pad-${i}`}
            className="min-h-[88px] border-r border-b border-line bg-surface"
          />
        ))}

        {days.map((d) => {
          const dayNumber = Number(d.date.slice(-2));
          const highlight = isCurrentMonth && dayNumber === today;
          return (
            <div
              key={d.date}
              className={`min-h-[88px] border-r border-b border-line p-2 align-top ${highlight ? "bg-brand-50" : "bg-surface"}`}
            >
              <div
                className={`text-[12px] ${highlight ? "font-semibold text-brand-700" : "text-ink"}`}
              >
                {dayNumber}
              </div>
              {d.collections.map((c) => (
                <div
                  key={c.id}
                  title={`${c.waste_type_label} · ${c.start_time}–${c.end_time}`}
                  className={`mt-1 truncate rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${pillColor[c.waste_type]}`}
                >
                  {wasteShortLabel[c.waste_type]}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {!loading && days.length === 0 && (
        <p className="mt-4 rounded-md border border-line bg-surface-alt p-4 text-center text-[13px] text-ink-soft">
          Pesquise um CEP acima para ver as coletas do mês.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`inline-block h-3 w-6 rounded-sm ${pillColor[l.type]}`}
            />
            <span className="text-[12px] text-ink-soft">{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
