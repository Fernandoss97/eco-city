import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { label: "Home", href: "/" },
  { label: "Mapa", href: "/mapa" },
  { label: "Calendário de Coleta", href: "/coletas" },
  { label: "Blog", href: "/blog" },
] as const;

export function Navbar() {
  return (
    <header className="bg-surface border-b border-line">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="EcoCity — início">
            <Logo />
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Navegação principal"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/entrar"
              className="text-[14px] text-ink-soft transition-colors hover:text-ink"
            >
              Login
            </Link>
            <LinkButton href="/cadastro" variant="primary" size="sm">
              Cadastrar
            </LinkButton>
          </nav>

          {/* Mobile: apenas Cadastrar visível (nav completo fica para um menu hamburger futuro) */}
          <div className="md:hidden">
            <LinkButton href="/cadastro" variant="primary" size="sm">
              Cadastrar
            </LinkButton>
          </div>
        </div>
      </Container>
    </header>
  );
}
