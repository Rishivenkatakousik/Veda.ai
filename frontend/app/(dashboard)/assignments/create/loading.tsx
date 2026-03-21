import { Skeleton } from "@/components/ui/skeleton";

export default function CreateAssignmentLoading() {
  return (
    <div className="max-w-2xl mx-auto w-full px-1 sm:px-0 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-px flex-1" />
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
      </div>
    </div>
  );
}
