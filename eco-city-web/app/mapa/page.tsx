import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBand } from "@/components/layout/HeroBand";
import { Container } from "@/components/ui/Container";
import { CategoryFilters } from "@/components/mapa/CategoryFilters";
import { MapPlaceholder } from "@/components/mapa/MapPlaceholder";
import { FiltersSidebar } from "@/components/mapa/FiltersSidebar";
import { PointsList } from "@/components/mapa/PointsList";

export const metadata: Metadata = {
  title: "Mapa Interativo",
  description:
    "Encontre pontos de coleta perto de você. Filtre por tipo de material, veja detalhes do local e muito mais.",
};

export default function MapaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBand
          title="Mapa Interativo"
          subtitle="Encontre pontos de coleta perto de você. Filtre por tipo de material, veja detalhes do local e muito mais."
        />
        <Container size="xl">
          <section className="py-10">
            <h2 className="mb-5 text-[18px] font-semibold text-ink">
              Mapa Interativo
            </h2>

            <CategoryFilters />

            <div className="mt-6">
              <MapPlaceholder />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              <aside className="lg:col-span-3">
                <FiltersSidebar />
              </aside>
              <div className="lg:col-span-9">
                <PointsList />
              </div>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
