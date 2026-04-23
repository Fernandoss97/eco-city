import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBand } from "@/components/layout/HeroBand";
import { Container } from "@/components/ui/Container";
import { ScheduleFinder } from "@/components/coletas/ScheduleFinder";
import { MonthlyCalendar } from "@/components/coletas/MonthlyCalendar";

export const metadata: Metadata = {
  title: "Calendário de Coleta",
  description:
    "Encontre o calendário de coleta da sua região, configure lembretes e muito mais.",
};

export default function ColetasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBand
          title="Calendário de Coleta"
          subtitle="Encontre o calendário de coleta da sua região, configure lembretes e muito mais."
        />
        <Container size="xl">
          <section className="py-10">
            <h2 className="mb-5 text-[18px] font-semibold text-ink">
              Informações de Coleta
            </h2>
            <ScheduleFinder />
            <div className="mt-8">
              <MonthlyCalendar />
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
