import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../src/app";
import { env } from "../../src/config/env";
import { AssignmentModel } from "../../src/models/assignment.model";
import * as assignmentSvc from "../../src/services/assignment.service";
import * as pdfSvc from "../../src/services/pdf.service";

const assignmentsBase = `${env.API_PREFIX}/assignments`;

vi.mock("../../src/config/redis", () => ({
  redis: {
    on: vi.fn(),
    ping: vi.fn().mockResolvedValue("PONG"),
    quit: vi.fn()
  },
  standaloneRedisOptions: {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy: (): number => 100
  },
  getRedisHealth: vi.fn().mockResolvedValue({ status: "up", latencyMs: 1 }),
  closeRedis: vi.fn()
}));

vi.mock("../../src/config/queue", () => ({
  assignmentQueue: {
    add: vi.fn().mockResolvedValue({ id: "jid-1" }),
    getJobCounts: vi.fn().mockResolvedValue({
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      paused: 0
    })
  },
  getQueueHealth: vi.fn().mockResolvedValue({
    status: "up",
    waiting: 0,
    active: 0,
    failed: 0,
    delayed: 0,
    paused: 0,
    completed: 0
  }),
  closeQueue: vi.fn()
}));

vi.mock("../../src/services/realtime.service", () => ({
  publishStatusChange: vi.fn().mockResolvedValue(undefined),
  subscribeToStatusChanges: vi.fn(() => ({
    subscribe: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    quit: vi.fn().mockResolvedValue(undefined)
  })),
  closePublisher: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("../../src/services/assignment.service", () => ({
  listAssignments: vi.fn(),
  getAssignmentById: vi.fn(),
  createAssignment: vi.fn(),
  regenerateAssignment: vi.fn(),
  softDeleteAssignment: vi.fn()
}));

vi.mock("../../src/services/pdf.service", () => ({
  generatePdf: vi.fn(),
  getPdfPath: vi.fn()
}));

vi.mock("../../src/models/assignment.model", () => ({
  AssignmentModel: {
    findByIdAndUpdate: vi.fn()
  }
}));

describe("assignment routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/v1/assignments returns envelope and list data", async () => {
    vi.mocked(assignmentSvc.listAssignments).mockResolvedValue({
      items: [{ title: "A", subject: "S", className: "C", schoolName: "Sch" }],
      pagination: { page: 1, limit: 10, totalItems: 1, totalPages: 1 }
    } as never);

    const res = await request(app).get(assignmentsBase);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.totalItems).toBe(1);
  });

  it("GET /api/v1/assignments rejects invalid id param shape via list sort", async () => {
    const res = await request(app).get(`${assignmentsBase}?sort=invalid`);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/assignments/:id returns 404 when missing", async () => {
    vi.mocked(assignmentSvc.getAssignmentById).mockResolvedValue(null);

    const res = await request(app).get(
      `${assignmentsBase}/507f191e810c19729de860ea`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/assignments/:id rejects invalid ObjectId", async () => {
    const res = await request(app).get(`${assignmentsBase}/not-valid-id`);
    expect(res.status).toBe(400);
  });

  it("POST /api/v1/assignments validates body", async () => {
    const res = await request(app).post(assignmentsBase).send({
      title: "ab"
    });
    expect(res.status).toBe(400);
  });

  it("POST /api/v1/assignments creates assignment", async () => {
    vi.mocked(assignmentSvc.createAssignment).mockResolvedValue({
      assignment: {
        _id: { toString: () => "507f191e810c19729de860ea" },
        status: "queued"
      },
      jobId: "jid-1"
    } as never);

    const due = new Date(Date.now() + 86400000).toISOString();
    const res = await request(app)
      .post(assignmentsBase)
      .field("title", "Valid assignment title")
      .field("subject", "Science")
      .field("className", "8")
      .field("schoolName", "Test School")
      .field("dueDate", due)
      .field(
        "questionConfig",
        JSON.stringify([{ type: "MCQ", count: 1, marks: 2 }])
      )
      .field("createdBy", "teacher1");

    expect(res.status).toBe(201);
    expect(res.body.data.assignmentId).toBe("507f191e810c19729de860ea");
    expect(res.body.data.jobId).toBe("jid-1");
  });

  it("DELETE /api/v1/assignments/:id returns 404 when not found", async () => {
    vi.mocked(assignmentSvc.softDeleteAssignment).mockResolvedValue(null);

    const res = await request(app).delete(
      `${assignmentsBase}/507f191e810c19729de860ea`
    );
    expect(res.status).toBe(404);
  });

  it("POST /api/v1/assignments/:id/regenerate returns payload", async () => {
    vi.mocked(assignmentSvc.regenerateAssignment).mockResolvedValue({
      assignment: {
        _id: { toString: () => "507f191e810c19729de860ea" },
        status: "queued"
      },
      jobId: "jid-2"
    } as never);

    const res = await request(app).post(
      `${assignmentsBase}/507f191e810c19729de860ea/regenerate`
    );

    expect(res.status).toBe(200);
    expect(res.body.data.jobId).toBe("jid-2");
  });

  it("POST /api/v1/assignments/:id/pdf persists pdfUrl and returns data", async () => {
    const paper = {
      header: {
        schoolName: "S",
        subject: "Sub",
        className: "C",
        timeAllowed: "1h",
        maxMarks: 10
      },
      studentSection: {
        nameLabel: "Name",
        rollNumberLabel: "Roll",
        classSectionLabel: "Class"
      },
      sections: [
        {
          title: "A",
          instructions: "",
          questions: [
            { text: "Q1", difficulty: "easy" as const, marks: 2 }
          ]
        }
      ],
      answerKey: "1. A"
    };

    vi.mocked(assignmentSvc.getAssignmentById).mockResolvedValue({
      status: "completed",
      title: "T",
      generatedPaper: paper
    } as never);

    vi.mocked(pdfSvc.generatePdf).mockResolvedValue("/tmp/x.pdf");
    vi.mocked(AssignmentModel.findByIdAndUpdate).mockResolvedValue({} as never);

    const res = await request(app).post(
      `${assignmentsBase}/507f191e810c19729de860ea/pdf`
    );

    expect(res.status).toBe(201);
    expect(res.body.data.pdfUrl).toContain(`${env.API_PREFIX}/assignments/`);
    expect(res.body.data.downloadPath).toContain("/pdf");
    expect(AssignmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "507f191e810c19729de860ea",
      expect.objectContaining({ pdfUrl: expect.any(String) })
    );
  });
});
