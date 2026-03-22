"use client";

import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PdfDownloadButton from "./pdf-download-button";
import { useRegenerateAssignment } from "@/hooks/use-assignments";
import { stripLeadingQuestionEnumeration } from "@/lib/question-text";
import type { Assignment, QuestionDifficulty } from "@/types/assignment";
import toast from "react-hot-toast";

function formatDifficultyLabel(d: QuestionDifficulty): string {
  return d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
}

const DIFFICULTY_TEXT_CLASS: Record<QuestionDifficulty, string> = {
  easy: "text-emerald-600",
  moderate: "text-amber-600",
  challenging: "text-rose-600",
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

  const intro =
    `Certainly! Here are customized Question Paper for your ${paper.header.className} classes on the ${paper.header.subject} chapters:`;

  return (
    <div className="rounded-[22px] bg-[#4a4a4a] p-3 shadow-sm sm:rounded-[26px] sm:p-4 md:p-5">
      <div className="space-y-4 sm:space-y-5">
      <div className="rounded-2xl bg-[#181818] px-5 py-5 sm:rounded-[20px] sm:px-7 sm:py-6">
        <p className="text-left text-sm sm:text-[15px] font-bold text-white leading-relaxed tracking-tight">
          {intro}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <PdfDownloadButton assignmentId={assignment._id} />
          <Button
            type="button"
            variant="outline"
            aria-label={
              regenerateMutation.isPending
                ? "Regenerating assignment"
                : "Regenerate assignment"
            }
            className="gap-2 shadow-none max-sm:size-10 max-sm:min-w-10 max-sm:shrink-0 max-sm:rounded-full max-sm:border-0 max-sm:bg-[#2a2a2a] max-sm:p-0 max-sm:text-white max-sm:hover:bg-[#363636] max-sm:hover:text-white max-sm:[&_svg]:text-white sm:h-10 sm:rounded-full sm:border-white/90 sm:bg-transparent sm:px-5 sm:text-sm sm:font-medium sm:text-white sm:hover:bg-white/10 sm:hover:text-white"
            onClick={handleRegenerate}
            disabled={regenerateMutation.isPending}
          >
            {regenerateMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-sm sm:rounded-[20px]">
        <div className="overflow-x-auto">
          <div className="w-full max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-6 text-left">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-gray-900">
              {paper.header.schoolName}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <span>
                Subject:{" "}
                <span className="font-medium text-gray-800">
                  {paper.header.subject}
                </span>
              </span>
              <span>
                Class:{" "}
                <span className="font-medium text-gray-800">
                  {paper.header.className}
                </span>
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-row flex-wrap items-baseline justify-between gap-x-4 gap-y-2 text-sm text-gray-800">
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

          <p className="text-xs text-muted-foreground italic text-left">
            All questions are compulsory unless stated otherwise.
          </p>

          <Separator />

          <div className="space-y-3 text-sm text-gray-800">
            <div className="flex items-end gap-2 min-w-0">
              <span className="shrink-0">
                {paper.studentSection.nameLabel}:
              </span>
              <span className="flex-1 min-w-24 border-b border-gray-400 min-h-[1.35em]" />
            </div>
            <div className="flex items-end gap-2 min-w-0">
              <span className="shrink-0">
                {paper.studentSection.rollNumberLabel}:
              </span>
              <span className="flex-1 min-w-24 border-b border-gray-400 min-h-[1.35em]" />
            </div>
            <div className="flex items-end gap-2 min-w-0">
              <span className="shrink-0">
                {paper.studentSection.classSectionLabel}:
              </span>
              <span className="flex-1 min-w-24 border-b border-gray-400 min-h-[1.35em]" />
            </div>
          </div>

          <Separator />

          {paper.sections.map((section, sIdx) => {
            let questionNumber =
              paper.sections
                .slice(0, sIdx)
                .reduce((sum, s) => sum + s.questions.length, 0) + 1;

            const titleLines = section.title
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
            const sectionMainTitle = titleLines[0] ?? section.title;
            const sectionSubTitle =
              titleLines.length > 1 ? titleLines.slice(1).join(" ") : null;

            return (
              <div key={sIdx} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-center text-gray-900">
                    {sectionMainTitle}
                  </h2>
                  {sectionSubTitle && (
                    <p className="text-sm font-bold text-left text-gray-900">
                      {sectionSubTitle}
                    </p>
                  )}
                  {section.instructions && (
                    <p className="text-xs sm:text-sm text-muted-foreground italic text-left leading-relaxed">
                      {section.instructions}
                    </p>
                  )}
                </div>

                <ol className="list-none space-y-2.5 m-0 p-0">
                  {section.questions.map((q, qIdx) => {
                    const num = questionNumber++;
                    const stem = stripLeadingQuestionEnumeration(q.text);
                    const marksLabel =
                      q.marks === 1 ? "1 Mark" : `${q.marks} Marks`;
                    return (
                      <li key={qIdx} className="text-sm leading-relaxed text-gray-900">
                        <p className="text-left">
                          <span className="font-medium tabular-nums">
                            {num}.
                          </span>{" "}
                          <span
                            className={`font-medium ${DIFFICULTY_TEXT_CLASS[q.difficulty]}`}
                          >
                            [{formatDifficultyLabel(q.difficulty)}]
                          </span>{" "}
                          <span>{stem}</span>{" "}
                          <span className="text-muted-foreground">
                            [{marksLabel}]
                          </span>
                        </p>
                        {q.options && q.options.length > 0 && (
                          <ul className="mt-2 ml-0 pl-5 space-y-1 text-sm text-gray-800 list-disc text-left">
                            {q.options.map((opt, oIdx) => (
                              <li key={oIdx} className="leading-relaxed">
                                {opt}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ol>

                {sIdx < paper.sections.length - 1 && <Separator />}
              </div>
            );
          })}

          <p className="text-sm font-bold text-left text-gray-900 pt-1">
            End of Question Paper
          </p>

          {paper.answerKey && (
            <>
              <Separator />
              <div className="space-y-2 text-left">
                <h2 className="text-base font-bold text-gray-900">
                  Answer Key:
                </h2>
                <p className="text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {paper.answerKey}
                </p>
              </div>
            </>
          )}
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}
