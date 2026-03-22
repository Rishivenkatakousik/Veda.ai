import { Skeleton } from "@/components/ui/skeleton";

export default function CreateAssignmentLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 sm:space-y-8 sm:px-1">
      <div className="relative flex min-h-11 items-center justify-center sm:justify-start">
        <Skeleton className="absolute left-0 size-10 shrink-0 rounded-full sm:hidden" />
        <div className="flex items-center gap-3 sm:w-full sm:justify-start">
          <Skeleton className="hidden size-[22px] shrink-0 rounded-full sm:block" />
          <div className="space-y-2 text-center sm:text-left">
            <Skeleton className="mx-auto h-5 w-40 sm:mx-0 sm:h-6 sm:w-48" />
            <Skeleton className="mx-auto hidden h-4 w-72 max-w-full sm:mx-0 sm:block" />
          </div>
        </div>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <Skeleton className="h-full w-1/2 rounded-full sm:w-[40%]" />
      </div>
      <div className="space-y-4 rounded-2xl bg-gray-100 p-4 shadow-sm ring-1 ring-gray-200/80 sm:rounded-3xl sm:p-8">
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
      <div className="flex gap-3">
        <Skeleton className="h-11 flex-1 rounded-full sm:w-28 sm:flex-initial" />
        <Skeleton className="h-11 flex-1 rounded-full sm:w-24 sm:flex-initial" />
      </div>
    </div>
  );
}
