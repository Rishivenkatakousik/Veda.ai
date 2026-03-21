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

  const { data, isLoading } = useAssignments({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  if (isLoading) {
    return <AssignmentsListSkeleton />;
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
