# VedaAI – Backend PRD

## 1. Overview
Backend is responsible for:
- Handling API requests
- Managing async AI generation
- Storing assignments
- Sending real-time updates

---

## 2. Responsibilities
- REST API endpoints
- Queue-based job processing
- AI prompt generation + parsing
- Database operations
- WebSocket communication

---

## 3. Architecture
Client → API → Queue → Worker → AI → DB → WebSocket → Client

---

## 4. Tech Stack
- Node.js + Express (TypeScript)
- MongoDB (database)
- Redis (caching + queue)
- BullMQ (job processing)
- Socket.io (WebSocket)
- OpenAI / Claude (AI)

---

## 5. Why BullMQ
- Handles async processing
- Supports retries
- Prevents API blocking

---

## 6. Folder Structure
backend/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── services/
 │   ├── workers/
 │   ├── queues/
 │   ├── models/
 │   ├── websocket/
 │   └── app.ts

---

## 7. API Endpoints
- POST /assignment → create + queue job
- GET /assignment/:id → fetch result
- DELETE /assignment/:id

---

## 8. Data Flow
1. Request received
2. Save assignment
3. Add job to queue
4. Worker processes AI
5. Save result
6. Emit WebSocket event

---

## 9. Data Model
{
  "title": "Quiz",
  "sections": [...],
  "status": "pending | completed"
}

---

## 10. Edge Cases
- AI failure → retry
- Invalid JSON → reprocess
- Redis disconnect

---

## 11. Conclusion
Backend ensures:
- Scalability (queue-based)
- Reliability (structured output)
- Real-time updates
