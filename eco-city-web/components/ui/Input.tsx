import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: Props) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full rounded-md border border-line bg-surface px-3 text-[14px] text-ink placeholder:text-ink-mute transition-colors",
        "focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20",
        invalid &&
          "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
        className,
      )}
    />
  );
}
