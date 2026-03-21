"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import type { Assignment } from "@/types/assignment";

interface AssignmentSocketCallbacks {
  onProcessing?: (data: { assignmentId: string; status: string }) => void;
  onCompleted?: (data: {
    assignmentId: string;
    status: string;
    assignment: Assignment;
  }) => void;
  onFailed?: (data: {
    assignmentId: string;
    status: string;
    error: string;
  }) => void;
}

export function useAssignmentSocket(
  assignmentId: string | undefined,
  callbacks?: AssignmentSocketCallbacks,
) {
  const queryClient = useQueryClient();
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!assignmentId) return;

    const socket = getSocket();

    socket.emit("subscribe:assignment", { assignmentId });

    const handleProcessing = (data: {
      assignmentId: string;
      status: string;
    }) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", assignmentId],
      });
      callbacksRef.current?.onProcessing?.(data);
    };

    const handleCompleted = (data: {
      assignmentId: string;
      status: string;
      assignment: Assignment;
    }) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", assignmentId],
      });
      callbacksRef.current?.onCompleted?.(data);
    };

    const handleFailed = (data: {
      assignmentId: string;
      status: string;
      error: string;
    }) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", assignmentId],
      });
      callbacksRef.current?.onFailed?.(data);
    };

    socket.on("assignment:processing", handleProcessing);
    socket.on("assignment:completed", handleCompleted);
    socket.on("assignment:failed", handleFailed);

    return () => {
      socket.emit("unsubscribe:assignment", { assignmentId });
      socket.off("assignment:processing", handleProcessing);
      socket.off("assignment:completed", handleCompleted);
      socket.off("assignment:failed", handleFailed);
    };
  }, [assignmentId, queryClient]);
}
