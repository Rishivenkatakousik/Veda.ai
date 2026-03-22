import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex min-h-[calc(100dvh-14rem)] w-full flex-1 flex-col sm:min-h-[calc(100dvh-13rem)] lg:min-h-[calc(100dvh-7rem)]">
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-200/70 bg-[#f5f5f5] text-center shadow-sm">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:py-12">
          <div className="flex w-full max-w-md flex-col items-center sm:max-w-lg">
            <div className="mb-5 flex w-full justify-center sm:mb-6">
              <Image
                src="/Illustrations.png"
                alt=""
                width={280}
                height={213}
                className="h-auto w-full max-w-[200px] object-contain sm:max-w-[240px]"
                priority
              />
            </div>

            <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 sm:mb-4 sm:text-[1.75rem]">
              No assignments yet
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
              Create your first assignment to start collecting and grading student
              submissions. You can set up rubrics, define marking criteria, and let
              AI assist with grading.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 justify-center px-4 pb-[max(9.5rem,env(safe-area-inset-bottom)+8.5rem)] pt-2 sm:px-6 lg:pb-8">
          <Link href="/assignments/create" className="w-full max-w-sm sm:w-auto">
            <Button
              size="lg"
              className="h-12 w-full gap-2 rounded-full bg-neutral-900 px-8 text-base font-medium text-white shadow-sm hover:bg-neutral-800 sm:w-auto"
            >
              <Plus className="size-4" strokeWidth={2.5} /> Create Your First Assignment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
