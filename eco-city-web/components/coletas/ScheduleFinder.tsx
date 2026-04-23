import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type WasteType = "reciclavel" | "organico" | "rejeito" | "volumoso";

type ScheduleItem = {
  type: WasteType;
  title: string;
  description: string;
  cadence: string;
  window: string;
};

const dotColor: Record<WasteType, string> = {
  reciclavel: "bg-waste-recyclable",
  organico: "bg-waste-organic",
  rejeito: "bg-waste-rejeito",
  volumoso: "bg-waste-bulky",
};

const items: ScheduleItem[] = [
  {
    type: "reciclavel",
    title: "Resíduos Recicláveis",
    description: "Papel, papelão, plástico, metal e vidro",
    cadence: "Toda segunda-feira",
    window: "08:00 - 12:00",
  },
  {
    type: "organico",
    title: "Resíduos Orgânicos",
    description: "Restos de comida, resíduos de jardim e itens compostáveis",
    cadence: "Toda quarta-feira",
    window: "07:00 - 11:00",
  },
  {
    type: "rejeito",
    title: "Resíduos não recicláveis",
    description: "Resíduos gerais que não podem ser reciclados ou compostados",
    cadence: "Toda terça-feira",
    window: "08:00 - 12:00",
  },
  {
    type: "volumoso",
    title: "Itens volumosos",
    description: "Móveis grandes, eletrodomésticos e outros resíduos volumosos",
    cadence: "Primeiro sábado do mês",
    window: "09:00 - 15:00",
  },
];

export function ScheduleFinder() {
  return (
    <Card className="p-7">
      <h3 className="text-[16px] font-semibold text-ink">
        Encontre o seu cronograma de coleta
      </h3>

      <label
        htmlFor="cep-bairro"
        className="mt-5 block text-[13px] font-medium text-[#D97706]"
      >
        Digite seu bairro ou CEP
      </label>
      <div className="mt-2 flex gap-3">
        <Input
          id="cep-bairro"
          name="cep-bairro"
          placeholder="Rua 15 de Novembro"
          defaultValue=""
        />
        <Button variant="primary" size="md" className="shrink-0">
          Pesquisar
        </Button>
      </div>

      <p className="mt-5 text-[13px] text-ink-soft">
        Cronograma de Coleta para: <span className="text-ink">Rua 15 de Novembro</span>
      </p>

      <ul className="mt-4 divide-y divide-line-soft">
        {items.map((item) => (
          <li key={item.type} className="flex items-center gap-4 py-4">
            <span
              aria-hidden="true"
              className={`size-10 shrink-0 rounded-full ${dotColor[item.type]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-ink">{item.title}</div>
              <div className="text-[12px] text-ink-mute">{item.description}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-medium text-ink">{item.cadence}</div>
              <div className="text-[12px] text-ink-mute">{item.window}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Button variant="primary">Definir lembretes</Button>
        <Button variant="secondary">Adicionar ao calendário</Button>
        <Button variant="secondary">Imprimir programação</Button>
      </div>
    </Card>
  );
}
