# Kando • Tactile Fullstack Kanban Project Manager

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Kando** is a modern, lightweight, and human-crafted project management application inspired by Linear and modern Trello. Built with **Next.js 15 (App Router)**, **Supabase PostgreSQL**, **Clerk Authentication & Billing**, and **@dnd-kit**, it offers a tactile, keyboard-friendly workflow without enterprise clutter.

---

## ⚡ Highlights & Features

- **🗂️ Interactive Kanban Canvas**:
  - Smooth physics-based drag-and-drop powered by `@dnd-kit` (reorder tasks within columns or across stages).
  - Column-targeted task creation (add tasks directly into any stage: To Do, In Progress, Review, Done).
  - Custom column workflow: add, rename, and organize columns dynamically.

- **🎯 Priority & Due Date Intelligence**:
  - Color-coded priority badges with contextual icons (🔥 High, ⚡ Medium, 🌱 Low).
  - Assignee avatar tags with initials and formatted due date indicators.

- **🔍 1-Click Board Filtering & Search**:
  - Inline search bar for real-time task title, description, and assignee lookup.
  - One-click priority filter pills directly in the board header bar.
  - Date and keyword filters with active filter badge counters.

- **📊 Workspace Dashboard**:
  - Health metrics: Total Boards, Active Projects, 7-Day Velocity, and Plan Status.
  - 1-Click starter templates: *Sprint Backlog*, *Product Roadmap*, *Content Calendar*, *Bug Tracker*.
  - Color theme presets for boards (Indigo, Emerald, Amber, Rose, Violet, Sky, Teal, Zinc).
  - Switchable Grid and Compact List views.

- **🔐 Enterprise-Grade Auth & Multi-Tier Plans**:
  - Complete authentication powered by Clerk (Google, GitHub, Email magic links).
  - Subscription tier gating (Free plan vs. Pro / Enterprise unlimited boards) with integrated `<PricingTable />`.

- **🛡️ Secure Row-Level Security (RLS)**:
  - Supabase PostgreSQL database protected by strict RLS policies ensuring users can only read, write, and modify their own boards and tasks.

- **🎨 Handcrafted Modern UI**:
  - Tailwind CSS v4 with bespoke `oklch` warm neutrals and layered micro-shadows.
  - Accessible Radix UI primitives with smooth focus rings and custom slim scrollbars.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack, Server & Client Components) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4, PostCSS, Class Variance Authority (CVA), clsx, tailwind-merge |
| **Icons** | Lucide React |
| **UI Primitives** | Radix UI (Dialog, Select, Label, Slot) |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Database** | Supabase (PostgreSQL with Row Level Security & Indexes) |
| **Authentication** | Clerk (`@clerk/nextjs` v6) |

---

## 📁 Project Structure

```text
├── app/
│   ├── layout.tsx            # Global Root Layout with ClerkProvider & SupabaseProvider
│   ├── globals.css           # Tailwind v4 import, oklch theme variables, scrollbar styles
│   ├── page.tsx              # Public SaaS landing page with hero mockup & feature pillars
│   ├── pricing/
│   │   └── page.tsx          # Pricing table & FAQ page
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard plan authorization provider
│   │   └── page.tsx          # Workspace dashboard (stats, templates, board grid/list)
│   └── boards/
│       └── [id]/
│           └── page.tsx      # Core Kanban board (DnD columns, tasks, filters, inline edit)
├── components/
│   ├── navbar.tsx            # Responsive dynamic navigation (Public, Dashboard, Board modes)
│   └── ui/                   # Reusable Radix UI components (button, card, dialog, input, etc.)
├── lib/
│   ├── services.ts           # Supabase data layer services (boards, columns, tasks)
│   ├── utils.ts              # Class name merging utility (cn)
│   ├── contexts/
│   │   └── PlanContext.tsx   # React context for subscription tier management
│   ├── hooks/
│   │   └── useBoards.ts      # Custom hooks for board state, CRUD, and DnD reordering
│   └── supabase/
│       ├── models.ts         # TypeScript definitions for Board, Column, Task
│       ├── server.ts         # Server-side Supabase client with cookie forwarding
│       └── SupabaseProvider.tsx # Client-side Supabase context with Clerk JWT token syncing
├── middleware.ts             # Clerk authentication route matcher
├── .env.example              # Template environment variables
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript compiler options
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18.18 or later
- **npm**, **pnpm**, or **yarn**
- A free [Clerk](https://clerk.com/) account
- A free [Supabase](https://supabase.com/) project

### 2. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/trello-clone-fullstack.git
cd trello-clone-fullstack
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory by copying the example:

```bash
cp .env.example .env.local
```

Fill in your Clerk and Supabase credentials in `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Redirect Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 🗄️ Supabase Database Setup

1. Open your project on the [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor** tab.
3. Paste and run the following SQL script to create the schema, tables, triggers, and Row Level Security (RLS) policies:

```sql
-- =========================================================
-- 0. Helper: Extract requesting user's Clerk ID from JWT
-- =========================================================
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS text AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  )::text;
$$ LANGUAGE SQL STABLE;

-- =========================================================
-- 1. Tables: Boards, Columns, and Tasks
-- =========================================================

-- Boards Table
CREATE TABLE IF NOT EXISTS public.boards (
  id          bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  title       text NOT NULL,
  description text,
  color       text DEFAULT 'bg-indigo-500',
  user_id     text NOT NULL
);

-- Columns Table
CREATE TABLE IF NOT EXISTS public.columns (
  id          bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  board_id    bigint NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  title       text NOT NULL,
  sort_order  int4 NOT NULL DEFAULT 0,
  user_id     text NOT NULL
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id          bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  title       text NOT NULL,
  description text,
  assignee    text,
  due_date    date,
  priority    text DEFAULT 'medium',
  sort_order  int4 NOT NULL DEFAULT 0,
  column_id   bigint NOT NULL REFERENCES public.columns(id) ON DELETE CASCADE
);

-- Automated updated_at trigger for boards
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_boards_updated_at ON public.boards;
CREATE TRIGGER trg_boards_updated_at
BEFORE UPDATE ON public.boards
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_boards_user_id   ON public.boards(user_id);
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON public.columns(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column_id  ON public.tasks(column_id);

-- =========================================================
-- 2. Enable Row Level Security (RLS)
-- =========================================================
ALTER TABLE public.boards  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks   ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 3. Row Level Security Policies
-- =========================================================

-- Boards Policies
CREATE POLICY "Users can view their own boards"
  ON public.boards FOR SELECT
  USING (user_id = requesting_user_id()::text);

CREATE POLICY "Users can insert their own boards"
  ON public.boards FOR INSERT
  WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own boards"
  ON public.boards FOR UPDATE
  USING (user_id = requesting_user_id())
  WITH CHECK (user_id = requesting_user_id());

CREATE POLICY "Users can delete their own boards"
  ON public.boards FOR DELETE
  USING (user_id = requesting_user_id());

-- Columns Policies
CREATE POLICY "Users can view columns from their own boards"
  ON public.columns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = columns.board_id
        AND boards.user_id = requesting_user_id()
    )
  );

CREATE POLICY "Users can insert columns into their own boards"
  ON public.columns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = columns.board_id
        AND boards.user_id = requesting_user_id()
    )
  );

CREATE POLICY "Users can update columns from their own boards"
  ON public.columns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = columns.board_id
        AND boards.user_id = requesting_user_id()
    )
  );

CREATE POLICY "Users can delete columns from their own boards"
  ON public.columns FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = columns.board_id
        AND boards.user_id = requesting_user_id()
    )
  );

-- Tasks Policies
CREATE POLICY "Users can view tasks from their own boards"
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.columns
      JOIN public.boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
        AND boards.user_id = requesting_user_id()
    )
  );

CREATE POLICY "Users can insert tasks into their own boards"
  ON public.tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.columns
      JOIN public.boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
        AND boards.user_id = requesting_user_id()
    )
  );

CREATE POLICY "Users can update tasks from their own boards"
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.columns
      JOIN public.boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
        AND boards.user_id = requesting_user_id()
    )
  );

CREATE POLICY "Users can delete tasks from their own boards"
  ON public.tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.columns
      JOIN public.boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
        AND boards.user_id = requesting_user_id()
    )
  );
```

---

## 🔐 Clerk Authentication & Supabase Integration

To authorize Supabase requests with Clerk tokens:
1. In the **Clerk Dashboard**, go to **Configure > JWT Templates**.
2. Click **New template** and choose **Supabase**.
3. Name the template `supabase`.
4. Copy your Supabase JWT Secret (found in Supabase under **Project Settings > API > JWT Secret**) and paste it into the Clerk template settings.
5. In client components, `SupabaseProvider.tsx` automatically requests the session token with `session?.getToken()` and supplies it to Supabase queries.

---

## 💻 Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack (`http://localhost:3000`) |
| `npm run build` | Builds the production-ready optimized application bundle |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Runs Next.js ESLint to verify code quality and style rules |
| `npx tsc --noEmit` | Runs the TypeScript compiler to verify static types without emitting code |

---

## ❓ Troubleshooting

<details>
<summary><strong>1. "supabaseUrl is required" or Supabase connection errors</strong></summary>
Verify that your <code>.env.local</code> file contains valid <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Restart the Next.js development server after editing environment variables.
</details>

<details>
<summary><strong>2. RLS query returns empty arrays `[]` when fetching boards</strong></summary>
Ensure that:
1. The user is logged in through Clerk.
2. The Supabase JWT template is configured in your Clerk dashboard.
3. The SQL helper function <code>requesting_user_id()</code> is installed and reading the <code>sub</code> claim from <code>request.jwt.claims</code>.
</details>

<details>
<summary><strong>3. Clerk sign-in redirect loop</strong></summary>
Verify that <code>NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard</code> is set in <code>.env.local</code> and that <code>middleware.ts</code> is matching incoming routes.
</details>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
