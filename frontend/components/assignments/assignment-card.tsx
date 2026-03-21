"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
      <div className="group relative rounded-xl border border-border bg-white p-4 sm:p-5 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className="text-base font-semibold text-gray-900 line-clamp-2 sm:line-clamp-1 cursor-pointer hover:text-orange-600 transition-colors"
            onClick={() => router.push(`/assignments/${assignment._id}`)}
          >
            {assignment.title}
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                aria-label="Actions"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem
                onClick={() => router.push(`/assignments/${assignment._id}`)}
              >
                <Eye className="size-4" />
                View Assignment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground mb-4">
          <p>
            Assigned on :{" "}
            <span className="text-gray-700">
              {formatDate(assignment.assignedOn)}
            </span>
          </p>
          <p>
            Due :{" "}
            <span className="text-gray-700">
              {formatDate(assignment.dueDate)}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
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
