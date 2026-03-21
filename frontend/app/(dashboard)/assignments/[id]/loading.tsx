import { Skeleton } from "@/components/ui/skeleton";

export default function AssignmentDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-1 sm:px-0">
      <div className="flex gap-3">
        <Skeleton className="size-9 rounded-full shrink-0" />
        <Skeleton className="h-16 flex-1 rounded-xl max-w-xl" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="p-8 space-y-4">
          <Skeleton className="h-8 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
