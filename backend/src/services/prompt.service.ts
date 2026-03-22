type QuestionConfigRow = {
    type: string;
    count: number;
    marks: number;
};
type PromptInput = {
    title: string;
    subject: string;
    className: string;
    schoolName: string;
    totalQuestions: number;
    totalMarks: number;
    questionConfig: QuestionConfigRow[];
    instructions: string;
    materialContext?: string;
};
const formatQuestionMatrix = (config: QuestionConfigRow[]): string => config
    .map((row, i) => `  ${i + 1}. ${row.type}: ${row.count} question(s), ${row.marks} mark(s) each`)
    .join("\n");
const JSON_SCHEMA_EXAMPLE = `{
  "header": {
    "schoolName": "...",
    "subject": "...",
    "className": "...",
    "timeAllowed": "... minutes",
    "maxMarks": <number>
  },
  "studentSection": {
    "nameLabel": "Name",
    "rollNumberLabel": "Roll Number",
    "classSectionLabel": "Class / Section"
  },
  "sections": [
    {
      "title": "Section A — Multiple Choice",
      "instructions": "Attempt all questions. Each question carries 1 mark. Choose the correct option.",
      "questions": [
        {
          "text": "Stem only (the question statement, without listing A/B/C/D here)",
          "difficulty": "easy | moderate | challenging",
          "marks": <number>,
          "options": [
            "A) First choice",
            "B) Second choice",
            "C) Third choice",
            "D) Fourth choice"
          ]
        }
      ]
    },
    {
      "title": "Section B",
      "instructions": "Answer in short.",
      "questions": [
        {
          "text": "Full question text here",
          "difficulty": "moderate",
          "marks": <number>
        }
      ]
    }
  ],
  "answerKey": "1. Answer text\\n2. Answer text\\n..."
}`;
export const buildSystemPrompt = (): string => [
    "You are an expert academic question paper generator for schools.",
    "You produce complete, structured question papers in JSON format.",
    "Every question must have a difficulty level: easy, moderate, or challenging.",
    "Distribute difficulty levels across the paper for balanced assessment.",
    "Include a comprehensive answer key covering every question.",
    "",
    "Multiple-choice rules (when the teacher requested Multiple Choice / MCQ):",
    "- Every MCQ MUST include an \"options\" array with exactly four non-empty strings.",
    "- Label them A), B), C), D) at the start of each string (or (A) (B) (C) (D)).",
    "- Put only the stem in \"text\"; do not embed the four choices inside \"text\".",
    "- The answer key must state the correct letter or option for each MCQ (e.g. \"1. B\" or \"1. B) ...\").",
    "",
    "IMPORTANT: Respond ONLY with valid JSON matching the schema below. No markdown, no code fences, no extra text.",
    "",
    "Required JSON schema:",
    JSON_SCHEMA_EXAMPLE
].join("\n");
export const buildUserPrompt = (input: PromptInput): string => {
    const lines: string[] = [
        `Generate a complete question paper with the following details:`,
        ``,
        `School: ${input.schoolName}`,
        `Subject: ${input.subject}`,
        `Class: ${input.className}`,
        `Title: ${input.title}`,
        `Total Questions: ${input.totalQuestions}`,
        `Total Marks: ${input.totalMarks}`,
        ``,
        `Question breakdown:`,
        formatQuestionMatrix(input.questionConfig)
    ];
    if (input.instructions.trim()) {
        lines.push(``, `Additional instructions from the teacher:`, input.instructions);
    }
    if (input.materialContext?.trim()) {
        lines.push(``, input.materialContext.trim());
    }
    lines.push(``, `Requirements:`, `- Create exactly one JSON section per line in "Question breakdown" above, in the same order (first row → sections[0], second row → sections[1], etc.).`, `- Each section must contain exactly the number of questions listed for that row.`, `- For any row whose type is Multiple Choice (or MCQ): every question in that section MUST include an "options" array with exactly four strings (the four answer choices).`, `- Generate exactly the number of questions specified for each type.`, `- Assign marks exactly as specified per question type.`, `- Assign an appropriate difficulty (easy, moderate, or challenging) to each question.`, `- Use clear section titles and instructions (mention multiple choice where applicable).`, `- Provide a complete answer key at the end.`, `- Respond with valid JSON only.`);
    return lines.join("\n");
};
