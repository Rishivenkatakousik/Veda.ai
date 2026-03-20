import { describe, expect, it } from "vitest";
import {
  createAssignmentSchema,
  listAssignmentsSchema,
  assignmentByIdSchema,
  regenerateAssignmentSchema
} from "../../src/validators/assignment.validator";

describe("createAssignmentSchema", () => {
  const validBody = {
    title: "Quiz on Electricity",
    subject: "Science",
    className: "8th",
    schoolName: "Delhi Public School",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    questionConfig: [
      { type: "Multiple Choice", count: 5, marks: 1 },
      { type: "Short Answer", count: 3, marks: 2 }
    ],
    createdBy: "teacher1"
  };

  it("accepts a valid create payload", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: validBody
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const { title: _, ...rest } = validBody;
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: rest
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty questionConfig", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: { ...validBody, questionConfig: [] }
    });
    expect(result.success).toBe(false);
  });

  it("rejects questionConfig with zero count", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: {
        ...validBody,
        questionConfig: [{ type: "MCQ", count: 0, marks: 1 }]
      }
    });
    expect(result.success).toBe(false);
  });

  it("rejects questionConfig with negative marks", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: {
        ...validBody,
        questionConfig: [{ type: "MCQ", count: 5, marks: -2 }]
      }
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate question types", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: {
        ...validBody,
        questionConfig: [
          { type: "MCQ", count: 5, marks: 1 },
          { type: "mcq", count: 3, marks: 2 }
        ]
      }
    });
    expect(result.success).toBe(false);
  });

  it("parses questionConfig from JSON string (multipart)", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: {
        ...validBody,
        questionConfig: JSON.stringify(validBody.questionConfig)
      }
    });
    expect(result.success).toBe(true);
  });

  it("rejects title shorter than 3 characters", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: { ...validBody, title: "ab" }
    });
    expect(result.success).toBe(false);
  });

  it("defaults instructions to empty string", () => {
    const result = createAssignmentSchema.safeParse({
      params: {},
      query: {},
      body: validBody
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.instructions).toBe("");
    }
  });
});

describe("listAssignmentsSchema", () => {
  it("applies defaults for missing query params", () => {
    const result = listAssignmentsSchema.safeParse({
      params: {},
      body: {},
      query: {}
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query.page).toBe(1);
      expect(result.data.query.limit).toBe(10);
      expect(result.data.query.sort).toBe("-createdAt");
    }
  });

  it("rejects page < 1", () => {
    const result = listAssignmentsSchema.safeParse({
      params: {},
      body: {},
      query: { page: 0 }
    });
    expect(result.success).toBe(false);
  });

  it("rejects limit > 100", () => {
    const result = listAssignmentsSchema.safeParse({
      params: {},
      body: {},
      query: { limit: 200 }
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid status filter", () => {
    const result = listAssignmentsSchema.safeParse({
      params: {},
      body: {},
      query: { status: "completed" }
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status filter", () => {
    const result = listAssignmentsSchema.safeParse({
      params: {},
      body: {},
      query: { status: "invalid" }
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid sort field", () => {
    const result = listAssignmentsSchema.safeParse({
      params: {},
      body: {},
      query: { sort: "name" }
    });
    expect(result.success).toBe(false);
  });
});

describe("assignmentByIdSchema", () => {
  it("accepts a valid 24-char hex id", () => {
    const result = assignmentByIdSchema.safeParse({
      body: {},
      query: {},
      params: { id: "507f1f77bcf86cd799439011" }
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short id", () => {
    const result = assignmentByIdSchema.safeParse({
      body: {},
      query: {},
      params: { id: "abc123" }
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-hex characters", () => {
    const result = assignmentByIdSchema.safeParse({
      body: {},
      query: {},
      params: { id: "507f1f77bcf86cd79943901z" }
    });
    expect(result.success).toBe(false);
  });
});

describe("regenerateAssignmentSchema", () => {
  it("accepts a valid id", () => {
    const result = regenerateAssignmentSchema.safeParse({
      body: {},
      query: {},
      params: { id: "507f1f77bcf86cd799439011" }
    });
    expect(result.success).toBe(true);
  });
});
