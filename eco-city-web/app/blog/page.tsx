import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBand } from "@/components/layout/HeroBand";
import { Container } from "@/components/ui/Container";
import { fetchArticles, type Article } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dicas, novidades e informações sobre reciclagem e sustentabilidade em Cornélio Procópio.",
};

function ArticleCard({ article }: { article: Article }) {
  const date = new Date(article.published_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-lg border border-line bg-surface p-5 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mb-2 text-[15px] font-semibold text-ink transition-colors group-hover:text-brand-600 leading-snug">
        {article.title}
      </h2>
      <p className="mb-4 flex-1 text-[13px] text-ink-soft leading-relaxed">
        {article.excerpt}
      </p>
      <span className="text-[12px] text-ink-mute">{date}</span>
    </Link>
  );
}

export default async function BlogPage() {
  let articles: Article[] = [];
  let error = false;

  try {
    const res = await fetchArticles({ per_page: 12 });
    articles = res.data;
  } catch {
    error = true;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBand
          title="Blog"
          subtitle="Dicas, novidades e informações sobre reciclagem e sustentabilidade."
        />
        <Container size="xl">
          <section className="py-10">
            {error && (
              <p className="text-center text-[14px] text-ink-soft">
                Não foi possível carregar os artigos. Tente novamente mais tarde.
              </p>
            )}

            {!error && articles.length === 0 && (
              <p className="text-center text-[14px] text-ink-soft">
                Nenhum artigo publicado ainda.
              </p>
            )}

            {articles.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
