import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto bg-footer text-white">
      <Container size="xl">
        <div className="grid gap-10 py-14 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="text-[17px] font-semibold">EcoCity</div>
            <div className="mt-3 text-[13px] text-white/70">
              Gestão de Resíduos Sólidos Urbanos
            </div>
            <p className="mt-2 max-w-2xl text-[13px] text-white/70 leading-relaxed">
              Tornando as cidades mais limpas e sustentáveis por meio de
              soluções inteligentes de gerenciamento de resíduos.
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="text-[17px] font-semibold">Fale Conosco</div>
            <ul className="mt-3 space-y-2 text-[13px] text-white/70">
              <li>(43) 9 9999-9999</li>
              <li>contato@ecocity.app</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-[12px] text-white/50">
          © {new Date().getFullYear()} EcoCity — Gestão de Resíduos Sólidos
          Urbanos. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
}
