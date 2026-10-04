import { Badge } from "@/components/ui/badge";

type StockBadgeProps = {
  inventoryCount: number;
};

export function StockBadge({ inventoryCount }: StockBadgeProps) {
  if (inventoryCount <= 0) {
    return (
      <Badge variant="secondary" className="rounded-none bg-foreground/10 text-foreground">
        Sold out
      </Badge>
    );
  }

  if (inventoryCount <= 5) {
    return (
      <Badge className="rounded-none bg-gold/20 text-ink hover:bg-gold/20">
        Only {inventoryCount} left
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="rounded-none border-gold/40 text-ink/80">
      In stock
    </Badge>
  );
}
