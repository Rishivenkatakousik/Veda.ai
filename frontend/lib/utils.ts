import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  pattern: string = "dd-MM-yyyy",
): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}
