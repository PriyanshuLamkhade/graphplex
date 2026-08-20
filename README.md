# Graphplex (Perplexity Clone)

An AI-powered search engine and conversational answer platform inspired by Perplexity. Built with **Bun**, **LangGraph**, **Tavily Web Search**, **Prisma**, **Supabase Auth**, and **React**.

---

## 💡 About the Project

**Graphplex** is a full-stack AI answer engine designed to provide accurate, grounded responses to user queries using real-time search and multi-step AI workflows.

### Key Features

- **🌐 Real-Time Web Search:** Uses Tavily Search API to fetch live web data, news, and citations.
- **📄 Context Engineering & Summarization:** Extracts and condenses relevant web content before invoking the language model.
- **🧠 Autonomous LangGraph Workflow:**
  - **Answer Generation:** Generates structured answers backed by citations.
  - **Quality Reviewer & Reflection:** Evaluates answer completeness and triggers dynamic re-generation if quality thresholds aren't met.
  - **Follow-Up Generator:** Automatically generates relevant follow-up questions in parallel.
- **💬 Threaded Context:** Contextualizes follow-up questions using past conversation history.
- **🔐 Auth & Storage:** Secure user authentication powered by Supabase and persistent conversation threads backed by PostgreSQL & Prisma ORM.

---

## ⚡ Tech Stack

- **Runtime & Manager:** [Bun](https://bun.sh)
- **Backend:** Express.js, TypeScript, LangChain / LangGraph, Tavily Search API, Prisma ORM, Supabase
- **Frontend:** React 19, React Router v8, Tailwind CSS v4, Radix UI, Lucide Icons
- **Database:** PostgreSQL (via Supabase / Prisma)

---

## 📂 Project Structure

```
Perplexity/
├── backend/            # Express API, LangGraph agent workflow, Prisma schema
│   ├── prisma/         # Database schema & migrations
│   ├── src/            # Controllers, graph nodes, & routes
│   └── .env.example    # Backend environment variables reference
├── frontend/           # React single-page application
│   ├── src/            # UI components, pages, & API integration
│   └── .env.example    # Frontend environment variables reference
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites

- Install [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash` or `powershell -c "irm bun.sh/install.ps1"`)
- A [Supabase](https://supabase.com) project (for Auth & PostgreSQL)
- A [Tavily Search API](https://tavily.com) key

---

### 2. Environment Setup

Copy `.env.example` files to `.env` in both folders and fill in your credentials.

**Backend (`backend/.env`):**
```env
TAVIL_API_KEY=your_tavily_api_key
GROQ_API_KEY=your_groq_api_key
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
SUPABASE_API_SECRET=your_supabase_secret_key
```

**Frontend (`frontend/.env`):**
```env
BUN_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
BUN_PUBLIC_PUBLISHABLE_KEY=your_supabase_publishable_key
```

---

### 3. Backend Setup

```bash
cd backend
bun install
bunx prisma db push
bun dev
```
*Backend runs at `http://localhost:3001`*

---

### 4. Frontend Setup

```bash
cd frontend
bun install
bun dev
```
*Frontend runs at `http://localhost:3000` (or specified Bun port)*

---

## 📜 Scripts

| Workspace | Command | Action |
|---|---|---|
| **Backend** | `bun dev` | Start Express server with Bun |
| **Backend** | `bunx prisma studio` | Open Prisma database GUI |
| **Frontend** | `bun dev` | Start React dev server with Hot Reload |
| **Frontend** | `bun run build` | Build frontend production bundle |
