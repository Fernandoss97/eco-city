import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg" | "xl";

const widths: Record<Size, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-[84rem]",
};

export function Container({
  children,
  size = "lg",
  className,
}: {
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10", widths[size], className)}>
      {children}
    </div>
  );
}
