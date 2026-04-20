import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

type Feature = {
  title: string;
  desc: string;
  cta: string;
  href: string;
};

const features: Feature[] = [
  {
    title: "Calendário de Coleta",
    desc: "Veja o cronograma de coleta no local",
    cta: "Ver Calendário",
    href: "/coletas",
  },
  {
    title: "Pontos de Reciclagem",
    desc: "Encontre pontos de reciclagem",
    cta: "Encontrar Pontos",
    href: "/mapa",
  },
  {
    title: "Notificações",
    desc: "Receba lembretes para os dias de coleta",
    cta: "Definir lembretes",
    href: "/cadastro",
  },
  {
    title: "Suporte",
    desc: "Ajuda com a gestão de resíduos",
    cta: "Fale conosco",
    href: "/contato",
  },
];

export function FeatureCards() {
  return (
    <section className="-mt-16">
      <Container size="xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="flex flex-col items-center p-8 text-center"
            >
              <div
                className="flex size-16 items-center justify-center rounded-full bg-brand-100"
                aria-hidden="true"
              />
              <h3 className="mt-6 text-[16px] font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] text-ink-soft">{f.desc}</p>
              <Link
                href={f.href}
                className="mt-6 text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                {f.cta}
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
