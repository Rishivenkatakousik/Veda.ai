import {
  Home,
  Users,
  FileText,
  Sparkles,
  Library,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const QUESTION_TYPES = [
  "Multiple Choice",
  "Short Questions",
  "Diagram/Graph-Based",
  "Numerical Problems",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const ASSIGNMENT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Users, label: "My Groups", href: "/groups" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: Sparkles, label: "AI Teacher's Toolkit", href: "/toolkit" },
  { icon: Library, label: "My Library", href: "/library" },
];

export const SETTINGS_NAV: NavItem = {
  icon: Settings,
  label: "Settings",
  href: "/settings",
};

export const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_UPLOAD_FILES = 5;
