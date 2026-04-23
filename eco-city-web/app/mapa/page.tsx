import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBand } from "@/components/layout/HeroBand";
import { Container } from "@/components/ui/Container";
import { MapaClient } from "@/components/mapa/MapaClient";

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
            <MapaClient />
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
