# 📋 Genmedi — Technical & Product Decisions Log

> **Purpose:** This document records every significant technical and product decision made during the development of Genmedi. AI coding assistants **must** consult this file before proposing architectural changes, adding dependencies, or altering established patterns.

---

## How to Use This File

- **Before making a decision:** Check if a related decision already exists.
- **After making a decision:** Add a new entry at the top of the log (newest first).
- **Format:** Follow the template below exactly.

### Entry Template

```markdown
### DEC-XXX: [Decision Title]

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | YYYY-MM-DD                          |
| **Status**             | `accepted` / `superseded` / `deprecated` |
| **Decided By**         | Name / Role                         |

**Context / Problem:**
[What problem or question prompted this decision?]

**Decision:**
[What was decided?]

**Reasoning:**
[Why was this the best option?]

**Alternatives Considered:**
1. [Alternative A] — [Why rejected]
2. [Alternative B] — [Why rejected]

**Impact on Project:**
- [Impact 1]
- [Impact 2]
```

---

## Decision Log

---

### DEC-007: Use Mock Data Layer Instead of Live Database for MVP

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | 2026-09-08                          |
| **Status**             | `accepted`                          |
| **Decided By**         | Core Team                           |

**Context / Problem:**
The MVP needed to showcase the full user journey (discover → prescription → checkout → tracking → admin ops) without the overhead of setting up and maintaining a production database.

**Decision:**
All data (medicines, stockists, prescriptions, order tracking, exceptions, dissolution curves) is served from a single `src/data/mockData.ts` file using strongly-typed TypeScript interfaces.

**Reasoning:**
- Enables rapid prototyping and demo readiness without database migrations.
- All types in `src/types.ts` serve as the implicit schema — a future database migration can mirror these interfaces directly.
- Frontend and backend can evolve independently.

**Alternatives Considered:**
1. **SQLite embedded DB** — Rejected; adds build complexity and is unnecessary for demo stage.
2. **Firebase Realtime DB** — Rejected; introduces external dependency, auth overhead, and vendor lock-in at MVP stage.
3. **JSON file storage on disk** — Rejected; no type-safety, no IDE autocomplete benefits.

**Impact on Project:**
- All client-side data flows through typed mock exports (`mockMedicines`, `mockStockists`, etc.).
- Backend API endpoints (`/api/verify-rx-ocr`) return hardcoded simulation data.
- Database migration will require replacing mock imports with API fetch calls.

---

### DEC-006: Dual UI Architecture — Desktop Website + Mobile/Tablet App

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | 2026-09-08                          |
| **Status**             | `accepted`                          |
| **Decided By**         | Core Team                           |

**Context / Problem:**
Genmedi serves two distinct user personas: healthcare professionals on desktop workstations and patients/riders on mobile devices. A single responsive layout would compromise both experiences.

**Decision:**
Implement two complete UI shells:
- `src/components/desktop/` — `DesktopWebsiteView` with sidebar navigation, full header, and footer.
- `src/components/mobile/` — `MobileTabAppView` with bottom navigation, compact header, and Rx scanner modal.
- A `DeviceModeSwitcher` component allows manual override (`auto`, `desktop`, `phone`).

**Reasoning:**
- Desktop users need multi-panel layouts for clinical review, admin ops, and bioequivalence studio.
- Mobile users need thumb-friendly navigation, scan-to-order flows, and minimal scrolling.
- The `auto` mode uses viewport width breakpoints (≥1024px = desktop, ≥640px = tablet, <640px = phone).

**Alternatives Considered:**
1. **Single responsive layout** — Rejected; too many compromises for the admin/clinical features on mobile.
2. **Separate codebases (React Native for mobile)** — Rejected; increases maintenance burden significantly.

**Impact on Project:**
- All feature components (e.g., `DiscoverView`, `CheckoutView`) are shared between both shells.
- Layout-specific components live in `desktop/` and `mobile/` subdirectories.
- Props are passed down through the shell views to shared feature components.

---

### DEC-005: Gemini AI as Clinical Pharmacist Engine with Fallback

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | 2026-09-08                          |
| **Status**             | `accepted`                          |
| **Decided By**         | Core Team                           |

**Context / Problem:**
The AI Pharmacist feature requires generating evidence-based clinical guidance on generic medicine substitution, bioequivalence data, and allergen checks. This must work reliably even without an API key or during rate limiting.

**Decision:**
- Use Google Gemini (`gemini-3.8-flash`) via `@google/genai` SDK as the primary AI engine.
- Implement a high-fidelity clinical fallback response in the server when the API is unavailable.
- The AI client is lazily initialized only when `GEMINI_API_KEY` is present.

**Reasoning:**
- Gemini Flash provides fast, low-cost responses suitable for clinical Q&A.
- The fallback ensures the demo and core functionality never breaks due to API issues.
- Lazy initialization avoids crashes when running without an API key.

**Alternatives Considered:**
1. **OpenAI GPT-4** — Rejected; higher cost, no native Google ecosystem integration.
2. **Local LLM (Ollama)** — Rejected; hardware requirements too high for deployment target.
3. **No fallback (API-only)** — Rejected; unacceptable for demo reliability.

**Impact on Project:**
- `server.ts` contains both the Gemini integration and the fallback clinical response.
- Environment variable `GEMINI_API_KEY` controls AI availability.
- System prompt in the API call defines the clinical persona and response structure.

---

### DEC-004: Express.js Backend with Vite Dev Middleware

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | 2026-09-08                          |
| **Status**             | `accepted`                          |
| **Decided By**         | Core Team                           |

**Context / Problem:**
The application needs a server for API endpoints (pharmacist query, prescription OCR) while maintaining fast frontend development with HMR.

**Decision:**
- Use Express.js as the backend server (`server.ts`).
- In development, mount Vite's dev server as Express middleware (`middlewareMode`).
- In production, serve the Vite build output from `dist/` as static files.
- Single `npm run dev` command starts both frontend and backend via `tsx server.ts`.

**Reasoning:**
- Eliminates the need for separate frontend/backend processes during development.
- `tsx` enables running TypeScript server files directly without a compile step.
- Production build uses `esbuild` to bundle `server.ts` into a Node.js CJS module.

**Alternatives Considered:**
1. **Next.js API routes** — Rejected; tighter coupling, heavier framework for this use case.
2. **Separate Vite + Express processes** — Rejected; adds proxy configuration complexity.

**Impact on Project:**
- All API routes are defined in `server.ts` under `/api/*`.
- `npm run dev` starts the full-stack dev server on port 3000.
- `npm run build` produces both client assets and bundled server.

---

### DEC-003: TailwindCSS v4 with Vite Plugin

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | 2026-09-08                          |
| **Status**             | `accepted`                          |
| **Decided By**         | Core Team                           |

**Context / Problem:**
The project needed a styling solution that supports rapid UI iteration across 15+ component files with consistent design tokens.

**Decision:**
Use TailwindCSS v4 with `@tailwindcss/vite` plugin for zero-config integration. All styling uses Tailwind utility classes directly in JSX.

**Reasoning:**
- TailwindCSS v4 removes the need for a `tailwind.config.js` file.
- The Vite plugin provides automatic CSS processing with zero configuration.
- Utility-first approach keeps styles co-located with component markup.

**Alternatives Considered:**
1. **Vanilla CSS / CSS Modules** — Rejected; slower iteration speed for a UI-heavy prototype.
2. **styled-components** — Rejected; runtime overhead, less team familiarity.
3. **TailwindCSS v3** — Rejected; v4 offers better performance and simpler setup.

**Impact on Project:**
- `@tailwindcss/vite` is registered in `vite.config.ts` plugins array.
- No separate Tailwind config file exists — v4 convention.
- Design tokens: `#f8f9ff` (bg), `#0b1c30` (text), `#86f2e4` (accent/selection), `#131b2e` (dark surface).
- Typography: IBM Plex Sans (body), JetBrains Mono (code/data), Material Symbols (icons).

---

### DEC-002: React 19 + TypeScript for Frontend

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | 2026-09-08                          |
| **Status**             | `accepted`                          |
| **Decided By**         | Core Team                           |

**Context / Problem:**
Needed a component-based frontend framework with strong typing for a complex, multi-view medical application.

**Decision:**
Use React 19 with TypeScript (~5.8) for the frontend. All components are functional components with hooks. State management is done via React's built-in `useState` in the root `App.tsx` with prop drilling.

**Reasoning:**
- React 19 provides the latest performance improvements and concurrent features.
- TypeScript ensures type safety across the extensive data model (8 interfaces, 12+ views).
- Prop drilling is sufficient for the current component depth; no state library needed yet.

**Alternatives Considered:**
1. **Vue 3** — Rejected; team has stronger React expertise.
2. **SolidJS** — Rejected; smaller ecosystem, less library support for medical UI patterns.
3. **Zustand/Redux for state** — Deferred; prop drilling is manageable at current scale.

**Impact on Project:**
- All types defined in `src/types.ts` and imported across components.
- Root state lives in `App.tsx` — cart, prescriptions, tracking, exceptions, toast.
- `ErrorBoundary` component wraps the entire app for graceful error handling.

---

### DEC-001: Monorepo Single-Package Architecture

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| **Date**               | 2026-09-08                          |
| **Status**             | `accepted`                          |
| **Decided By**         | Core Team                           |

**Context / Problem:**
Genmedi is a fullstack application with tightly coupled frontend and backend. Needed to decide on repository and package structure.

**Decision:**
Single-package monorepo with frontend (`src/`) and backend (`server.ts`) in the same root. No workspace/lerna/turborepo setup.

**Reasoning:**
- Simplest possible setup for a team-of-one or small team.
- Shared TypeScript types between frontend and backend.
- Single `package.json` manages all dependencies.

**Alternatives Considered:**
1. **Turborepo monorepo** — Rejected; unnecessary complexity at this stage.
2. **Separate repos for frontend/backend** — Rejected; would require duplicating type definitions.

**Impact on Project:**
- `server.ts` is at the project root alongside `src/`.
- Build script handles both Vite client build and esbuild server bundle.
- Shared types from `src/types.ts` can be imported by both client and server.
