"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

export function NavbarAuthSection() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="h-8 w-32 animate-pulse rounded bg-line" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-[14px] text-ink-soft">
          {user.name.split(" ")[0]}
        </span>
        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="text-[14px] text-ink-soft transition-colors hover:text-ink"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/entrar"
        className="text-[14px] text-ink-soft transition-colors hover:text-ink"
      >
        Login
      </Link>
      <LinkButton href="/cadastro" variant="primary" size="sm">
        Cadastrar
      </LinkButton>
    </>
  );
}
