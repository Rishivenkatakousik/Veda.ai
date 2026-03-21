"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import QuestionTypeRow from "./question-type-row";
import {
  useCreateAssignmentStore,
  selectTotalQuestions,
  selectTotalMarks,
} from "@/store/create-assignment-store";

interface StepQuestionsProps {
  errors: Record<string, string | undefined>;
}

export default function StepQuestions({ errors }: StepQuestionsProps) {
  const questionConfig = useCreateAssignmentStore((s) => s.questionConfig);
  const instructions = useCreateAssignmentStore((s) => s.instructions);
  const addQuestionType = useCreateAssignmentStore((s) => s.addQuestionType);
  const setField = useCreateAssignmentStore((s) => s.setField);
  const totalQuestions = useCreateAssignmentStore(selectTotalQuestions);
  const totalMarks = useCreateAssignmentStore(selectTotalMarks);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Question Configuration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define the types and distribution of questions.
        </p>
      </div>

      {/* Column headers */}
      <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
        <span className="flex-1 min-w-[160px]">Type</span>
        <span className="w-[88px] text-center">Questions</span>
        <span className="w-[88px] text-center">Marks</span>
        <span className="w-6" />
      </div>

      {/* Question type rows */}
      <div className="space-y-3">
        {questionConfig.map((config, i) => (
          <QuestionTypeRow
            key={i}
            index={i}
            config={config}
            canRemove={questionConfig.length > 1}
          />
        ))}
      </div>

      {errors.questionConfig && (
        <p className="text-xs text-destructive">{errors.questionConfig}</p>
      )}

      {/* Add + Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg"
          onClick={addQuestionType}
        >
          <Plus className="size-4" />
          Add Question Type
        </Button>

        <div className="flex items-center gap-4 text-sm font-medium">
          <span>
            Total Questions:{" "}
            <span className="text-orange-600">{totalQuestions}</span>
          </span>
          <span>
            Total Marks:{" "}
            <span className="text-orange-600">{totalMarks}</span>
          </span>
        </div>
      </div>

      {/* Additional instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Additional Information
        </label>
        <Textarea
          placeholder="Any specific instructions for the AI, e.g. difficulty level, topics to focus on, language preferences..."
          value={instructions}
          onChange={(e) => setField("instructions", e.target.value)}
          className="min-h-24"
        />
      </div>
    </div>
  );
}
