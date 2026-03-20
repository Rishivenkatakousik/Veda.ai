import { describe, expect, it } from "vitest";
import {
  buildSystemPrompt,
  buildUserPrompt
} from "../../src/services/prompt.service";

describe("buildSystemPrompt", () => {
  it("returns a non-empty string", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes the JSON schema example", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain('"header"');
    expect(prompt).toContain('"sections"');
    expect(prompt).toContain('"answerKey"');
    expect(prompt).toContain('"difficulty"');
  });

  it("instructs JSON-only response", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.toLowerCase()).toContain("respond only with valid json");
  });
});

describe("buildUserPrompt", () => {
  const input = {
    title: "Quiz on Electricity",
    subject: "Science",
    className: "8th",
    schoolName: "Delhi Public School",
    totalQuestions: 10,
    totalMarks: 20,
    questionConfig: [
      { type: "Multiple Choice", count: 5, marks: 1 },
      { type: "Short Answer", count: 5, marks: 3 }
    ],
    instructions: ""
  };

  it("includes school, subject, class, and title", () => {
    const prompt = buildUserPrompt(input);
    expect(prompt).toContain("Delhi Public School");
    expect(prompt).toContain("Science");
    expect(prompt).toContain("8th");
    expect(prompt).toContain("Quiz on Electricity");
  });

  it("includes question type breakdown", () => {
    const prompt = buildUserPrompt(input);
    expect(prompt).toContain("Multiple Choice");
    expect(prompt).toContain("5 question(s)");
    expect(prompt).toContain("Short Answer");
    expect(prompt).toContain("3 mark(s) each");
  });

  it("includes total questions and marks", () => {
    const prompt = buildUserPrompt(input);
    expect(prompt).toContain("Total Questions: 10");
    expect(prompt).toContain("Total Marks: 20");
  });

  it("omits instructions section when empty", () => {
    const prompt = buildUserPrompt(input);
    expect(prompt).not.toContain("Additional instructions from the teacher:");
  });

  it("includes instructions when provided", () => {
    const prompt = buildUserPrompt({
      ...input,
      instructions: "Focus on chapter 5"
    });
    expect(prompt).toContain("Additional instructions from the teacher:");
    expect(prompt).toContain("Focus on chapter 5");
  });
});
