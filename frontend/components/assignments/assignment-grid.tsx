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
    <div className="flex flex-1 flex-col lg:min-h-[calc(100dvh-7rem)]">
      <div className="flex min-h-0 flex-1 flex-col space-y-4 pb-8 sm:space-y-6 lg:pb-0">
        {/* Page header — desktop only; mobile title lives in the shell header */}
        <div className="hidden lg:block">
          <div className="mb-1.5 flex items-center gap-3">
            <span
              className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-green-500/20"
              aria-hidden
            >
              <span className="size-2 rounded-full bg-green-500" />
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Assignments
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>
        </div>

        {/* Filter + search — mobile: compact row; desktop: filter left, search flush right */}
        <div className="flex flex-row items-center gap-2 rounded-2xl border border-gray-200/90 bg-white px-3 py-2 shadow-sm sm:justify-between sm:gap-4 sm:rounded-full sm:px-5 sm:py-2.5">
          <div className="flex min-w-0 shrink-0 items-center gap-1.5 border-r border-gray-200 pr-2 sm:shrink-0 sm:gap-2 sm:border-r sm:pr-5">
            <Filter
              className="size-4 shrink-0 text-gray-400"
              strokeWidth={1.75}
            />
            <span className="hidden whitespace-nowrap text-sm text-gray-500 sm:inline">
              Filter By
            </span>
            <span className="whitespace-nowrap text-sm text-gray-500 sm:hidden">
              Filter
            </span>
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as AssignmentStatus | "")
              }
              className="h-9 min-w-0 max-w-30 flex-1 cursor-pointer rounded-lg border-0 bg-transparent px-1 text-sm font-semibold text-gray-800 outline-none focus:ring-0 sm:max-w-none sm:flex-initial sm:bg-gray-50 sm:px-2 lg:bg-transparent"
            >
              <option value="">All Statuses</option>
              {ASSIGNMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ASSIGNMENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-0 flex-1 sm:max-w-md sm:flex-none lg:max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Assignment"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-full border border-gray-200 bg-white pl-9 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-gray-300 sm:bg-white"
            />
          </div>
        </div>

        {/* Grid */}
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200/70 bg-[#f5f5f5] px-4 py-16 text-center sm:py-20">
            <SearchX
              className="size-10 text-muted-foreground/60"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-sm font-semibold text-gray-900">
              No assignments match your filters
            </p>
            <p className="max-w-sm text-xs text-gray-500 sm:text-sm">
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

      <div className="mt-auto hidden shrink-0 justify-center pt-4 pb-4 lg:flex lg:pb-10">
        <Link href="/assignments/create">
          <Button
            size="lg"
            className="mb-0 h-10 gap-2 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white shadow-md shadow-black/10 hover:bg-neutral-800"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Create Assignment
          </Button>
        </Link>
      </div>
    </div>
  );
}
