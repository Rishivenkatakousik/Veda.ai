export function stripLeadingQuestionEnumeration(text: string): string {
  return text.replace(/^\d+\.\s*/, "").trim();
}
