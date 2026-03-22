"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeneratePdf } from "@/hooks/use-assignments";
import { downloadPdfUrl } from "@/services/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface PdfDownloadButtonProps {
  assignmentId: string;
  className?: string;
}

export default function PdfDownloadButton({
  assignmentId,
  className,
}: PdfDownloadButtonProps) {
  const generateMutation = useGeneratePdf();

  const handleDownload = () => {
    generateMutation.mutate(assignmentId, {
      onSuccess: () => {
        window.open(downloadPdfUrl(assignmentId), "_blank");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to generate PDF");
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      aria-label={
        generateMutation.isPending ? "Generating PDF" : "Download as PDF"
      }
      className={cn(
        "gap-2 shadow-none",
        "max-sm:size-10 max-sm:min-w-10 max-sm:shrink-0 max-sm:rounded-full max-sm:border-0 max-sm:bg-[#2a2a2a] max-sm:p-0 max-sm:text-white max-sm:hover:bg-[#363636] max-sm:hover:text-white max-sm:[&_svg]:text-white",
        "sm:h-10 sm:rounded-full sm:border-0 sm:bg-white sm:px-5 sm:text-sm sm:font-medium sm:text-[#212121] sm:hover:bg-zinc-100 sm:hover:text-[#212121] sm:[&_svg]:text-[#212121]",
        className,
      )}
      onClick={handleDownload}
      disabled={generateMutation.isPending}
    >
      {generateMutation.isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span className="hidden sm:inline">Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="size-4" />
          <span className="hidden sm:inline">Download as PDF</span>
        </>
      )}
    </Button>
  );
}
