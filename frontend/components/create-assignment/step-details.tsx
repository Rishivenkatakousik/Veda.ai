"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import FileUpload from "./file-upload";
import { useCreateAssignmentStore } from "@/store/create-assignment-store";

interface StepDetailsProps {
  errors: Record<string, string | undefined>;
}

export default function StepDetails({ errors }: StepDetailsProps) {
  const title = useCreateAssignmentStore((s) => s.title);
  const subject = useCreateAssignmentStore((s) => s.subject);
  const className = useCreateAssignmentStore((s) => s.className);
  const schoolName = useCreateAssignmentStore((s) => s.schoolName);
  const dueDate = useCreateAssignmentStore((s) => s.dueDate);
  const setField = useCreateAssignmentStore((s) => s.setField);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Assignment Details
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload reference material and fill in the assignment info.
        </p>
      </div>

      {/* File upload */}
      <FileUpload />

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Assignment Title
          </label>
          <Input
            placeholder="e.g. Quiz on Electricity"
            value={title}
            onChange={(e) => setField("title", e.target.value)}
            className={cn("h-10", errors.title && "border-destructive")}
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1">{errors.title}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject
          </label>
          <Input
            placeholder="e.g. Science"
            value={subject}
            onChange={(e) => setField("subject", e.target.value)}
            className={cn("h-10", errors.subject && "border-destructive")}
          />
          {errors.subject && (
            <p className="text-xs text-destructive mt-1">{errors.subject}</p>
          )}
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Class
          </label>
          <Input
            placeholder="e.g. Grade 8"
            value={className}
            onChange={(e) => setField("className", e.target.value)}
            className={cn("h-10", errors.className && "border-destructive")}
          />
          {errors.className && (
            <p className="text-xs text-destructive mt-1">{errors.className}</p>
          )}
        </div>

        {/* School Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            School Name
          </label>
          <Input
            placeholder="e.g. Springfield School"
            value={schoolName}
            onChange={(e) => setField("schoolName", e.target.value)}
            className={cn("h-10", errors.schoolName && "border-destructive")}
          />
          {errors.schoolName && (
            <p className="text-xs text-destructive mt-1">
              {errors.schoolName}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Due Date
          </label>
          <Popover>
            <PopoverTrigger
              className={cn(
                "flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors outline-none focus:border-ring focus:ring-2 focus:ring-ring/50",
                !dueDate && "text-muted-foreground",
                errors.dueDate && "border-destructive",
              )}
            >
              <CalendarIcon className="size-4 shrink-0" />
              {dueDate ? format(dueDate, "dd MMM yyyy") : "Pick a date"}
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
            <p className="text-xs text-destructive mt-1">{errors.dueDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
