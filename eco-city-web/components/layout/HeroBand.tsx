import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export function HeroBand({
  title,
  subtitle,
  paddedBottom = false,
  className,
}: {
  title: string;
  subtitle?: string;
  paddedBottom?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-brand-500 text-white",
        paddedBottom ? "pb-24" : "",
        className,
      )}
    >
      <Container size="xl">
        <div className="py-10 text-center">
          <h1 className="text-[26px] font-bold leading-tight md:text-[28px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-2 max-w-2xl text-[14px] text-white/90">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
