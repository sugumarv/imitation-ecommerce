import { Skeleton } from "@/components/ui/skeleton";

const aspectClasses = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[5/6]",
  "aspect-[3/4]",
  "aspect-[4/5]",
] as const;

export function ShopGridSkeleton() {
  return (
    <div
      className="columns-1 gap-6 sm:columns-2 xl:columns-3"
      aria-busy="true"
      aria-label="Loading products"
    >
      {aspectClasses.map((aspect, index) => (
        <div key={index} className="mb-8 break-inside-avoid space-y-3">
          <Skeleton className={`${aspect} w-full rounded-none`} />
          <Skeleton className="h-3 w-20 rounded-none" />
          <Skeleton className="h-6 w-40 rounded-none" />
          <Skeleton className="h-3 w-28 rounded-none" />
          <Skeleton className="h-4 w-16 rounded-none" />
        </div>
      ))}
    </div>
  );
}
