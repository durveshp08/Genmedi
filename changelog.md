# 📜 Genmedi — Changelog

> **Purpose:** Chronological history of all project changes. Follow [Keep a Changelog](https://keepachangelog.com/) format. Newest entries at the top. Update this file with every significant change.

---

## Version Format

Genmedi uses [Semantic Versioning](https://semver.org/):

- **MAJOR** — Breaking changes to APIs, data schemas, or architecture.
- **MINOR** — New features or views added.
- **PATCH** — Bug fixes, styling tweaks, refactors.

### Entry Template

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- Description of new feature or capability.

### Changed
- Description of change to existing functionality.

### Fixed
- Description of bug fix.

### Removed
- Description of removed feature or file.

### Security
- Description of security-related change.
```

---

## [0.1.0] — 2026-09-08

> 🚀 **Initial MVP — Complete Prototype with 12 Views, AI Integration, and Dual UI Shell**

### Added

#### Core UI Views
- **DiscoverView** — Browse 8 generic medicines with brand comparison, bio-index scores, savings %, certifications (WHO-GMP, NABL, CDSCO), and stock status.
- **RxVaultView** — Prescription management with doctor/patient details, ABHA ID, molecule breakdown, allergy flags, and pharmacist digital signature (SHA-256).
- **CheckoutView** — Cart management with quantity controls, brand/generic toggle, price breakdown, delivery speed selection (45-min fast / standard).
- **LiveTrackingView** — 5-stage order tracking pipeline with rider details, GPS speed, box temperature, tamper seal barcode, and OTP handover.
- **AIPharmacistView** — Clinical pharmacist chat interface with molecule cards and evidence-based guidance.
- **HealthVaultView** — Patient health records and medication history view.
- **ClinicalReviewerView** — Pharmacist review workflow for Rx verification and generic substitution.
- **AdminOperationsView** — Operations dashboard for hub management and delivery metrics.
- **BioequivalenceStudioView** — Dissolution curve visualization and AUC/Cmax comparison dashboard.
- **ExceptionResolutionView** — Priority exception handling with SLA countdown (cold chain, courier, Rx, stock).
- **PharmacyHubView** — Stockist hub management with distance, delivery time, and CDSCO verification.
- **ArchitectureView** — System architecture visualization.

#### Platform Architecture
- **Dual UI Shell** — Desktop website layout (`DesktopWebsiteView` with sidebar + header + footer) and mobile/tablet app layout (`MobileTabAppView` with bottom nav + compact header).
- **DeviceModeSwitcher** — Manual override between auto/desktop/phone viewport modes with responsive auto-detection (≥1024px desktop, ≥640px tablet, <640px phone).
- **ErrorBoundary** — Global error boundary for graceful error handling.
- **Toast Notification System** — Global toast with auto-dismiss (4s timeout).

#### Backend API
- `GET /api/health` — Service health check with AI readiness status.
- `POST /api/gemini/pharmacist-query` — Clinical AI pharmacist powered by Gemini 3.8 Flash with high-fidelity clinical fallback.
- `POST /api/verify-rx-ocr` — Simulated prescription OCR with structured molecule extraction.

#### Data Layer
- **8 sample medicines** covering antibiotics, gastrointestinal, antihistamine, cardiovascular, antidiabetic classes.
- **3 stockist hubs** in Bengaluru with fast-delivery capabilities and CDSCO verification.
- **1 sample prescription** (Rahul Verma, 34M, sinusitis, penicillin allergy) with 3 medication items.
- **1 active order tracking** (in-transit, EV rider, cold chain monitoring).
- **3 priority exceptions** (courier breakdown, cold chain breach, Rx illegibility).
- **Dissolution assay data** with 6 time points for bioequivalence visualization.

#### TypeScript Types
- `Medicine` (22 fields), `StockistHub` (10), `PrescriptionItem` (11), `Prescription` (12), `CartItem` (3), `OrderTracking` (14), `ChatMessage` (5+), `PriorityException` (10), `DissolutionCurveData` (5).
- `TabType` union type with 12 view identifiers.

#### Desktop Layout Components
- `DesktopWebsiteView.tsx` — Full desktop shell with sidebar navigation.
- `DesktopHeader.tsx` — Desktop header with search, cart badge, and user profile.
- `DesktopSidebar.tsx` — Navigation sidebar with 12 tab links.
- `DesktopFooter.tsx` — Footer with branding and links.

#### Mobile Layout Components
- `MobileTabAppView.tsx` — Mobile app shell with tab-based navigation.
- `MobileHeader.tsx` — Compact header with search and notifications.
- `MobileBottomNav.tsx` — Bottom navigation bar with active tab indicator.
- `MobileQuickCategories.tsx` — Quick category shortcuts for mobile.
- `MobileRxScannerModal.tsx` — Camera/upload modal for prescription scanning.

#### Configuration & Tooling
- Vite 6.2.3 with React plugin and TailwindCSS v4 Vite plugin.
- Express.js 4.21.2 backend with Vite dev middleware integration.
- TypeScript ~5.8.2 with strict mode.
- IBM Plex Sans + JetBrains Mono + Material Symbols from Google Fonts CDN.
- `.env.example` with `GEMINI_API_KEY` and `APP_URL` documentation.
- `.gitignore` for `node_modules/`, `dist/`, `.env*`, and `*.log`.

#### Project Documentation
- `decisions.md` — Technical and product decision log (7 initial decisions).
- `rules.md` — Comprehensive project rules for AI coding assistants.
- `memory.md` — Long-term project memory with full state documentation.
- `changelog.md` — This file.

---

<!-- 
## [0.2.0] — YYYY-MM-DD

### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 
-->
