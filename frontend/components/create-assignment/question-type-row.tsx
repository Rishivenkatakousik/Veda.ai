"use client";

import { Check, ChevronDown, Minus, Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QUESTION_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCreateAssignmentStore } from "@/store/create-assignment-store";
import type { QuestionConfig } from "@/types/assignment";

interface QuestionTypeRowProps {
  index: number;
  config: QuestionConfig;
  canRemove: boolean;
}

function CounterPill({
  value,
  onDecrement,
  onIncrement,
  decrementLabel,
  incrementLabel,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementLabel: string;
  incrementLabel: string;
}) {
  const stepBtn =
    "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/80";

  return (
    <div
      className="flex h-10 items-center rounded-full bg-white px-0.5 shadow-sm ring-1 ring-black/6"
      role="group"
    >
      <button
        type="button"
        className={stepBtn}
        onClick={onDecrement}
        aria-label={decrementLabel}
      >
        <Minus className="size-3.5" strokeWidth={1.75} />
      </button>
      <span className="min-w-8 px-1 text-center text-sm font-medium tabular-nums text-gray-900">
        {value}
      </span>
      <button
        type="button"
        className={stepBtn}
        onClick={onIncrement}
        aria-label={incrementLabel}
      >
        <Plus className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function TypeDropdown({
  index,
  config,
  triggerClassName,
}: {
  index: number;
  config: QuestionConfig;
  triggerClassName: string;
}) {
  const updateQuestionType = useCreateAssignmentStore(
    (s) => s.updateQuestionType,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex h-10 w-full min-w-0 items-center justify-between gap-3 bg-white text-left text-sm text-gray-900 shadow-sm ring-1 ring-black/6 outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-gray-300/80",
              triggerClassName,
            )}
          />
        }
      >
        <span
          className={cn(
            "min-w-0 truncate font-normal",
            !config.type && "text-gray-400",
          )}
        >
          {config.type || "Select type"}
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-gray-400"
          strokeWidth={1.75}
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="max-h-64 min-w-(--anchor-width) rounded-xl p-1 shadow-md ring-1 ring-black/5"
      >
        {QUESTION_TYPES.map((t) => (
          <DropdownMenuItem
            key={t}
            className="justify-between gap-2 rounded-lg px-3 py-2 text-sm text-gray-900"
            onClick={() => updateQuestionType(index, "type", t)}
          >
            {t}
            {config.type === t ? (
              <Check className="size-4 shrink-0 text-gray-600" strokeWidth={2} />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
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

  const countProps = {
    value: config.count,
    onDecrement: () =>
      updateQuestionType(index, "count", Math.max(1, config.count - 1)),
    onIncrement: () =>
      updateQuestionType(index, "count", config.count + 1),
    decrementLabel: "Decrease number of questions" as const,
    incrementLabel: "Increase number of questions" as const,
  };

  const marksProps = {
    value: config.marks,
    onDecrement: () =>
      updateQuestionType(index, "marks", Math.max(1, config.marks - 1)),
    onIncrement: () =>
      updateQuestionType(index, "marks", config.marks + 1),
    decrementLabel: "Decrease marks" as const,
    incrementLabel: "Increase marks" as const,
  };

  const removeClassMobile =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/80";
  const removeClassDesktop =
    "inline-flex size-9 shrink-0 items-center justify-center justify-self-center rounded-full text-gray-400 transition-colors hover:bg-gray-200/80 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/80";

  return (
    <div>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/6 sm:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <TypeDropdown
              index={index}
              config={config}
              triggerClassName="rounded-xl px-3"
            />
          </div>
          {canRemove ? (
            <button
              type="button"
              onClick={() => removeQuestionType(index)}
              className={removeClassMobile}
              aria-label="Remove question type"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>

        <div className="mt-3 rounded-xl bg-gray-100 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2.5">
              <span className="text-center text-xs font-semibold text-gray-600">
                No. of Questions
              </span>
              <CounterPill {...countProps} />
            </div>
            <div className="flex flex-col items-center gap-2.5">
              <span className="text-center text-xs font-semibold text-gray-600">
                Marks
              </span>
              <CounterPill {...marksProps} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_2.25rem_auto_auto] sm:items-center sm:gap-4">
        <div className="min-w-0">
          <TypeDropdown
            index={index}
            config={config}
            triggerClassName="rounded-full px-4"
          />
        </div>

        <div className="flex items-center justify-end gap-3 sm:contents">
          {canRemove ? (
            <button
              type="button"
              onClick={() => removeQuestionType(index)}
              className={removeClassDesktop}
              aria-label="Remove question type"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          ) : (
            <span
              className="hidden size-9 shrink-0 justify-self-center sm:block"
              aria-hidden
            />
          )}

          <div className="flex justify-center">
            <CounterPill {...countProps} />
          </div>

          <div className="flex justify-center">
            <CounterPill {...marksProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
