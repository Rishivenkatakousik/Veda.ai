"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepDetails from "@/components/create-assignment/step-details";
import StepQuestions from "@/components/create-assignment/step-questions";
import { useCreateAssignmentStore } from "@/store/create-assignment-store";
import { useCreateAssignment } from "@/hooks/use-assignments";
import { createAssignmentSchema } from "@/validators/assignment";
import toast from "react-hot-toast";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const step = useCreateAssignmentStore((s) => s.step);
  const nextStep = useCreateAssignmentStore((s) => s.nextStep);
  const prevStep = useCreateAssignmentStore((s) => s.prevStep);
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

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    if (!store.title || store.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";
    if (!store.subject || store.subject.trim().length < 2)
      newErrors.subject = "Subject is required";
    if (!store.className || store.className.trim().length < 1)
      newErrors.className = "Class is required";
    if (!store.schoolName || store.schoolName.trim().length < 2)
      newErrors.schoolName = "School name is required";
    if (!store.dueDate) newErrors.dueDate = "Due date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
    }
    setErrors({});
    nextStep();
  };

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
      toast.error("Please fix the errors before submitting");
      return;
    }

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
    <div className="w-full max-w-2xl mx-auto px-0 sm:px-1">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-7 rounded-full bg-orange-500 text-white text-xs font-semibold">
            1
          </span>
          <span
            className={`text-sm font-medium ${step === 1 ? "text-gray-900" : "text-muted-foreground"}`}
          >
            Details
          </span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center justify-center size-7 rounded-full text-xs font-semibold ${
              step === 2
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </span>
          <span
            className={`text-sm font-medium ${step === 2 ? "text-gray-900" : "text-muted-foreground"}`}
          >
            Questions
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-white p-6">
        {step === 1 ? (
          <StepDetails errors={errors} />
        ) : (
          <StepQuestions errors={errors} />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          className="gap-2 h-10 rounded-lg"
          onClick={step === 1 ? () => router.push("/assignments") : prevStep}
        >
          <ArrowLeft className="size-4" />
          {step === 1 ? "Cancel" : "Previous"}
        </Button>

        {step < 2 ? (
          <Button
            type="button"
            className="gap-2 h-10 rounded-lg bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 border-0"
            onClick={handleNext}
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="gap-2 h-10 px-6 rounded-lg bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 border-0"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Create Assignment"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
