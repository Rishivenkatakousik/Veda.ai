import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn()
}));

vi.mock("../../src/config/queue", () => ({
  assignmentQueue: {
    add: vi.fn().mockResolvedValue({ id: "job-99" })
  },
  getQueueHealth: vi.fn(),
  closeQueue: vi.fn()
}));

vi.mock("../../src/services/realtime.service", () => ({
  publishStatusChange: vi.fn().mockResolvedValue(undefined),
  subscribeToStatusChanges: vi.fn(),
  closePublisher: vi.fn()
}));

vi.mock("../../src/models/assignment.model", () => ({
  AssignmentModel: {
    create: mockCreate
  }
}));

import { assignmentQueue } from "../../src/config/queue";
import { createAssignment } from "../../src/services/assignment.service";
import { publishStatusChange } from "../../src/services/realtime.service";

describe("createAssignment enqueue + realtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({
      _id: { toString: () => "507f191e810c19729de860ea" },
      status: "queued"
    });
  });

  it("adds BullMQ job with correlationId and publishes queued", async () => {
    await createAssignment({
      title: "Quiz",
      subject: "Math",
      className: "7",
      schoolName: "Central",
      dueDate: new Date(Date.now() + 3600_000),
      questionConfig: [{ type: "Short", count: 2, marks: 3 }],
      createdBy: "t1",
      correlationId: "req-corr-1"
    });

    expect(assignmentQueue.add).toHaveBeenCalledWith(
      "assignment-generate",
      {
        assignmentId: "507f191e810c19729de860ea",
        correlationId: "req-corr-1"
      },
      expect.objectContaining({
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 }
      })
    );

    expect(publishStatusChange).toHaveBeenCalledWith(
      "507f191e810c19729de860ea",
      "queued"
    );
  });
});
