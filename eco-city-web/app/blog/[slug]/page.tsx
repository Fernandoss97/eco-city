import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { fetchArticle } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { data } = await fetchArticle(slug);
    return { title: data.title, description: data.excerpt };
  } catch {
    return { title: "Artigo não encontrado" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    const res = await fetchArticle(slug);
    article = res.data;
  } catch {
    notFound();
  }

  const html = marked.parse(article.body_md ?? "");
  const date = new Date(article.published_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container size="md">
          <article className="py-10">
            <header className="mb-8">
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
              <h1 className="mb-3 text-[26px] font-bold leading-tight text-ink md:text-[30px]">
                {article.title}
              </h1>
              <p className="text-[13px] text-ink-mute">{date}</p>
            </header>

            <div
              className="prose prose-sm max-w-none text-ink [&_a]:text-brand-600 [&_a]:underline [&_h2]:text-[18px] [&_h2]:font-semibold [&_h3]:text-[16px] [&_h3]:font-semibold [&_li]:my-1 [&_p]:leading-relaxed [&_p]:text-[15px]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
