# VedaAI Backend Implementation Plan

## Source References

- [d:\assignment\veda\backend\vedaai_backend_prd.md](d:\assignment\veda\backend\vedaai_backend_prd.md)
- [d:\assignment\veda\vedaai_prd.md](d:\assignment\veda\vedaai_prd.md)
- [d:\assignment\veda\images\Screenshot 2026-03-20 192045.png](d:\assignment\veda\images\Screenshot 2026-03-20 192045.png)
- [d:\assignment\veda\images\Screenshot 2026-03-20 192102.png](d:\assignment\veda\images\Screenshot 2026-03-20 192102.png)
- [d:\assignment\veda\images\Screenshot 2026-03-20 192116.png](d:\assignment\veda\images\Screenshot 2026-03-20 192116.png)
- [d:\assignment\veda\images\Screenshot 2026-03-20 192136.png](d:\assignment\veda\images\Screenshot 2026-03-20 192136.png)

## UI-Driven Backend Scope

- Empty dashboard state needs assignment list API that can return an empty array with metadata.
- Filled dashboard state needs assignment listing with pagination/search/filter, card fields, and delete action.
- Create assignment screen needs multipart upload handling, question type matrix, marks/count totals, due date, and instructions storage.
- Assignment output screen needs generated paper payload, summary block, downloadable PDF artifact URL, and regenerate trigger.
- Desktop and mobile parity requires stable, compact response contracts (same payload shape for both clients).

## Phase 1: Backend Foundation

- Initialize `backend` service (Node.js + Express + TypeScript) with modular folders from PRD: `controllers`, `routes`, `services`, `workers`, `queues`, `models`, `websocket`.
- Configure MongoDB, Redis, and BullMQ connections with health checks.
- Add global validation/error middleware and consistent API envelope:
  - `success`, `data`, `error`, `meta`.
- Add env contracts for AI provider, queue settings, file upload limits, and CORS origins.

## Phase 2: Data Model for UI Screens

- Design `Assignment` document with fields required by screens:
  - `title`, `subject`, `className`, `schoolName`
  - `assignedOn`, `dueDate`
  - `questionConfig[]` (`type`, `count`, `marks`)
  - `totalQuestions`, `totalMarks`
  - `instructions`, `materialFiles[]`
  - `status` (`draft`, `queued`, `processing`, `completed`, `failed`)
  - `generatedPaper`, `answerKey`, `pdfUrl`
  - `createdBy`, `createdAt`, `updatedAt`
- Add indexes for:
  - list sorting by `createdAt`/`assignedOn`
  - filter by `status`
  - text search on `title`/`subject`.
- Add validation schemas for create/regenerate/list query parameters.

## Phase 3: Dashboard APIs (Empty + Filled State)

- Implement `GET /assignments`:
  - supports `page`, `limit`, `search`, `status`, `sort`.
  - returns card-friendly fields used by dashboard UI.
- Implement `GET /assignments/:id`:
  - returns full detail for output page and status polling fallback.
- Implement `DELETE /assignments/:id`:
  - soft delete recommended for audit/recovery.
- Implement `POST /assignments`:
  - creates assignment and enqueues generation job.
  - supports optional uploaded material files.

## Phase 4: Create Assignment Backend Flow

- Add multipart upload endpoint support in create API:
  - accepted types from UI copy (image/doc formats), configurable size limits.
- Validate question type rows:
  - must include at least one row
  - each row must have positive `count` and `marks`
  - compute and persist `totalQuestions` and `totalMarks` server-side.
- Persist create request in `queued` state and return `assignmentId` + `jobId`.

## Phase 5: AI Generation Worker and Parsing

- Worker pipeline:
  - fetch assignment job payload
  - build AI prompt from subject/class/question matrix/instructions/material context
  - request structured JSON from AI
  - validate output schema (`header`, `studentSection`, `sections`, `questions`, `difficulty`, `marks`, `answerKey`).
- Save final output to assignment record and move status to `completed`.
- On failures: retry with BullMQ backoff; mark `failed` after max retries with error reason.

## Phase 6: Realtime Status + Regenerate + PDF

- Socket.io events for UI updates:
  - `assignment:queued`
  - `assignment:processing`
  - `assignment:completed`
  - `assignment:failed`
- Add `POST /assignments/:id/regenerate` to enqueue fresh AI job from existing config.
- Add PDF generation flow:
  - `POST /assignments/:id/pdf` create artifact from generated paper
  - `GET /assignments/:id/pdf` return signed URL/stream metadata.

## Phase 7: Hardening and Release Checklist

- Tests:
  - route validation tests for create/list/delete/regenerate/pdf
  - queue-worker integration tests for success/failure/retry
  - schema parser tests against malformed AI outputs.
- Operational readiness:
  - structured logging with request/job correlation IDs
  - metrics for queue depth, processing time, failure rates
  - Redis disconnect recovery handling
  - rate limiting and payload size protection.
- Deployment:
  - separate API and worker processes
  - managed MongoDB + Redis
  - env-driven config for staging/production.

## Delivery Milestones (Backend Only)

- Milestone 1: Phases 1-3 (dashboard and create APIs ready).
- Milestone 2: Phases 4-5 (AI generation working end to end).
- Milestone 3: Phases 6-7 (realtime, regenerate, PDF, production hardening).
