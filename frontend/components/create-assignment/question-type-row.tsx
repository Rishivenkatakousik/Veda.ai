"use client";

import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUESTION_TYPES } from "@/lib/constants";
import { useCreateAssignmentStore } from "@/store/create-assignment-store";
import type { QuestionConfig } from "@/types/assignment";

interface QuestionTypeRowProps {
  index: number;
  config: QuestionConfig;
  canRemove: boolean;
}

export default function QuestionTypeRow({
  index,
  config,
  canRemove,
}: QuestionTypeRowProps) {
  const updateQuestionType = useCreateAssignmentStore(
    (s) => s.updateQuestionType,
  );
  const removeQuestionType = useCreateAssignmentStore(
    (s) => s.removeQuestionType,
  );

  return (
    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
      {/* Type selector */}
      <select
        value={config.type}
        onChange={(e) => updateQuestionType(index, "type", e.target.value)}
        className="h-9 flex-1 min-w-[160px] rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
      >
        <option value="" disabled>
          Select type
        </option>
        {QUESTION_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Count stepper */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() =>
            updateQuestionType(index, "count", Math.max(1, config.count - 1))
          }
          aria-label="Decrease count"
        >
          <Minus className="size-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium tabular-nums">
          {config.count}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() => updateQuestionType(index, "count", config.count + 1)}
          aria-label="Increase count"
        >
          <Plus className="size-3" />
        </Button>
      </div>

      {/* Marks stepper */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() =>
            updateQuestionType(index, "marks", Math.max(1, config.marks - 1))
          }
          aria-label="Decrease marks"
        >
          <Minus className="size-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium tabular-nums">
          {config.marks}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() => updateQuestionType(index, "marks", config.marks + 1)}
          aria-label="Increase marks"
        >
          <Plus className="size-3" />
        </Button>
      </div>

      {/* Remove */}
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => removeQuestionType(index)}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Remove question type"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
