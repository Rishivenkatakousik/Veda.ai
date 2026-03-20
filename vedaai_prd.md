# VedaAI – Product Requirements Document (PRD)

## 1. Product Overview
VedaAI is an AI-powered platform that enables teachers to:
- Create structured assignments  
- Generate complete question papers using AI  
- View, manage, and download assignments  
- Receive real-time generation updates  

---

## 2. Key User Flow
1. Dashboard (empty / list view)  
2. Create Assignment  
3. Fill details + question config  
4. Submit → AI generation starts  
5. View generated paper  

---

## 3. Features

### 3.1 Dashboard
- Assignment cards (title, dates)
- Actions: View, Delete
- Empty + Filled states

---

### 3.2 Create Assignment
- File upload (optional)
- Due date picker
- Dynamic question builder
- Auto calculation (marks/questions)
- Additional instructions
- Validation

---

### 3.3 Output Page
- Header (school, subject, class)
- Student info section
- Sections with questions
- Difficulty badges
- PDF download + regenerate

---

## 4. Architecture
Frontend → API → Queue → Worker → AI → DB → WebSocket → Frontend

---

## 5. Tech Stack
Frontend: Next.js, TypeScript, Zustand, Tailwind  
Backend: Node.js, Express, TypeScript  
Database: MongoDB  
Queue: Redis + BullMQ  
AI: GPT/Claude  

---

## 6. Key Decisions
- Queue for async processing  
- WebSockets for real-time updates  
- JSON structured AI output  
- MongoDB for flexibility  

---

## 7. Data Flow
1. Submit form  
2. API stores + queues job  
3. Worker processes AI  
4. Store result  
5. Notify via WebSocket  

---

## 8. Data Model
{
  "title": "Quiz",
  "sections": [
    {
      "title": "Section A",
      "questions": [
        {
          "text": "Question",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ]
}

---

## 9. Bonus
- PDF export  
- Regenerate  
- UI polish  
