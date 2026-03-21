"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_UPLOAD_FILES,
} from "@/lib/constants";
import { useCreateAssignmentStore } from "@/store/create-assignment-store";
import toast from "react-hot-toast";

const ACCEPT_STRING = Object.values(ACCEPTED_FILE_TYPES).flat().join(",");

function validateFiles(incoming: File[], existingCount: number): File[] {
  const valid: File[] = [];

  for (const file of incoming) {
    if (existingCount + valid.length >= MAX_UPLOAD_FILES) {
      toast.error(`Maximum ${MAX_UPLOAD_FILES} files allowed`);
      break;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      continue;
    }
    valid.push(file);
  }

  return valid;
}

export default function FileUpload() {
  const files = useCreateAssignmentStore((s) => s.files);
  const addFiles = useCreateAssignmentStore((s) => s.addFiles);
  const removeFile = useCreateAssignmentStore((s) => s.removeFile);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const validated = validateFiles(Array.from(fileList), files.length);
      if (validated.length) addFiles(validated);
    },
    [files.length, addFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
          dragActive
            ? "border-orange-400 bg-orange-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex items-center justify-center size-12 rounded-full bg-white border border-gray-200">
          <Upload className="size-5 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">
            Choose a file or drag & drop it here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG, WebP, PDF, DOC, DOCX — up to {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_STRING}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* File preview list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-2"
            >
              <FileIcon className="size-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
