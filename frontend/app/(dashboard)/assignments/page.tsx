"use client";

import { useState } from "react";
import { useAssignments } from "@/hooks/use-assignments";
import type { AssignmentStatus } from "@/types/assignment";
import AssignmentGrid from "@/components/assignments/assignment-grid";
import EmptyState from "@/components/assignments/empty-state";

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "">("");
  const [page] = useState(1);

  const { data, isLoading } = useAssignments({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-40 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-4 w-72 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-36 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-9 w-60 rounded-lg bg-gray-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-xl border border-border bg-white animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const hasNoAssignments =
    !data?.items.length && !search && !statusFilter;

  if (hasNoAssignments) {
    return <EmptyState />;
  }

  return (
    <AssignmentGrid
      assignments={data?.items ?? []}
      search={search}
      onSearchChange={setSearch}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
    />
  );
}
