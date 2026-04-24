import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBand } from "@/components/layout/HeroBand";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contato/ContactForm";

export const metadata: Metadata = {
  title: "Fale Conosco",
  description:
    "Envie dúvidas, sugestões ou denúncias para a equipe da EcoCity.",
};

export default function ContatoPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBand
          title="Fale Conosco"
          subtitle="Envie dúvidas, sugestões ou denúncias. Nossa equipe responderá em até 2 dias úteis."
        />
        <Container size="md">
          <section className="py-10">
            <ContactForm />
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
