import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductDimensions } from "@/types/product";

type ProductInfoAccordionProps = {
  material: string;
  careInstructions: string;
  dimensions: ProductDimensions;
  weightGrams: number;
};

function formatDimensions(dimensions: ProductDimensions): string {
  return `${dimensions.lengthMm} × ${dimensions.widthMm} × ${dimensions.heightMm} mm`;
}

export function ProductInfoAccordion({
  material,
  careInstructions,
  dimensions,
  weightGrams,
}: ProductInfoAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="border-t border-border"
      defaultValue="care"
    >
      <AccordionItem value="care" className="border-border">
        <AccordionTrigger className="rounded-none py-4 text-[11px] font-medium uppercase tracking-[0.2em] hover:no-underline">
          Care instructions
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
          {careInstructions}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dimensions" className="border-border">
        <AccordionTrigger className="rounded-none py-4 text-[11px] font-medium uppercase tracking-[0.2em] hover:no-underline">
          Dimensions
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
          <p>{formatDimensions(dimensions)}</p>
          <p className="mt-2">Weight · {weightGrams} g</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="material" className="border-border">
        <AccordionTrigger className="rounded-none py-4 text-[11px] font-medium uppercase tracking-[0.2em] hover:no-underline">
          Material
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
          {material}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
