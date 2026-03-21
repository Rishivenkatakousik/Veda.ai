"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeneratePdf } from "@/hooks/use-assignments";
import { downloadPdfUrl } from "@/services/api";
import toast from "react-hot-toast";

interface PdfDownloadButtonProps {
  assignmentId: string;
}

export default function PdfDownloadButton({
  assignmentId,
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
      variant="outline"
      className="gap-2 h-9 rounded-lg"
      onClick={handleDownload}
      disabled={generateMutation.isPending}
    >
      {generateMutation.isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="size-4" />
          Download as PDF
        </>
      )}
    </Button>
  );
}
