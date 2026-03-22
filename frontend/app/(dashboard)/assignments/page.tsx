"use client";

import { useState } from "react";
import { useAssignments } from "@/hooks/use-assignments";
import type { AssignmentStatus } from "@/types/assignment";
import AssignmentGrid from "@/components/assignments/assignment-grid";
import EmptyState from "@/components/assignments/empty-state";
import AssignmentsListSkeleton from "@/components/assignments/assignments-list-skeleton";

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "">("");
  const [page] = useState(1);

  const { data, isLoading, isError } = useAssignments({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  if (isLoading) {
    return <AssignmentsListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[calc(100dvh-14rem)] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[calc(100dvh-13rem)] lg:min-h-[calc(100dvh-7rem)]">
        <p className="text-sm font-medium text-gray-900">
          Couldn&apos;t load assignments
        </p>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Check your connection and try refreshing the page.
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];
  const totalItems = data?.pagination?.totalItems ?? 0;
  const filtersActive = Boolean(search?.trim()) || Boolean(statusFilter);
  const hasNoAssignments =
    items.length === 0 && !filtersActive && totalItems === 0;

  if (hasNoAssignments) {
    return <EmptyState />;
  }

  return (
    <AssignmentGrid
      assignments={items}
      search={search}
      onSearchChange={setSearch}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
    />
  );
}
