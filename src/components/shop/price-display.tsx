import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  pricePaise: number;
  compareAtPricePaise?: number | null;
  className?: string;
};

function formatInrFromPaise(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function PriceDisplay({
  pricePaise,
  compareAtPricePaise,
  className,
}: PriceDisplayProps) {
  const hasDiscount =
    typeof compareAtPricePaise === "number" &&
    compareAtPricePaise > pricePaise;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="text-sm font-medium tracking-wide text-foreground">
        {formatInrFromPaise(pricePaise)}
      </span>
      {hasDiscount ? (
        <span className="text-xs text-muted-foreground line-through">
          {formatInrFromPaise(compareAtPricePaise)}
        </span>
      ) : null}
    </div>
  );
}
