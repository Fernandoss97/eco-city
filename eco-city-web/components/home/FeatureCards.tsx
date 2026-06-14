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
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="flex flex-col items-center p-8 text-center"
            >
              <div
                className="flex size-16 items-center justify-center rounded-full bg-brand-100"
                aria-hidden="true"
              >
                <svg
                  className="size-7 text-brand-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
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
