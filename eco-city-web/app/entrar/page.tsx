"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBand } from "@/components/layout/HeroBand";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

export default function EntrarPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      await login({ email: email.trim(), password });
      router.push("/");
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "E-mail ou senha incorretos."
          : err instanceof ApiError
            ? err.message
            : "Erro inesperado. Tente novamente.";
      setStatus({ kind: "error", message });
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBand title="Entrar na conta" />
        <Container size="sm">
          <section className="py-10">
            <Card className="p-6">
              {status.kind === "error" && (
                <div
                  role="alert"
                  className="mb-5 rounded-md border border-danger bg-surface-alt p-4 text-[14px] text-danger"
                >
                  {status.message}
                </div>
              )}

              <form className="grid gap-4" onSubmit={onSubmit} noValidate>
                <label className="grid gap-1.5" htmlFor="email">
                  <span className="text-[13px] font-medium text-ink">
                    E-mail
                  </span>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </label>

                <label className="grid gap-1.5" htmlFor="password">
                  <span className="text-[13px] font-medium text-ink">
                    Senha
                  </span>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </label>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Entrando…" : "Entrar"}
                </Button>

                <p className="text-center text-[13px] text-ink-mute">
                  Não tem conta?{" "}
                  <Link
                    href="/cadastro"
                    className="text-brand-600 hover:underline"
                  >
                    Cadastre-se
                  </Link>
                </p>
              </form>
            </Card>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
