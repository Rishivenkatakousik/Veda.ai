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
export const buildSystemPrompt = (hasMaterialContext: boolean): string => {
    const baseInstructions = [
        "You are an expert academic question paper generator for schools.",
        "You produce complete, structured question papers in JSON format.",
        "Every question must have a difficulty level: easy, moderate, or challenging.",
        "Distribute difficulty levels across the paper for balanced assessment.",
        "Include a comprehensive answer key covering every question."
    ];

    const materialInstructions = hasMaterialContext ? [
        "",
        "===================================================================================",
        "STRICT CONSTRAINT - ONLY USE PROVIDED REFERENCE MATERIALS",
        "===================================================================================",
        "",
        "When reference materials are provided, you MUST generate questions based ONLY on that content.",
        "EVERY question must be derived from the provided reference materials.",
        "DO NOT use any outside knowledge, prior training data, or external information.",
        "DO NOT create questions about topics not covered in the reference materials.",
        "If the material does not contain enough information for a question, create a different question.",
        "If you cannot generate enough questions from the material alone, create fewer questions.",
        "BETTER TO FEWER QUESTIONS FROM SOURCE MATERIAL THAN INCORRECT QUESTIONS FROM OUTSIDE.",
        "",
        "Check each question: Is this directly supported by the reference materials? If no, discard it.",
        "All concepts, facts, formulas, examples, and terms in questions must appear in the materials.",
        "",
        "==================================================================================="
    ] : [];

    const mcqInstructions = [
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
    ];

    return [...baseInstructions, ...materialInstructions, ...mcqInstructions].join("\n");
};
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

    // Add reference materials section with explicit instructions
    if (input.materialContext?.trim()) {
        lines.push(``, "=== REFERENCE MATERIAL ===");
        lines.push("The following materials are provided by the teacher as the ONLY source for questions:");
        lines.push("");
        lines.push(input.materialContext.trim());
        lines.push("");
        lines.push("===================================================================================");
        lines.push("CRITICAL CONSTRAINT - QUESTIONS MUST BE BASED SOLELY ON THE ABOVE MATERIAL");
        lines.push("===================================================================================");
        lines.push("");
        lines.push("You MUST read and understand the reference materials above.");
        lines.push("Generate questions that test understanding of the EXACT content provided.");
        lines.push("DO NOT create questions about topics not mentioned in the reference materials.");
        lines.push("DO NOT use external knowledge, training data, or assumptions.");
        lines.push("EVERY question must be answerable using ONLY the information in the materials above.");
        lines.push("If the materials don't cover a topic needed for a question, ask a different question.");
        lines.push("");
        lines.push("Prohibited examples (assuming material is about Work, Power, Force):");
        lines.push("  ❌ Question about Light, Sound, Electricity (not in material)");
        lines.push("  ❌ Question about Newton's Laws (unless explicitly covered in material)");
        lines.push("  ✅ Question about the formula W = F × d (if in material)");
        lines.push("  ✅ Question about power calculation examples (if in material)");
        lines.push("");
    }

    if (input.instructions.trim()) {
        lines.push(``, `Additional instructions from the teacher:`, input.instructions);
    }

    lines.push(``, `Requirements:`);

    // Primary source instruction depends on whether material is provided
    if (input.materialContext?.trim()) {
        lines.push("===================================================================================");
        lines.push("STRICT REQUIREMENTS - ONLY VALID WHEN USING PROVIDED MATERIALS");
        lines.push("===================================================================================");
        lines.push("");
        lines.push("- PRIMARY SOURCE: Generate questions BASED ONLY on the provided reference materials.");
        lines.push("- EVERY question must be directly derived from the materials above.");
        lines.push("- DO NOT use or reference any topic/concept not present in the materials.");
        lines.push("- Answer choices in MCQ must also come from or be based on the materials.");
        lines.push("- All formulas, definitions, and explanations must be FROM the materials.");
        lines.push("- If materials contain examples, create questions testing those examples.");
        lines.push("");
        lines.push("FINAL CHECK before submitting:");
        lines.push("  1. Did I read ALL the reference materials?");
        lines.push("  2. Is EACH question about something explicitly covered in the materials?");
        lines.push("  3. Can the answer be found ONLY in the materials?");
        lines.push("  4. Did I avoid any topics/concepts not mentioned in the materials?");
        lines.push("");
    } else {
        lines.push("- PRIMARY SOURCE: Create relevant questions based on the subject and topic.");
    }

    lines.push("- Create exactly one JSON section per line in \"Question breakdown\" above, in the same order (first row → sections[0], second row → sections[1], etc.).");
    lines.push("- Each section must contain exactly the number of questions listed for that row.");
    lines.push("- For any row whose type is Multiple Choice (or MCQ): every question in that section MUST include an \"options\" array with exactly four strings (the four answer choices).");
    lines.push("- Generate exactly the number of questions specified for each type.");
    lines.push("- Assign marks exactly as specified per question type.");
    lines.push("- Assign an appropriate difficulty (easy, moderate, or challenging) to each question.");
    lines.push("- Use clear section titles and instructions (mention multiple choice where applicable).");
    lines.push("- Provide a complete answer key at the end.");
    lines.push("- Respond with valid JSON only.");

    return lines.join("\n");
};
