import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Pin = { top: string; left: string; emphasis?: boolean };

const pins: Pin[] = [
  { top: "22%", left: "12%" },
  { top: "30%", left: "44%", emphasis: true },
  { top: "48%", left: "28%" },
  { top: "58%", left: "62%" },
  { top: "70%", left: "20%" },
  { top: "38%", left: "78%" },
  { top: "20%", left: "82%" },
];

export function MapPlaceholder() {
  return (
    <div>
      <Card className="overflow-hidden p-0">
        <div
          className="relative h-[360px] w-full"
          style={{
            background:
              "repeating-linear-gradient(0deg, #EEF1EE 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, #EEF1EE 0 1px, transparent 1px 28px), linear-gradient(180deg, #F2F4F0 0%, #ECEFE8 100%)",
          }}
          role="img"
          aria-label="Mapa interativo (visualização provisória)"
        >
          {/* faux park blocks */}
          <span
            aria-hidden="true"
            className="absolute left-[6%] top-[58%] h-16 w-24 rounded-md bg-[#CDE5C0]"
          />
          <span
            aria-hidden="true"
            className="absolute right-[8%] top-[18%] h-12 w-20 rounded-md bg-[#CDE5C0]"
          />

          {/* faux roads */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 h-[3px] bg-white/70"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-1/3 top-0 w-[3px] bg-white/70"
          />

          {/* pins */}
          {pins.map((p, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={
                p.emphasis
                  ? "absolute -translate-x-1/2 -translate-y-full"
                  : "absolute -translate-x-1/2 -translate-y-full"
              }
              style={{ top: p.top, left: p.left }}
            >
              <svg
                width={p.emphasis ? 28 : 22}
                height={p.emphasis ? 36 : 28}
                viewBox="0 0 24 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.4 18.6 0 12 0Z"
                  fill={p.emphasis ? "#16A34A" : "#22C55E"}
                />
                <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
              </svg>
            </span>
          ))}

          {/* popup */}
          <div
            className="absolute left-[44%] top-[30%] w-[260px] -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg border border-line bg-surface p-4 shadow-card"
            role="dialog"
            aria-label="Centro de Reciclagem Central"
          >
            <div className="text-[14px] font-semibold text-ink">
              Centro de Reciclagem Central
            </div>
            <div className="mt-1 text-[12px] text-ink-soft">
              Rua Alegrete, 1001
            </div>
            <div className="mt-1 text-[12px] text-ink-soft">
              Distância: 1,3 km
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="neutral">Papel</Badge>
              <Badge tone="neutral">Vidro</Badge>
              <Badge tone="neutral">Plástico</Badge>
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-line bg-surface"
            />
          </div>
        </div>
      </Card>
      <p className="mt-3 text-[12px] text-ink-mute">
        4 pontos de reciclagem encontrados no seu bairro
      </p>
    </div>
  );
}
