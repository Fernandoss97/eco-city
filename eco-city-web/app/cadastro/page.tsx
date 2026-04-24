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
  | { kind: "error"; message: string; fieldErrors?: Record<string, string[]> };

export default function CadastroPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setStatus({
          kind: "error",
          message: "Verifique os campos e tente novamente.",
        });
      } else {
        setStatus({
          kind: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "Erro inesperado. Tente novamente.",
        });
      }
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBand title="Criar conta" />
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
                <label className="grid gap-1.5" htmlFor="name">
                  <span className="text-[13px] font-medium text-ink">
                    Nome completo
                  </span>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={set("name")}
                    maxLength={120}
                    autoComplete="name"
                  />
                </label>

                <label className="grid gap-1.5" htmlFor="email">
                  <span className="text-[13px] font-medium text-ink">
                    E-mail
                  </span>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5" htmlFor="password">
                    <span className="text-[13px] font-medium text-ink">
                      Senha
                    </span>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={set("password")}
                      autoComplete="new-password"
                    />
                  </label>

                  <label className="grid gap-1.5" htmlFor="password_confirmation">
                    <span className="text-[13px] font-medium text-ink">
                      Confirmar senha
                    </span>
                    <Input
                      id="password_confirmation"
                      type="password"
                      required
                      value={form.password_confirmation}
                      onChange={set("password_confirmation")}
                      autoComplete="new-password"
                    />
                  </label>
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Criando conta…" : "Criar conta"}
                </Button>

                <p className="text-center text-[13px] text-ink-mute">
                  Já tem conta?{" "}
                  <Link
                    href="/entrar"
                    className="text-brand-600 hover:underline"
                  >
                    Entrar
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
