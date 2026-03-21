"use client";

import Link from "next/link";
import { Plus, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AssignmentCard from "./assignment-card";
import type { AssignmentListItem, AssignmentStatus } from "@/types/assignment";
import { ASSIGNMENT_STATUSES } from "@/types/assignment";
import { ASSIGNMENT_STATUS_LABELS } from "@/lib/constants";

interface AssignmentGridProps {
  assignments: AssignmentListItem[];
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: AssignmentStatus | "";
  onStatusFilterChange: (value: AssignmentStatus | "") => void;
}

export default function AssignmentGrid({
  assignments,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: AssignmentGridProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-semibold text-gray-900">Assignments</h1>
          <span className="size-2 rounded-full bg-green-500" />
        </div>
        <p className="text-sm text-muted-foreground">
          Manage and create assignments for your classes.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as AssignmentStatus | "")
          }
          className="h-9 rounded-lg border border-input bg-white px-3 text-sm text-gray-700 outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
        >
          <option value="">All Statuses</option>
          {ASSIGNMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ASSIGNMENT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Grid */}
      {assignments.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center gap-3 px-2">
          <SearchX className="size-10 text-muted-foreground/60" />
          <p className="text-sm font-medium text-gray-800">
            No assignments match your filters
          </p>
          <p className="text-xs text-muted-foreground max-w-sm">
            Try a different search term or clear the status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="flex justify-center pt-2">
        <Link href="/assignments/create">
          <Button
            variant="outline"
            className="gap-2 h-10 px-5 rounded-lg font-medium"
          >
            <Plus className="size-4" />
            Create Assignment
          </Button>
        </Link>
      </div>
    </div>
  );
}
