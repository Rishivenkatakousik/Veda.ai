import { describe, expect, it } from "vitest";
import {
  assertMcqOptionsForConfig,
  generatedPaperSchema,
  isMcqQuestionType
} from "../../src/validators/generated-paper.validator";

const validPaper = {
  header: {
    schoolName: "Delhi Public School",
    subject: "Science",
    className: "8th",
    timeAllowed: "45 minutes",
    maxMarks: 20
  },
  studentSection: {
    nameLabel: "Name",
    rollNumberLabel: "Roll Number",
    classSectionLabel: "Class / Section"
  },
  sections: [
    {
      title: "Section A",
      instructions: "Answer all questions.",
      questions: [
        { text: "What is electrolysis?", difficulty: "easy", marks: 2 },
        { text: "Explain Ohm's law.", difficulty: "moderate", marks: 2 }
      ]
    }
  ],
  answerKey: "1. Electrolysis is...\n2. Ohm's law states..."
};

describe("generatedPaperSchema", () => {
  it("accepts a fully valid generated paper", () => {
    const result = generatedPaperSchema.safeParse(validPaper);
    expect(result.success).toBe(true);
  });

  it("applies defaults for missing optional fields", () => {
    const minimal = {
      header: {
        schoolName: "Test School"
      },
      sections: [
        {
          title: "Section A",
          questions: [
            { text: "Q1?", marks: 1 }
          ]
        }
      ]
    };
    const result = generatedPaperSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.header.timeAllowed).toBe("");
      expect(result.data.header.maxMarks).toBe(0);
      expect(result.data.studentSection.nameLabel).toBe("Name");
      expect(result.data.answerKey).toBe("");
      expect(result.data.sections[0].questions[0].difficulty).toBe("moderate");
    }
  });

  it("rejects paper with no sections", () => {
    const result = generatedPaperSchema.safeParse({
      ...validPaper,
      sections: []
    });
    expect(result.success).toBe(false);
  });

  it("rejects section with no questions", () => {
    const result = generatedPaperSchema.safeParse({
      ...validPaper,
      sections: [{ title: "Section A", instructions: "", questions: [] }]
    });
    expect(result.success).toBe(false);
  });

  it("rejects question with empty text", () => {
    const result = generatedPaperSchema.safeParse({
      ...validPaper,
      sections: [
        {
          title: "Section A",
          questions: [{ text: "", difficulty: "easy", marks: 2 }]
        }
      ]
    });
    expect(result.success).toBe(false);
  });

  it("rejects question with zero marks", () => {
    const result = generatedPaperSchema.safeParse({
      ...validPaper,
      sections: [
        {
          title: "Section A",
          questions: [{ text: "Q1?", difficulty: "easy", marks: 0 }]
        }
      ]
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid difficulty level", () => {
    const result = generatedPaperSchema.safeParse({
      ...validPaper,
      sections: [
        {
          title: "Section A",
          questions: [{ text: "Q1?", difficulty: "hard", marks: 2 }]
        }
      ]
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid difficulty levels", () => {
    for (const difficulty of ["easy", "moderate", "challenging"]) {
      const result = generatedPaperSchema.safeParse({
        ...validPaper,
        sections: [
          {
            title: "Section A",
            questions: [{ text: "Q1?", difficulty, marks: 2 }]
          }
        ]
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects completely malformed input", () => {
    expect(generatedPaperSchema.safeParse("not json").success).toBe(false);
    expect(generatedPaperSchema.safeParse(null).success).toBe(false);
    expect(generatedPaperSchema.safeParse(42).success).toBe(false);
    expect(generatedPaperSchema.safeParse({}).success).toBe(false);
  });

  it("rejects sections that are not an array (malformed AI output)", () => {
    const result = generatedPaperSchema.safeParse({
      header: validPaper.header,
      sections: "Section A only",
      answerKey: ""
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing header", () => {
    const { header: _, ...rest } = validPaper;
    const result = generatedPaperSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("coerces string marks to number", () => {
    const result = generatedPaperSchema.safeParse({
      ...validPaper,
      sections: [
        {
          title: "Section A",
          questions: [{ text: "Q1?", difficulty: "easy", marks: "3" }]
        }
      ]
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sections[0].questions[0].marks).toBe(3);
    }
  });

  it("accepts questions with options array", () => {
    const result = generatedPaperSchema.safeParse({
      ...validPaper,
      sections: [
        {
          title: "MCQ",
          questions: [
            {
              text: "What is 2+2?",
              difficulty: "easy",
              marks: 1,
              options: ["A) 3", "B) 4", "C) 5", "D) 6"]
            }
          ]
        }
      ]
    });
    expect(result.success).toBe(true);
  });
});

describe("isMcqQuestionType", () => {
  it("detects Multiple Choice from UI", () => {
    expect(isMcqQuestionType("Multiple Choice")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isMcqQuestionType("multiple choice")).toBe(true);
  });
});

describe("assertMcqOptionsForConfig", () => {
  const basePaper = {
    header: validPaper.header,
    studentSection: validPaper.studentSection,
    answerKey: "1. B"
  };

  it("throws when MCQ section lacks options", () => {
    const paper = generatedPaperSchema.parse({
      ...basePaper,
      sections: [
        {
          title: "A",
          instructions: "",
          questions: [{ text: "Q?", difficulty: "easy", marks: 1 }]
        }
      ]
    });
    expect(() =>
      assertMcqOptionsForConfig(paper, [
        { type: "Multiple Choice", count: 1, marks: 1 }
      ])
    ).toThrow(/options/);
  });

  it("passes when MCQ has four options", () => {
    const paper = generatedPaperSchema.parse({
      ...basePaper,
      sections: [
        {
          title: "A",
          instructions: "",
          questions: [
            {
              text: "Q?",
              difficulty: "easy",
              marks: 1,
              options: ["A) 1", "B) 2", "C) 3", "D) 4"]
            }
          ]
        }
      ]
    });
    expect(() =>
      assertMcqOptionsForConfig(paper, [
        { type: "Multiple Choice", count: 1, marks: 1 }
      ])
    ).not.toThrow();
  });

  it("throws when section count mismatches question config", () => {
    const paper = generatedPaperSchema.parse({
      ...basePaper,
      sections: [
        {
          title: "A",
          instructions: "",
          questions: [
            {
              text: "Q?",
              difficulty: "easy",
              marks: 1,
              options: ["A) 1", "B) 2", "C) 3", "D) 4"]
            }
          ]
        }
      ]
    });
    expect(() =>
      assertMcqOptionsForConfig(paper, [
        { type: "Multiple Choice", count: 1, marks: 1 },
        { type: "Short Questions", count: 1, marks: 2 }
      ])
    ).toThrow(/section/);
  });
});
