import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[min(70vh,640px)] py-12 px-4 pb-24 text-center lg:pb-12">
      <div className="mb-8 flex justify-center w-full max-w-md">
        <Image
          src="/Illustrations.png"
          alt=""
          width={420}
          height={320}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      <h2 className="text-2xl sm:text-[1.75rem] font-bold text-gray-900 tracking-tight mb-3">
        No assignments yet
      </h2>
      <p className="text-sm sm:text-base text-gray-500 max-w-lg mb-10 leading-relaxed">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      <Link href="/assignments/create">
        <Button
          size="lg"
          className="h-12 px-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 font-medium gap-2 text-base shadow-sm"
        >
          <Plus className="size-5" strokeWidth={2.5} />
          Create Your First Assignment
        </Button>
      </Link>
    </div>
  );
}
