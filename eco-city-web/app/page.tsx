import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBand } from "@/components/layout/HeroBand";
import { FeatureCards } from "@/components/home/FeatureCards";
import { ArticlesPreview } from "@/components/home/ArticlesPreview";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBand
          title="Bem-vindo ao EcoCity"
          subtitle="Encontre horários de coleta, pontos de coleta e aprenda a descartar resíduos corretamente."
          paddedBottom
        />
        <FeatureCards />
        <ArticlesPreview />
      </main>
      <Footer />
    </>
  );
}
