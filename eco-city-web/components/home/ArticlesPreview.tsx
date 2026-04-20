import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  cover: "rose" | "sage" | "lavender";
};

const articles: Article[] = [
  {
    slug: "5-dicas-separacao",
    title: "5 dicas para uma melhor separação de resíduos em casa",
    excerpt:
      "Aprenda a separar o lixo doméstico para maximizar a reciclagem e reduzir o impacto ambiental.",
    date: "03 de Julho, 2025",
    tag: "Reciclagem",
    cover: "rose",
  },
  {
    slug: "compostagem-domestica",
    title: "Compostagem doméstica: um guia para iniciantes",
    excerpt:
      "Descubra como iniciar seu próprio sistema de compostagem em casa.",
    date: "28 de Maio, 2025",
    tag: "Compostagem",
    cover: "sage",
  },
  {
    slug: "descarte-eletronico",
    title: "Descarte adequado de resíduos eletrônicos",
    excerpt:
      "Saiba mais sobre a importância do descarte adequado de lixo eletrônico.",
    date: "15 de Maio, 2025",
    tag: "Resíduo eletrônico",
    cover: "lavender",
  },
];

const coverMap: Record<Article["cover"], string> = {
  rose: "bg-pastel-rose",
  sage: "bg-pastel-sage",
  lavender: "bg-pastel-lavender",
};

export function ArticlesPreview() {
  return (
    <section className="py-16">
      <Container size="xl">
        <h2 className="mb-6 text-[22px] font-bold text-ink">Últimos Artigos</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <Card key={a.slug} className="flex flex-col overflow-hidden">
              <div
                className={`h-44 ${coverMap[a.cover]}`}
                aria-hidden="true"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3">
                  <Badge tone="brand">{a.tag}</Badge>
                  <span className="text-[12px] text-ink-mute">{a.date}</span>
                </div>
                <h3 className="mt-3 text-[15px] font-semibold leading-snug text-ink">
                  {a.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  {a.excerpt}
                </p>
                <Link
                  href={`/blog/${a.slug}`}
                  className="mt-4 text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700"
                >
                  Leia mais →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
