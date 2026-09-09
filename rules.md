# 📏 Genmedi — Project Rules

> **Purpose:** These rules are **mandatory** for all AI coding assistants and contributors working on Genmedi. Violation of these rules will introduce inconsistency, bugs, or technical debt. Consult this file before writing any code.

---

## 1. 🔒 Golden Rule

> **Never break existing functionality unless the user explicitly requests it.**

- Before modifying any component, understand what it currently does.
- Run existing functionality mentally or via the dev server before and after changes.
- If a change has side effects on other views/components, document them and confirm with the user.

---

## 2. 📁 Folder Structure Rules

The project follows a strict folder structure. **Do not deviate.**

```
Genmedi/
├── server.ts                    # Express backend (API routes + Vite middleware)
├── index.html                   # Vite entry HTML
├── package.json                 # Single package manifest
├── vite.config.ts               # Vite + TailwindCSS v4 config
├── tsconfig.json                # TypeScript configuration
├── .env.example                 # Environment variable template
├── .gitignore                   # Git ignore rules
├── metadata.json                # Project metadata (AI Studio)
│
├── src/
│   ├── main.tsx                 # React DOM entry point
│   ├── App.tsx                  # Root component (state, routing, device switching)
│   ├── index.css                # Global CSS / Tailwind imports
│   ├── types.ts                 # ALL TypeScript interfaces & type aliases
│   │
│   ├── components/              # Shared UI feature components
│   │   ├── Header.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── DeviceModeSwitcher.tsx
│   │   ├── DiscoverView.tsx
│   │   ├── CheckoutView.tsx
│   │   ├── RxVaultView.tsx
│   │   ├── LiveTrackingView.tsx
│   │   ├── AIPharmacistView.tsx
│   │   ├── HealthVaultView.tsx
│   │   ├── ClinicalReviewerView.tsx
│   │   ├── AdminOperationsView.tsx
│   │   ├── BioequivalenceStudioView.tsx
│   │   ├── ExceptionResolutionView.tsx
│   │   ├── PharmacyHubView.tsx
│   │   ├── ArchitectureView.tsx
│   │   │
│   │   ├── desktop/             # Desktop-only layout components
│   │   │   ├── DesktopWebsiteView.tsx
│   │   │   ├── DesktopHeader.tsx
│   │   │   ├── DesktopSidebar.tsx
│   │   │   └── DesktopFooter.tsx
│   │   │
│   │   └── mobile/              # Mobile/Tablet-only layout components
│   │       ├── MobileTabAppView.tsx
│   │       ├── MobileHeader.tsx
│   │       ├── MobileBottomNav.tsx
│   │       ├── MobileQuickCategories.tsx
│   │       └── MobileRxScannerModal.tsx
│   │
│   └── data/
│       └── mockData.ts          # All mock/seed data (typed exports)
│
├── public/                      # Static assets (served as-is)
└── dist/                        # Production build output (gitignored)
```

### Placement Rules

| What you're creating                     | Where it goes                            |
|------------------------------------------|------------------------------------------|
| New shared feature view                  | `src/components/<FeatureName>View.tsx`   |
| Desktop-only layout component            | `src/components/desktop/Desktop*.tsx`    |
| Mobile-only layout component             | `src/components/mobile/Mobile*.tsx`      |
| New TypeScript interface / type          | `src/types.ts`                           |
| New mock/seed data                       | `src/data/mockData.ts`                   |
| New API endpoint                         | `server.ts`                              |
| New static asset (image, favicon, etc.)  | `public/`                                |
| Utility / helper function                | `src/utils/<utilName>.ts` (create if needed) |
| Custom React hook                        | `src/hooks/use<HookName>.ts` (create if needed) |

### ❌ Do NOT

- Create new top-level directories without explicit approval.
- Place component files outside `src/components/`.
- Create separate type files per component — all types go in `src/types.ts`.
- Put API logic in frontend components — all API calls go through `server.ts`.

---

## 3. 📝 Naming Conventions

### Files & Directories

| Entity                    | Convention                | Example                          |
|---------------------------|---------------------------|----------------------------------|
| React component file      | `PascalCase.tsx`          | `DiscoverView.tsx`               |
| TypeScript types file      | `camelCase.ts`            | `types.ts`                       |
| Data/mock file             | `camelCase.ts`            | `mockData.ts`                    |
| Utility file               | `camelCase.ts`            | `formatPrice.ts`                 |
| Custom hook file           | `use<Name>.ts`            | `useCart.ts`                     |
| CSS file                   | `camelCase.css`           | `index.css`                      |
| Directories                | `lowercase`               | `components/`, `desktop/`        |

### Code

| Entity                    | Convention                | Example                          |
|---------------------------|---------------------------|----------------------------------|
| React component           | `PascalCase`              | `DiscoverView`, `MobileHeader`   |
| Function / method         | `camelCase`               | `handleAddToCart`, `getGenAIClient` |
| Variable / state          | `camelCase`               | `currentTab`, `searchQuery`      |
| TypeScript interface      | `PascalCase`              | `Medicine`, `CartItem`           |
| TypeScript type alias     | `PascalCase`              | `TabType`, `DeviceMode`          |
| Constants                 | `camelCase` or `UPPER_SNAKE_CASE` | `PORT`, `mockMedicines`   |
| Event handlers            | `handle<Action>` (internal), `on<Action>` (props) | `handlePlaceOrder`, `onAddToCart` |
| Boolean variables         | `is<State>` / `has<Thing>` | `isDesktopUI`, `inStock`        |
| API routes                | `/api/<resource>`         | `/api/health`, `/api/gemini/pharmacist-query` |
| Environment variables     | `UPPER_SNAKE_CASE`        | `GEMINI_API_KEY`, `APP_URL`      |

### Component Naming Patterns

- **Feature views:** `<Feature>View.tsx` — e.g., `DiscoverView.tsx`, `CheckoutView.tsx`
- **Desktop layout:** `Desktop<Component>.tsx` — e.g., `DesktopHeader.tsx`
- **Mobile layout:** `Mobile<Component>.tsx` — e.g., `MobileBottomNav.tsx`
- **Tab types:** lowercase with underscores — e.g., `"discover"`, `"ai_pharmacist"`, `"rx_vault"`

---

## 4. 💻 Coding Standards

### General

- **Language:** TypeScript (strict mode) for all `.ts` and `.tsx` files.
- **React:** Functional components only. No class components.
- **State:** Use `useState` / `useEffect` hooks. No external state library unless explicitly approved.
- **Exports:** Use named exports for components, default export only for `App.tsx`.
- **Imports:** Use absolute imports with `@/` alias when referencing from project root, relative imports within the same directory.

### TypeScript

```typescript
// ✅ DO: Define interfaces in src/types.ts
export interface Medicine {
  id: string;
  brandName: string;
  // ...
}

// ✅ DO: Use explicit return types for non-trivial functions
function getGenAIClient(): GoogleGenAI | null { ... }

// ✅ DO: Type all props
interface DiscoverViewProps {
  medicines: Medicine[];
  onAddToCart: (med: Medicine, isGeneric: boolean) => void;
}

// ❌ DON'T: Use `any` unless absolutely unavoidable (document why)
// ❌ DON'T: Use `@ts-ignore` — fix the type error instead
```

### React Components

```tsx
// ✅ DO: Destructure props
export function DiscoverView({ medicines, onAddToCart }: DiscoverViewProps) {

// ✅ DO: Use semantic HTML and aria labels
<aside aria-label="Notification Alert" className="...">

// ✅ DO: Keep components focused — one primary responsibility per file

// ❌ DON'T: Put state management in leaf/presentational components
// ❌ DON'T: Create components larger than ~300 lines without decomposing
```

### Formatting

- **Indentation:** 2 spaces (no tabs).
- **Quotes:** Double quotes for JSX attributes, single quotes for TypeScript imports (follow existing pattern).
- **Semicolons:** Required.
- **Trailing commas:** Required in multiline objects/arrays.
- **Line length:** Soft limit 120 characters.
- **Blank lines:** One blank line between logical sections; no multiple consecutive blank lines.

---

## 5. 🎨 UI/UX Consistency Rules

### Design Tokens

Always use these established design tokens — do not introduce new colors without approval:

| Token                 | Value               | Usage                              |
|-----------------------|---------------------|------------------------------------|
| Background            | `#f8f9ff`           | Page / app background              |
| Primary Text          | `#0b1c30`           | Headings, body text                |
| Accent / Selection    | `#86f2e4`           | Selection highlight, CTAs, badges  |
| Dark Surface          | `#131b2e`           | Toast, dark cards, overlays        |
| Selection Text        | `#00201d`           | Text on accent backgrounds         |

### Typography

| Usage        | Font Family        | Weight Range  |
|--------------|--------------------|---------------|
| Body / UI    | IBM Plex Sans      | 300–700       |
| Code / Data  | JetBrains Mono     | 400–700       |
| Icons        | Material Symbols Outlined | —       |
| React Icons  | Lucide React       | —             |

### Component Patterns

- **Icons:** Use `lucide-react` for inline icons in components. Use Material Symbols for decorative/system icons.
- **Animations:** Use `motion` (Framer Motion) for component transitions and micro-animations.
- **Toasts:** Use the global toast pattern in `App.tsx` via `showToast()` — do not create component-level notification systems.
- **Error Handling:** The `ErrorBoundary` component wraps the entire app. Do not add try/catch to rendering logic.
- **Responsive:** Feature components must work in both desktop and mobile shells. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).

### ❌ UI Don'ts

- Don't use raw hex colors — use the design token values above.
- Don't import new icon libraries without approval.
- Don't use `alert()`, `confirm()`, or `prompt()` — use in-app UI patterns.
- Don't use inline styles — use Tailwind utility classes.
- Don't break the dual-shell (desktop/mobile) architecture.

---

## 6. 🔀 Git Commit Rules

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type       | Usage                                        |
|------------|----------------------------------------------|
| `feat`     | New feature or capability                    |
| `fix`      | Bug fix                                      |
| `refactor` | Code restructuring without behavior change   |
| `style`    | Formatting, whitespace, missing semicolons   |
| `docs`     | Documentation changes                        |
| `chore`    | Build, tooling, dependency updates           |
| `perf`     | Performance improvement                      |
| `test`     | Adding or updating tests                     |

### Scopes

| Scope         | Applies to                                   |
|---------------|----------------------------------------------|
| `ui`          | Any frontend component change                |
| `api`         | Backend / Express route changes              |
| `types`       | TypeScript interface/type changes            |
| `data`        | Mock data / seed data changes                |
| `config`      | Vite, TS, or build configuration             |
| `deps`        | Dependency additions/updates                 |
| `desktop`     | Desktop-specific layout components           |
| `mobile`      | Mobile-specific layout components            |
| `ai`          | Gemini / AI pharmacist integration           |

### Examples

```
feat(ui): add BioequivalenceStudioView with dissolution curve chart
fix(api): handle missing GEMINI_API_KEY gracefully in pharmacist query
refactor(types): extract PriorityException interface from inline type
docs: update memory.md with new API endpoints
chore(deps): upgrade @google/genai to v2.5.0
```

### Rules

- ✅ One logical change per commit.
- ✅ Write in imperative mood: "add feature" not "added feature".
- ✅ Keep the subject line under 72 characters.
- ❌ Don't commit `node_modules/`, `.env`, `dist/`, or `*.log` files.
- ❌ Don't commit broken code that fails `tsc --noEmit`.

---

## 7. 🔐 Security & Environment Variable Rules

### Environment Variables

| Variable          | Required | Description                        |
|-------------------|----------|------------------------------------|
| `GEMINI_API_KEY`  | Optional | Google Gemini API key for AI features |
| `APP_URL`         | Optional | Deployed application URL           |
| `NODE_ENV`        | Auto     | `development` or `production`      |

### Rules

- ✅ **Always** use `.env.example` as the template — keep it updated when adding new variables.
- ✅ Access env vars only in `server.ts` (backend) — never expose them to the frontend bundle.
- ✅ Use lazy/guarded initialization for API clients (see `getGenAIClient()` pattern).
- ✅ Provide functional fallbacks when optional env vars are missing.
- ❌ **Never** hardcode API keys, secrets, or credentials in source code.
- ❌ **Never** commit `.env` files (`.gitignore` already excludes them).
- ❌ **Never** log full API keys — mask them if logging is needed (e.g., `KEY: ****abcd`).
- ❌ **Never** pass `GEMINI_API_KEY` or any secret to the frontend via props, context, or global variables.

### API Security

- All AI/external API calls must go through `server.ts` endpoints.
- Frontend communicates with `server.ts` via `/api/*` routes only.
- Request body size is limited to `10mb` (`express.json({ limit: "10mb" })`).
- Input validation is required on all API endpoints before processing.

---

## 8. 📦 Dependency Rules

- ✅ Check if existing dependencies can solve the problem before adding new ones.
- ✅ Use exact or caret (`^`) versioning in `package.json`.
- ✅ Document why a new dependency was added in `decisions.md`.
- ❌ Don't add dependencies that duplicate existing functionality (e.g., don't add `axios` when `fetch` suffices).
- ❌ Don't add UI component libraries (e.g., MUI, Chakra) — use Tailwind + custom components.
- ❌ Don't add state management libraries without explicit approval.

### Current Approved Dependencies

| Package                | Purpose                                    |
|------------------------|--------------------------------------------|
| `react` / `react-dom`  | UI framework                              |
| `@google/genai`        | Gemini AI SDK                             |
| `express`              | Backend HTTP server                       |
| `dotenv`               | Environment variable loading              |
| `tailwindcss` + plugin | Utility-first CSS framework (v4)          |
| `lucide-react`         | Icon library                              |
| `motion`               | Animation library (Framer Motion)         |
| `vite`                 | Build tool + dev server                   |
| `tsx`                  | TypeScript execution for Node.js          |
| `esbuild`              | Server bundle for production              |
| `typescript`           | Type checking                             |

---

## 9. 🧪 Quality Checks

Before considering any task complete:

- [ ] `tsc --noEmit` passes with no errors (`npm run lint`).
- [ ] The dev server starts without errors (`npm run dev`).
- [ ] Both desktop and mobile views render correctly.
- [ ] No console errors or warnings in the browser.
- [ ] All existing features still work as expected.
- [ ] New types are added to `src/types.ts` (not inline).
- [ ] Mock data follows established patterns in `src/data/mockData.ts`.
- [ ] `decisions.md`, `memory.md`, and `changelog.md` are updated if the change is significant.
