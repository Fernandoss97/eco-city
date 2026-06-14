import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchArticles } from "@/lib/api";

const coverColors = [
  "bg-pastel-rose",
  "bg-pastel-sage",
  "bg-pastel-lavender",
];

export async function ArticlesPreview() {
  let articles: Awaited<ReturnType<typeof fetchArticles>>["data"] = [];

  try {
    const res = await fetchArticles({ per_page: 3 });
    articles = res.data;
  } catch {
    return null;
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-16">
      <Container size="xl">
        <h2 className="mb-6 text-[22px] font-bold text-ink">Últimos Artigos</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((a, i) => {
            const date = new Date(a.published_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            return (
              <Card key={a.slug} className="flex flex-col overflow-hidden">
                <div
                  className={`flex h-44 items-center justify-center ${coverColors[i % coverColors.length]}`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-12 text-brand-400/60"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3">
                    {a.tags[0] && <Badge tone="brand">{a.tags[0]}</Badge>}
                    <span className="text-[12px] text-ink-mute">{date}</span>
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
            );
          })}
        </div>
      </Container>
    </section>
  );
}
