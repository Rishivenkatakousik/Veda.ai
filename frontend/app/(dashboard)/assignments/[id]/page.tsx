"use client";

import { use } from "react";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssignmentOutput from "@/components/assignments/assignment-output";
import {
  useAssignment,
  useRegenerateAssignment,
} from "@/hooks/use-assignments";
import { useAssignmentSocket } from "@/hooks/use-socket";
import toast from "react-hot-toast";

export default function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: assignment, isLoading, error } = useAssignment(id);
  const regenerateMutation = useRegenerateAssignment();

  useAssignmentSocket(id, {
    onCompleted: () => {
      toast.success("Assignment generated successfully!");
    },
    onFailed: (data) => {
      toast.error(data.error || "Generation failed");
    },
  });

  const handleRegenerate = () => {
    regenerateMutation.mutate(id, {
      onSuccess: () => toast.success("Regenerating assignment..."),
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="size-8 animate-spin text-orange-500" />
        <p className="text-sm text-muted-foreground">Loading assignment...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="flex items-center justify-center size-16 rounded-full bg-red-50">
          <AlertTriangle className="size-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Assignment not found
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The assignment you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
      </div>
    );
  }

  if (
    assignment.status === "queued" ||
    assignment.status === "processing"
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-200 opacity-50" />
          <div className="relative flex items-center justify-center size-16 rounded-full bg-orange-100">
            <Loader2 className="size-8 animate-spin text-orange-600" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Generating your assignment...
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Our AI is crafting a customized question paper for{" "}
            <span className="font-medium text-gray-700">
              {assignment.title}
            </span>
            . This usually takes 30–60 seconds.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-orange-500 animate-pulse" />
          Status:{" "}
          <span className="font-medium capitalize">{assignment.status}</span>
        </div>
      </div>
    );
  }

  if (assignment.status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
        <div className="flex items-center justify-center size-16 rounded-full bg-red-50">
          <AlertTriangle className="size-8 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Generation failed
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Something went wrong while generating the question paper. You can
            try regenerating it with the same configuration.
          </p>
        </div>
        <Button
          className="gap-2 h-10 px-5 rounded-lg bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 border-0"
          onClick={handleRegenerate}
          disabled={regenerateMutation.isPending}
        >
          {regenerateMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Regenerate
        </Button>
      </div>
    );
  }

  return <AssignmentOutput assignment={assignment} />;
}
