import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="flex items-center justify-center size-20 rounded-full bg-gray-100 mb-6">
        <SearchX className="size-10 text-gray-400" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No assignments yet
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        Create your first AI-powered assignment and generate a complete question
        paper in minutes.
      </p>

      <Link href="/assignments/create">
        <Button className="bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 border-0 h-10 px-6 rounded-lg font-medium">
          Create Your First Assignment
        </Button>
      </Link>
    </div>
  );
}
