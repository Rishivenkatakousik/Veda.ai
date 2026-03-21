"use client";

import { RefreshCw, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PdfDownloadButton from "./pdf-download-button";
import { useRegenerateAssignment } from "@/hooks/use-assignments";
import type { Assignment } from "@/types/assignment";
import toast from "react-hot-toast";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  challenging: "bg-red-100 text-red-700",
};

interface AssignmentOutputProps {
  assignment: Assignment;
}

export default function AssignmentOutput({
  assignment,
}: AssignmentOutputProps) {
  const paper = assignment.generatedPaper;
  const regenerateMutation = useRegenerateAssignment();

  const handleRegenerate = () => {
    regenerateMutation.mutate(assignment._id, {
      onSuccess: () => {
        toast.success("Regenerating assignment...");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to regenerate");
      },
    });
  };

  if (!paper) return null;

  return (
    <div className="space-y-6">
      {/* AI chat bubble */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center size-9 rounded-full bg-linear-to-br from-orange-500 to-red-500 shrink-0">
          <Sparkles className="size-4 text-white" />
        </div>
        <div className="rounded-xl rounded-tl-none bg-orange-50 border border-orange-100 px-4 py-3 text-sm text-gray-700 max-w-xl">
          Here are the customized Question Paper for your{" "}
          <span className="font-medium">
            {paper.header.className} {paper.header.subject}
          </span>{" "}
          classes. You can download it as PDF or regenerate with the same
          configuration.
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <PdfDownloadButton assignmentId={assignment._id} />
        <Button
          variant="outline"
          className="gap-2 h-9 rounded-lg"
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

      {/* Paper container */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold">{paper.header.schoolName}</h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>
                Subject: <span className="font-medium">{paper.header.subject}</span>
              </span>
              <span>
                Class: <span className="font-medium">{paper.header.className}</span>
              </span>
            </div>
          </div>

          <Separator />

          {/* Time + Marks */}
          <div className="flex items-center justify-between text-sm">
            <span>
              Time Allowed:{" "}
              <span className="font-medium">
                {paper.header.timeAllowed || "—"}
              </span>
            </span>
            <span>
              Maximum Marks:{" "}
              <span className="font-medium">{paper.header.maxMarks}</span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground italic text-center">
            All questions are compulsory unless stated otherwise.
          </p>

          <Separator />

          {/* Student section */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">
                {paper.studentSection.nameLabel}:
              </span>
              <div className="mt-1 border-b border-gray-300 h-6" />
            </div>
            <div>
              <span className="text-muted-foreground">
                {paper.studentSection.rollNumberLabel}:
              </span>
              <div className="mt-1 border-b border-gray-300 h-6" />
            </div>
            <div>
              <span className="text-muted-foreground">
                {paper.studentSection.classSectionLabel}:
              </span>
              <div className="mt-1 border-b border-gray-300 h-6" />
            </div>
          </div>

          <Separator />

          {/* Sections */}
          {paper.sections.map((section, sIdx) => {
            let questionNumber =
              paper.sections
                .slice(0, sIdx)
                .reduce((sum, s) => sum + s.questions.length, 0) + 1;

            return (
              <div key={sIdx} className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold">{section.title}</h2>
                  {section.instructions && (
                    <p className="text-xs text-muted-foreground italic mt-0.5">
                      {section.instructions}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {section.questions.map((q, qIdx) => {
                    const num = questionNumber++;
                    return (
                      <div key={qIdx} className="flex gap-3">
                        <span className="text-sm font-medium text-gray-500 shrink-0 w-7 text-right">
                          {num}.
                        </span>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-relaxed">{q.text}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[q.difficulty] ?? "bg-gray-100 text-gray-600"}`}
                            >
                              {q.difficulty}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              [{q.marks} mark{q.marks !== 1 ? "s" : ""}]
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sIdx < paper.sections.length - 1 && <Separator />}
              </div>
            );
          })}

          {/* Answer Key */}
          {paper.answerKey && (
            <>
              <Separator />
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Answer Key</h2>
                <p className="text-sm whitespace-pre-wrap text-gray-700">
                  {paper.answerKey}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
