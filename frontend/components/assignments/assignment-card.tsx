"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAssignment } from "@/hooks/use-assignments";
import type { AssignmentListItem } from "@/types/assignment";
import { ASSIGNMENT_STATUS_LABELS } from "@/lib/constants";
import toast from "react-hot-toast";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "secondary",
  queued: "outline",
  processing: "outline",
  completed: "default",
  failed: "destructive",
};

interface AssignmentCardProps {
  assignment: AssignmentListItem;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const router = useRouter();
  const deleteMutation = useDeleteAssignment();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(assignment._id, {
      onSuccess: () => {
        toast.success("Assignment deleted");
        setConfirmOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <>
      <div className="group relative rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 lg:rounded-xl lg:border-border lg:shadow-none">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3
            className="line-clamp-2 cursor-pointer text-base font-semibold text-gray-900 transition-colors hover:text-orange-600 sm:line-clamp-1"
            onClick={() => router.push(`/assignments/${assignment._id}`)}
          >
            {assignment.title}
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Actions"
              >
                <MoreVertical className="size-4 text-gray-700" strokeWidth={1.75} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="min-w-45 w-max rounded-xl p-1 shadow-md ring-1 ring-black/5"
            >
              <DropdownMenuItem
                className="rounded-lg px-2 py-1.5 text-sm text-gray-900"
                onClick={() => router.push(`/assignments/${assignment._id}`)}
              >
                View Assignment
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="mt-0.5 rounded-lg bg-gray-100 px-2 py-1.5 text-sm text-destructive hover:bg-gray-200 focus:bg-gray-200 focus:text-destructive dark:bg-gray-100 dark:hover:bg-gray-200 dark:focus:bg-gray-200"
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span className="font-semibold text-gray-900">Assigned on :</span>
            <span className="text-gray-500">
              {formatDate(assignment.assignedOn)}
            </span>
          </span>
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span className="font-semibold text-gray-900">Due :</span>
            <span className="text-gray-500">
              {formatDate(assignment.dueDate)}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant={STATUS_VARIANT[assignment.status] ?? "secondary"}>
            {ASSIGNMENT_STATUS_LABELS[assignment.status] ?? assignment.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {assignment.totalQuestions} Qs &middot; {assignment.totalMarks}{" "}
            marks
          </span>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete assignment?</DialogTitle>
            <DialogDescription>
              This will remove &quot;{assignment.title}&quot; from your list.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
