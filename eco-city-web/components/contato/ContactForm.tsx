"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError, submitContactMessage } from "@/lib/api";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; fieldErrors?: Record<string, string[]> };

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  body: "",
};

export function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const update = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      const res = await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        body: form.body.trim(),
      });
      setStatus({ kind: "success", message: res.data.message });
      setForm(INITIAL_FORM);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setStatus({
          kind: "error",
          message: "Verifique os campos destacados e tente novamente.",
        });
      } else if (err instanceof ApiError && err.status === 429) {
        setStatus({
          kind: "error",
          message: "Muitas tentativas. Aguarde um minuto e tente de novo.",
        });
      } else {
        setStatus({
          kind: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "Erro inesperado ao enviar a mensagem.",
        });
      }
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <Card className="p-6">
      {status.kind === "success" && (
        <div
          role="status"
          className="mb-5 rounded-md border border-brand-500 bg-brand-50 p-4 text-[14px] text-brand-700"
        >
          {status.message}
        </div>
      )}

      {status.kind === "error" && (
        <div
          role="alert"
          className="mb-5 rounded-md border border-danger bg-surface-alt p-4 text-[14px] text-danger"
        >
          {status.message}
        </div>
      )}

      <form className="grid gap-4" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" required htmlFor="name">
            <Input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={(e) => update("name")(e.target.value)}
              maxLength={120}
              autoComplete="name"
            />
          </Field>
          <Field label="E-mail" required htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email")(e.target.value)}
              maxLength={255}
              autoComplete="email"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefone (opcional)" htmlFor="phone">
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone")(e.target.value)}
              maxLength={20}
              autoComplete="tel"
            />
          </Field>
          <Field label="Assunto" required htmlFor="subject">
            <Input
              id="subject"
              name="subject"
              required
              value={form.subject}
              onChange={(e) => update("subject")(e.target.value)}
              maxLength={160}
            />
          </Field>
        </div>

        <Field label="Mensagem" required htmlFor="body">
          <textarea
            id="body"
            name="body"
            required
            rows={6}
            value={form.body}
            onChange={(e) => update("body")(e.target.value)}
            minLength={10}
            maxLength={5000}
            className="w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-ink-mute focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20"
          />
        </Field>

        <div className="flex items-center justify-end gap-3">
          <span className="text-[12px] text-ink-mute">
            Responderemos em até 2 dias úteis.
          </span>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando…" : "Enviar mensagem"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="grid gap-1.5">
      <span className="text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}
