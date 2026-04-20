import { cn } from "@/lib/cn";

export type BadgeTone = "brand" | "neutral" | "outline";

const toneMap: Record<BadgeTone, string> = {
  brand: "bg-brand-500 text-white",
  neutral: "bg-line-soft text-ink-soft",
  outline: "bg-surface text-ink border border-line",
};

export function Badge({
  tone = "brand",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium leading-5",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
