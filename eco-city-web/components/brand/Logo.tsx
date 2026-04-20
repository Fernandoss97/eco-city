import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-brand-600 font-bold text-[20px] leading-none tracking-tight",
        className,
      )}
    >
      EcoCity
    </span>
  );
}
