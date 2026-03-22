"use client";

import Link from "next/link";
import { Filter, Plus, Search, SearchX } from "lucide-react";
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
    <>
      <div className="space-y-6 pb-8 lg:pb-10">
        {/* Page header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="size-2 rounded-full bg-green-500 shrink-0"
              aria-hidden
            />
            <h1 className="text-xl font-semibold text-gray-900">Assignments</h1>
          </div>
          <p className="text-sm text-gray-500 pl-4">
            Manage and create assignments for your classes.
          </p>
        </div>

        {/* Filter + search — single pill */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 rounded-full bg-white border border-gray-200/90 px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-2 min-w-0 sm:shrink-0 sm:pr-4 sm:border-r sm:border-gray-200">
            <Filter className="size-4 text-gray-400 shrink-0" strokeWidth={1.75} />
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Filter By
            </span>
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as AssignmentStatus | "")
              }
              className="min-w-0 flex-1 sm:flex-initial h-9 rounded-lg border-0 bg-gray-50 sm:bg-transparent px-2 text-sm text-gray-800 font-medium outline-none focus:ring-0 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {ASSIGNMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ASSIGNMENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-0 sm:pl-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search Assignment"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-10 rounded-full border-0 bg-gray-50 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-gray-300"
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
      </div>

      <div className="sticky bottom-0 z-20 flex justify-center pt-4">
        <Link href="/assignments/create">
          <Button
            size="lg"
            className="h-10 gap-2 rounded-full bg-neutral-900 px-6 mb-4 text-sm text-white hover:bg-neutral-800 font-medium shadow-md shadow-black/10"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Create Assignment
          </Button>
        </Link>
      </div>
    </>
  );
}
