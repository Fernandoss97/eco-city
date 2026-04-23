import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type DayPill = {
  label: string;
  color: "recyclable" | "organic" | "rejeito" | "bulky";
};

type Day = {
  date: number | null;
  pills?: DayPill[];
  highlight?: boolean;
};

const pillColor: Record<DayPill["color"], string> = {
  recyclable: "bg-[#DCFCE7] text-[#166534]",
  organic: "bg-[#F3E0CC] text-[#7C4A1E]",
  rejeito: "bg-[#E5E7EB] text-[#4B5563]",
  bulky: "bg-[#FEF3C7] text-[#854D0E]",
};

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const days: Day[] = [
  // semana 1
  { date: null }, { date: null }, { date: null },
  { date: null }, { date: null }, { date: null },
  { date: 1 },
  // semana 2
  { date: 2, pills: [{ label: "Resíduos Gerais", color: "rejeito" }] },
  { date: 3, pills: [{ label: "Resíduos Recicláveis", color: "recyclable" }] },
  { date: 4 },
  { date: 5 },
  { date: 6 },
  { date: 7 },
  { date: 8, highlight: true },
  // semana 3
  { date: 9, pills: [{ label: "Resíduos Gerais", color: "rejeito" }] },
  { date: 10 },
  { date: 11, pills: [{ label: "Resíduos Recicláveis", color: "recyclable" }] },
  { date: 12 },
  { date: 13 },
  { date: 14 },
  { date: 15 },
  // semana 4
  { date: 16, pills: [{ label: "Resíduos Gerais", color: "rejeito" }] },
  { date: 17 },
  { date: 18 },
  { date: 19 },
  { date: 20 },
  { date: 21 },
  { date: 22 },
];

const legend: { label: string; color: DayPill["color"] }[] = [
  { label: "Resíduos Recicláveis", color: "recyclable" },
  { label: "Resíduos Orgânicos", color: "organic" },
  { label: "Resíduos não-Gerais", color: "rejeito" },
  { label: "Itens Volumosos", color: "bulky" },
];

export function MonthlyCalendar() {
  return (
    <Card className="p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" aria-label="Mês anterior">
            &lt;
          </Button>
          <span className="px-2 text-[14px] font-semibold text-ink">
            Junho 2025
          </span>
          <Button variant="secondary" size="sm" aria-label="Próximo mês">
            &gt;
          </Button>
          <Button variant="secondary" size="sm" className="ml-2">
            Hoje
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Mês</Button>
          <Button variant="secondary" size="sm">Semana</Button>
          <Button variant="secondary" size="sm">Dia</Button>
        </div>
      </div>

      <h3 className="mt-5 text-[16px] font-semibold text-ink">
        Calendário de Coleta
      </h3>

      <div className="mt-4 grid grid-cols-7 border-l border-t border-line">
        {weekdays.map((wd) => (
          <div
            key={wd}
            className="border-r border-b border-line bg-surface-alt px-2 py-2 text-center text-[12px] font-medium text-ink-soft"
          >
            {wd}
          </div>
        ))}
        {days.map((d, i) => (
          <div
            key={i}
            className={`min-h-[88px] border-r border-b border-line p-2 align-top ${
              d.highlight ? "bg-brand-50" : "bg-surface"
            }`}
          >
            {d.date !== null && (
              <>
                <div
                  className={`text-[12px] ${
                    d.highlight ? "font-semibold text-brand-700" : "text-ink"
                  }`}
                >
                  {d.date}
                </div>
                {d.pills?.map((p, j) => (
                  <div
                    key={j}
                    className={`mt-1 truncate rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${pillColor[p.color]}`}
                  >
                    {p.label}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`inline-block h-3 w-6 rounded-sm ${pillColor[l.color]}`}
            />
            <span className="text-[12px] text-ink-soft">{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
