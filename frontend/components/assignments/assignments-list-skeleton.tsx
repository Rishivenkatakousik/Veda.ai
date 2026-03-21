import { Skeleton } from "@/components/ui/skeleton";

export default function AssignmentsListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-9 w-full sm:w-36" />
        <Skeleton className="h-9 w-full sm:max-w-sm flex-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-white p-5 space-y-3"
          >
            <div className="flex justify-between gap-2">
              <Skeleton className="h-5 flex-1 max-w-[200px]" />
              <Skeleton className="size-7 rounded-md shrink-0" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
