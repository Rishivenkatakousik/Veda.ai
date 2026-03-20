type QuestionConfigRow = { type: string; count: number; marks: number };

type PromptInput = {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  totalQuestions: number;
  totalMarks: number;
  questionConfig: QuestionConfigRow[];
  instructions: string;
};

const formatQuestionMatrix = (config: QuestionConfigRow[]): string =>
  config
    .map(
      (row, i) =>
        `  ${i + 1}. ${row.type}: ${row.count} question(s), ${row.marks} mark(s) each`
    )
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
      "title": "Section A",
      "instructions": "Attempt all questions. Each question carries 2 marks.",
      "questions": [
        {
          "text": "Full question text here",
          "difficulty": "easy | moderate | challenging",
          "marks": <number>
        }
      ]
    }
  ],
  "answerKey": "1. Answer text\\n2. Answer text\\n..."
}`;

export const buildSystemPrompt = (): string =>
  [
    "You are an expert academic question paper generator for schools.",
    "You produce complete, structured question papers in JSON format.",
    "Every question must have a difficulty level: easy, moderate, or challenging.",
    "Distribute difficulty levels across the paper for balanced assessment.",
    "Include a comprehensive answer key covering every question.",
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

  lines.push(
    ``,
    `Requirements:`,
    `- Generate exactly the number of questions specified for each type.`,
    `- Assign marks exactly as specified per question type.`,
    `- Assign an appropriate difficulty (easy, moderate, or challenging) to each question.`,
    `- Group questions into logical sections with clear instructions.`,
    `- Provide a complete answer key at the end.`,
    `- Respond with valid JSON only.`
  );

  return lines.join("\n");
};
