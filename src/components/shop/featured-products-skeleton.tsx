import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProductsSkeleton() {
  return (
    <section className="bg-background px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-xl space-y-3 md:mb-16">
          <Skeleton className="h-3 w-28 rounded-none" />
          <Skeleton className="h-9 w-72 rounded-none" />
          <Skeleton className="h-4 w-full max-w-md rounded-none" />
        </div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full rounded-none" />
              <Skeleton className="h-3 w-20 rounded-none" />
              <Skeleton className="h-6 w-40 rounded-none" />
              <Skeleton className="h-3 w-28 rounded-none" />
              <Skeleton className="h-4 w-16 rounded-none" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
