import { Skeleton } from "@/components/ui/skeleton";

export default function CreateAssignmentLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-0 sm:px-1 sm:space-y-8">
      <div className="flex items-center gap-3">
        <Skeleton className="size-[22px] shrink-0 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>
      <Skeleton className="h-1 w-full rounded-full" />
      <div className="space-y-4 rounded-3xl bg-gray-100 p-6 shadow-sm ring-1 ring-gray-200/80 sm:p-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <Skeleton className="h-11 w-full sm:col-span-2" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full sm:col-span-2" />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <Skeleton className="h-11 w-28 rounded-full" />
        <Skeleton className="h-11 w-24 rounded-full" />
      </div>
    </div>
  );
}
