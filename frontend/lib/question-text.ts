/** Avoids "1. 1. Question..." when the stem already starts with a number. */
export function stripLeadingQuestionEnumeration(text: string): string {
  return text.replace(/^\d+\.\s*/, "").trim();
}
