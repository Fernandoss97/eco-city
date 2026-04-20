import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 whitespace-nowrap focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary:
    "bg-surface text-brand-600 border border-brand-500 hover:bg-brand-50",
  ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-line-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-[14px]",
  lg: "h-11 px-5 text-[15px]",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
