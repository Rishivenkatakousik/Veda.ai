# VedaAI – Frontend PRD

## 1. Overview
Frontend handles:
- Assignment creation UI
- State management
- API integration
- Real-time updates
- Rendering structured output

---

## 2. Responsibilities
- Form handling + validation
- Dynamic UI (question builder)
- API calls (React Query)
- WebSocket updates
- Rendering AI output

---

## 3. Architecture
App Layer → Pages → Modules → Components → State → Services

---

## 4. Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state)
- React Query (API calls + caching)
- Socket.io client (WebSocket)
- Zod (validation)

---

## 5. Why React Query
- Handles API caching
- Built-in loading/error states
- Simplifies async data flow
- Reduces manual state handling

---

## 6. Folder Structure
frontend/
 ├── app/
 ├── components/
 ├── store/
 ├── services/
 ├── hooks/
 ├── lib/
 ├── types/

---

## 7. Data Flow
1. Form → Zustand
2. Validate → Zod
3. Submit → React Query mutation
4. Backend → Queue
5. WebSocket → Update UI

---

## 8. Key Modules
- Dashboard
- Create Assignment
- Output Page
- WebSocket Listener

---

## 9. Edge Cases
- Empty state
- Invalid input
- WebSocket disconnect

---

## 10. Conclusion
Frontend ensures:
- Clean UI
- Real-time updates
- Scalable architecture
