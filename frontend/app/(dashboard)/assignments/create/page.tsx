"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateAssignmentForm from "@/components/create-assignment/create-assignment-form";
import { useCreateAssignmentStore } from "@/store/create-assignment-store";
import { useCreateAssignment } from "@/hooks/use-assignments";
import { createAssignmentSchema } from "@/validators/assignment";
import toast from "react-hot-toast";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const reset = useCreateAssignmentStore((s) => s.reset);
  const store = useCreateAssignmentStore();

  const createMutation = useCreateAssignment();
  const submitLockRef = useRef(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleSubmit = async () => {
    if (submitLockRef.current || createMutation.isPending) return;

    const parsed = createAssignmentSchema.safeParse({
      title: store.title,
      subject: store.subject,
      className: store.className,
      schoolName: store.schoolName,
      dueDate: store.dueDate,
      questionConfig: store.questionConfig,
      instructions: store.instructions,
      createdBy: "John Doe",
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string | undefined> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error("Please fix the errors before continuing");
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("title", store.title);
    formData.append("subject", store.subject);
    formData.append("className", store.className);
    formData.append("schoolName", store.schoolName);
    formData.append("dueDate", store.dueDate!.toISOString());
    formData.append("questionConfig", JSON.stringify(store.questionConfig));
    formData.append("instructions", store.instructions);
    formData.append("createdBy", "John Doe");

    for (const file of store.files) {
      formData.append("materialFiles", file);
    }

    submitLockRef.current = true;
    try {
      const data = await createMutation.mutateAsync(formData);
      toast.success("Assignment created! Generating questions...");
      reset();
      router.push(`/assignments/${data.assignmentId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      submitLockRef.current = false;
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-0 sm:px-1">
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <span
          className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-green-500/20"
          aria-hidden
        >
          <span className="size-2 rounded-full bg-green-500" />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-gray-900">
            Create Assignment
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Set up a new assignment for your students
          </p>
        </div>
      </div>

      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-gray-200 sm:mb-8">
        <div className="h-full w-[40%] rounded-full bg-neutral-900" />
      </div>

      <div className="rounded-3xl bg-gray-100 p-6 shadow-sm ring-1 ring-gray-200/80 sm:p-8">
        <CreateAssignmentForm errors={errors} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-full border-gray-300 bg-white px-5 text-sm font-medium hover:bg-gray-50"
          onClick={() => router.push("/assignments")}
        >
          <ArrowLeft className="size-4" />
          Previous
        </Button>

        <Button
          type="button"
          className="h-11 gap-2 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-800"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>
              Next
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
