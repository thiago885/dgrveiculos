import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-24" />
          ))}
        </div>
        <div className="pt-3 border-t border-zinc-50">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  );
}
