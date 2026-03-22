"use client";

import { CalendarIcon, Mic, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import FileUpload from "./file-upload";
import QuestionTypeRow from "./question-type-row";
import {
  useCreateAssignmentStore,
  selectTotalQuestions,
  selectTotalMarks,
} from "@/store/create-assignment-store";

interface CreateAssignmentFormProps {
  errors: Record<string, string | undefined>;
}

export default function CreateAssignmentForm({
  errors,
}: CreateAssignmentFormProps) {
  const title = useCreateAssignmentStore((s) => s.title);
  const subject = useCreateAssignmentStore((s) => s.subject);
  const className = useCreateAssignmentStore((s) => s.className);
  const schoolName = useCreateAssignmentStore((s) => s.schoolName);
  const dueDate = useCreateAssignmentStore((s) => s.dueDate);
  const questionConfig = useCreateAssignmentStore((s) => s.questionConfig);
  const instructions = useCreateAssignmentStore((s) => s.instructions);
  const addQuestionType = useCreateAssignmentStore((s) => s.addQuestionType);
  const setField = useCreateAssignmentStore((s) => s.setField);
  const totalQuestions = useCreateAssignmentStore(selectTotalQuestions);
  const totalMarks = useCreateAssignmentStore(selectTotalMarks);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-lg sm:font-semibold">
          Assignment Details
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Basic information about your assignment
        </p>
      </div>

      <FileUpload />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Assignment Title
          </label>
          <Input
            placeholder="e.g. Quiz on Electricity"
            value={title}
            onChange={(e) => setField("title", e.target.value)}
            className={cn(
              "h-11 rounded-xl bg-white",
              errors.title && "border-destructive",
            )}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Subject
          </label>
          <Input
            placeholder="e.g. Science"
            value={subject}
            onChange={(e) => setField("subject", e.target.value)}
            className={cn(
              "h-11 rounded-xl bg-white",
              errors.subject && "border-destructive",
            )}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-destructive">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Class
          </label>
          <Input
            placeholder="e.g. Grade 8"
            value={className}
            onChange={(e) => setField("className", e.target.value)}
            className={cn(
              "h-11 rounded-xl bg-white",
              errors.className && "border-destructive",
            )}
          />
          {errors.className && (
            <p className="mt-1 text-xs text-destructive">{errors.className}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            School Name
          </label>
          <Input
            placeholder="e.g. Springfield School"
            value={schoolName}
            onChange={(e) => setField("schoolName", e.target.value)}
            className={cn(
              "h-11 rounded-xl bg-white",
              errors.schoolName && "border-destructive",
            )}
          />
          {errors.schoolName && (
            <p className="mt-1 text-xs text-destructive">{errors.schoolName}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <Popover>
            <PopoverTrigger
              className={cn(
                "flex h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm transition-colors outline-none focus:border-ring focus:ring-2 focus:ring-ring/50",
                "border-gray-200/90 bg-gray-200/35 max-sm:border-gray-300/80",
                "sm:border-input sm:bg-white",
                dueDate ? "text-gray-900" : "text-muted-foreground max-sm:text-gray-500",
                errors.dueDate && "border-destructive",
              )}
            >
              <span>
                {dueDate ? format(dueDate, "dd-MM-yyyy") : "DD-MM-YYYY"}
              </span>
              <CalendarIcon className="size-4 shrink-0 text-gray-400" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate ?? undefined}
                onSelect={(date) => setField("dueDate", date ?? null)}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && (
            <p className="mt-1 text-xs text-destructive">{errors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200/80 pt-6 sm:border-gray-100 sm:pt-8">
        <h3 className="mb-4 text-base font-bold text-gray-900 sm:hidden">
          Question Type
        </h3>

        <div
          className="mb-4 hidden sm:grid sm:grid-cols-[minmax(0,1fr)_2.25rem_auto_auto] sm:items-end sm:gap-4"
          role="presentation"
        >
          <span className="text-sm font-semibold text-gray-800">
            Question Type
          </span>
          <span className="block" aria-hidden />
          <span className="text-center text-sm font-semibold text-gray-800">
            No. of Questions
          </span>
          <span className="text-center text-sm font-semibold text-gray-800">
            Marks
          </span>
        </div>

        <div className="space-y-4 sm:space-y-3">
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
          <p className="mt-2 text-xs text-destructive">
            {errors.questionConfig}
          </p>
        )}

        <div className="mt-6 flex w-full flex-col gap-3">
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-fit min-w-0 gap-2.5 self-start rounded-none border-0 bg-transparent px-0 py-1 text-sm font-semibold text-gray-700 shadow-none hover:bg-transparent hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-400/60 focus-visible:ring-offset-2"
            onClick={addQuestionType}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Plus className="size-4" strokeWidth={1.75} />
            </span>
            Add Question Type
          </Button>

          <div className="flex w-full flex-col items-end gap-1 text-right text-sm font-medium text-gray-900">
            <span>Total Questions : {totalQuestions}</span>
            <span>Total Marks : {totalMarks}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Additional Information (For better output)
        </label>
        <div className="relative">
          <Textarea
            placeholder="e.g Generate a question paper for 3 hour exam duration..."
            value={instructions}
            onChange={(e) => setField("instructions", e.target.value)}
            className="min-h-32 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 pr-12 pb-10 text-sm focus-visible:border-gray-400"
          />
          <span
            className="pointer-events-none absolute bottom-3 right-3 text-gray-400"
            aria-hidden
          >
            <Mic className="size-5" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </div>
  );
}
