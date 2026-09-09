# 🧠 Genmedi — Long-Term Project Memory

> **Purpose:** This file is the AI assistant's persistent memory of the Genmedi project. It captures the project's current state, completed work, pending work, technical architecture, and known issues. **Update this file after every significant change.**

---

## 1. Project Overview

**Genmedi** is a fullstack generic medicine discovery, clinical bioequivalence comparison, prescription triage, and 45-minute fast-delivery operations platform built for the Indian pharmaceutical market.

### Core Value Proposition

- Help patients discover **bioequivalent generic medicines** at 60–87% lower cost than branded drugs.
- Provide **clinical-grade bioequivalence data** (AUC, Cmax, dissolution profiles) to build trust.
- Enable **prescription upload → OCR parsing → generic substitution → checkout → 45-min delivery** flow.
- Offer an **AI Clinical Pharmacist** powered by Google Gemini for evidence-based guidance.
- Include **admin operations** for exception resolution, hub management, and clinical review.

### Target Users

| Persona              | Access Point       | Key Features                                    |
|----------------------|--------------------|-------------------------------------------------|
| Patients / Consumers | Mobile app / Web   | Discover, Rx upload, checkout, live tracking     |
| Pharmacists          | Desktop web        | Clinical review, Rx verification, AI pharmacist  |
| Admin / Ops Team     | Desktop web        | Exception resolution, hub ops, bioequivalence lab |
| Delivery Riders      | Mobile app         | Order pickup, OTP verification, route tracking   |

---

## 2. Tech Stack

### Frontend

| Technology             | Version    | Purpose                                    |
|------------------------|------------|--------------------------------------------|
| React                  | 19.0.1     | UI component framework                    |
| TypeScript             | ~5.8.2     | Type-safe development                     |
| Vite                   | 6.2.3      | Build tool & dev server                   |
| TailwindCSS            | 4.1.14     | Utility-first CSS (v4, Vite plugin)       |
| Lucide React           | 0.546.0    | Icon library                              |
| Motion (Framer Motion) | 12.23.24   | Animations & transitions                  |
| IBM Plex Sans          | CDN        | Primary body font                         |
| JetBrains Mono         | CDN        | Monospace / data font                     |
| Material Symbols       | CDN        | System icons                              |

### Backend

| Technology             | Version    | Purpose                                    |
|------------------------|------------|--------------------------------------------|
| Express.js             | 4.21.2     | HTTP server & API routes                  |
| @google/genai          | 2.4.0      | Gemini AI SDK (Clinical Pharmacist)       |
| dotenv                 | 17.2.3     | Environment variable management           |
| tsx                    | 4.21.0     | TypeScript execution for dev server       |
| esbuild                | 0.25.0     | Server bundling for production            |

### Build & Tooling

| Tool                   | Purpose                                    |
|------------------------|--------------------------------------------|
| npm / bun              | Package management (`bun.lock` present)    |
| Vite                   | Frontend build & HMR dev server            |
| esbuild                | Backend bundling (`server.ts` → `dist/server.cjs`) |
| TypeScript compiler    | Type checking (`npm run lint`)             |

---

## 3. Features Completed ✅

### Core User Journey

- [x] **Discover View** — Browse 8 medicines with brand vs. generic comparison, bio-index scores, savings %, stock status, and certification badges (WHO-GMP, NABL, CDSCO).
- [x] **Rx Vault View** — Prescription management with doctor/patient details, ABHA ID, molecule breakdown, allergy flags, and pharmacist digital signature with SHA-256 hash.
- [x] **Checkout View** — Cart with quantity management, brand/generic toggle, price breakdown, delivery speed selection (45-min fast / standard), and order placement.
- [x] **Live Tracking View** — Real-time order tracking with 5-stage pipeline (Rx verified → Hub dispensed → Rider picked → In transit → Delivered), rider details, GPS speed, box temperature, tamper seal barcode, and OTP handover.

### Clinical & AI Features

- [x] **AI Pharmacist View** — Chat interface for clinical pharmacist queries with Gemini AI integration and clinical fallback.
- [x] **Bioequivalence Studio View** — Dissolution curve visualization, AUC/Cmax comparison, and bioequivalence criteria dashboard.
- [x] **Clinical Reviewer View** — Pharmacist review workflow for prescription verification and generic substitution approval.

### Operations & Admin

- [x] **Admin Operations View** — Dashboard for hub management, delivery metrics, and operational oversight.
- [x] **Exception Resolution View** — Priority exception handling (cold chain breach, courier breakdown, Rx illegibility, out of stock) with SLA countdown.
- [x] **Pharmacy Hub View** — Stockist hub management with distance, delivery time, rating, and CDSCO verification.

### Platform Architecture

- [x] **Architecture View** — System architecture visualization component.
- [x] **Dual UI Shell** — Desktop website layout (`DesktopWebsiteView` with sidebar + header + footer) and mobile/tablet app layout (`MobileTabAppView` with bottom nav + compact header).
- [x] **Device Mode Switcher** — Manual override between auto/desktop/phone viewport modes.
- [x] **Error Boundary** — Global error boundary wrapping the entire app.
- [x] **Toast Notification System** — Global toast alerts with auto-dismiss.
- [x] **Responsive Detection** — Viewport-based auto-detection (≥1024px desktop, ≥640px tablet, <640px phone).

### Backend API

- [x] **Health Check** — `GET /api/health` returns service status and AI readiness.
- [x] **Pharmacist Query** — `POST /api/gemini/pharmacist-query` with Gemini AI + clinical fallback.
- [x] **Prescription OCR** — `POST /api/verify-rx-ocr` simulated OCR parsing with structured extraction.

---

## 4. Pending Features 🔲

### High Priority

- [ ] **Real database integration** — Replace `mockData.ts` with PostgreSQL / MongoDB and proper ORM.
- [ ] **User authentication** — Login/registration with JWT or session-based auth.
- [ ] **Real prescription OCR** — Integrate Google Vision API or Tesseract for actual image-to-text prescription parsing.
- [ ] **Payment gateway** — Razorpay / Stripe integration for checkout.
- [ ] **Real-time tracking** — WebSocket-based live GPS tracking for delivery riders.

### Medium Priority

- [ ] **Search & filter** — Full-text medicine search with category/therapeutic class filters.
- [ ] **User profile & health vault** — Persistent patient health records, allergy profiles, medication history.
- [ ] **Order history** — Past orders with re-order functionality.
- [ ] **Push notifications** — Delivery status updates, Rx verification alerts.
- [ ] **Multi-language support** — Hindi, Kannada, Tamil, and other regional languages.

### Low Priority / Future

- [ ] **PWA support** — Offline capability, install prompt, service worker.
- [ ] **Analytics dashboard** — Admin metrics, conversion funnels, delivery SLA compliance.
- [ ] **Drug-drug interaction checker** — Cross-check multiple prescriptions for interaction warnings.
- [ ] **Doctor portal** — E-prescribing interface for verified doctors.
- [ ] **Insurance integration** — Auto-claim filing for prescription medicines.

---

## 5. API Endpoints

### Current Endpoints

| Method | Route                             | Description                                   | Auth Required |
|--------|-----------------------------------|-----------------------------------------------|---------------|
| `GET`  | `/api/health`                     | Service health check + AI readiness status    | No            |
| `POST` | `/api/gemini/pharmacist-query`    | AI clinical pharmacist query (Gemini + fallback) | No         |
| `POST` | `/api/verify-rx-ocr`             | Simulated prescription OCR parsing            | No            |

### `/api/health` Response

```json
{
  "status": "ok",
  "service": "Genmedi Clinical Engine",
  "timestamp": "2026-09-08T09:09:10.000Z",
  "aiReady": true
}
```

### `/api/gemini/pharmacist-query` Request Body

```json
{
  "question": "Is Amoxyclav 625 safe for penicillin-allergic patients?",
  "molecule": "Amoxicillin 500mg + Clavulanic Acid 125mg",
  "brandName": "Augmentin 625 Duo",
  "patientContext": {
    "name": "Rahul Verma",
    "age": 34,
    "gender": "Male",
    "allergies": ["Penicillin"]
  }
}
```

### `/api/verify-rx-ocr` Response Structure

```json
{
  "rxId": "RX-XXXXXX",
  "doctor": { "name": "...", "qualification": "...", "clinic": "..." },
  "patient": { "name": "...", "age": 34, "gender": "Male", "diagnosis": "...", "allergies": ["..."] },
  "extractedMolecules": [
    {
      "prescribedBrand": "Augmentin 625 Duo",
      "molecule": "Amoxicillin 500mg + Clavulanic Acid 125mg",
      "dosage": "1 Tab BD x 5 days",
      "brandPrice": 204.0,
      "genericSubstitute": "Amoxyclav 625 (WHO-GMP)",
      "genericPrice": 64.2,
      "savingsPercent": 68,
      "bioIndex": 99.8,
      "allergyWarning": true
    }
  ],
  "timestamp": "..."
}
```

---

## 6. Data Schema Summary

> All types are defined in [`src/types.ts`](file:///d:/Projects/Genmedi/src/types.ts). Mock data lives in [`src/data/mockData.ts`](file:///d:/Projects/Genmedi/src/data/mockData.ts).

### Core Interfaces

| Interface              | Fields | Purpose                                        |
|------------------------|--------|------------------------------------------------|
| `Medicine`             | 22     | Brand vs. generic medicine with bio-index, pricing, certifications, pharmacokinetics |
| `StockistHub`          | 10     | Pharmacy hub with distance, delivery time, rating, CDSCO verification |
| `PrescriptionItem`     | 11     | Single medicine line item within a prescription |
| `Prescription`         | 12     | Full prescription with doctor, patient, items, pharmacist signature |
| `CartItem`             | 3      | Shopping cart entry (medicine, quantity, generic flag) |
| `OrderTracking`        | 14     | Live delivery tracking with rider, vehicle, temperature, OTP, stages |
| `ChatMessage`          | 5+     | AI pharmacist chat message with optional molecule card |
| `PriorityException`    | 10     | Operations exception (cold chain, courier, Rx, stock) with SLA |
| `DissolutionCurveData` | 5      | Dissolution assay data point (time vs. release %) |

### Type Aliases

| Type      | Values                                                                                     |
|-----------|--------------------------------------------------------------------------------------------|
| `TabType` | `discover`, `rx_vault`, `checkout`, `tracking`, `ai_pharmacist`, `health_vault`, `clinical_reviewer`, `admin_ops`, `bioequivalence_studio`, `exception_resolution`, `pharmacy_hub`, `architecture` |

### Mock Data Exports

| Export                    | Type                    | Count |
|---------------------------|-------------------------|-------|
| `mockMedicines`           | `Medicine[]`            | 8     |
| `mockStockists`           | `StockistHub[]`         | 3     |
| `mockPrescriptions`       | `Prescription[]`        | 1     |
| `mockOrderTracking`       | `OrderTracking`         | 1     |
| `mockExceptions`          | `PriorityException[]`   | 3     |
| `sampleDissolutionAssay`  | `DissolutionCurveData[]`| 6     |

---

## 7. Important Business Logic

### Bioequivalence Criteria

- A generic medicine is considered bioequivalent if the 90% confidence interval of **AUC** and **Cmax** falls within **80.00% – 125.00%** (WHO/CDSCO/US-FDA standard).
- The platform displays a **Bio-Index Score** (0–100%) representing molecular parity with the innovator drug.
- All mock medicines have bio-index scores of **99.3% – 99.9%**.

### Allergy Flagging

- Medications containing **Penicillin / Beta-Lactam** compounds trigger allergy warnings.
- The system flags `allergyWarning: true` on prescription items when the patient has a documented allergy.
- The demo patient (Rahul Verma) has a **severe Penicillin allergy** — Augmentin 625 triggers a critical warning.

### Pricing & Savings

- Savings percentage is calculated as: `((brandPrice - genericPrice) / brandPrice) * 100`.
- All prices are in **Indian Rupees (₹)**.
- Current mock data shows savings ranging from **68% to 87%**.

### Delivery SLA

- **45-Minute Fast Delivery** is the premium fulfillment option.
- Standard delivery estimates come from the nearest stockist hub.
- Exceptions are raised when SLA is at risk (courier breakdown, cold chain breach, etc.).

### Prescription Verification

- Prescriptions require **registered pharmacist sign-off** before dispensation.
- Digital signature includes pharmacist name, registration number, timestamp, and **SHA-256 hash**.
- ABHA ID (Ayushman Bharat Health Account) is captured for patient identification.

### Certification Badges

All generic medicines must display:
- **WHO-GMP Certified** — World Health Organization Good Manufacturing Practice.
- **NABL Audited** — National Accreditation Board for Testing and Calibration Laboratories.
- **CDSCO Approved** — Central Drugs Standard Control Organisation.

---

## 8. Known Issues ⚠️

| #   | Issue                                             | Severity  | Status     |
|-----|---------------------------------------------------|-----------|------------|
| 1   | `handleApplySubstitution` is a no-op (shows toast only) | Low     | Open       |
| 2   | `handleAddAllRxToCart` uses fuzzy matching that may match wrong medicines | Medium | Open |
| 3   | No input validation on pharmacist query frontend — relies on server-side only | Low | Open |
| 4   | `handlePlaceOrder` ignores the `speed` parameter (always shows 45-min message) | Low | Open |
| 5   | Mock prescription date is hardcoded to "14 Oct 2024" | Low | Open |
| 6   | `DeviceMode` type is defined in `DeviceModeSwitcher.tsx` instead of `types.ts` | Low | Open |
| 7   | No loading states for API calls in AI Pharmacist view | Medium | Open |
| 8   | Cart state resets on page refresh (no persistence) | Medium | Open |

---

## 9. Future Roadmap

### Phase 1: Foundation (Current) ✅

- Core UI with all 12 views
- Mock data layer with typed interfaces
- Dual desktop/mobile shell
- Gemini AI integration with fallback
- Basic API endpoints

### Phase 2: Backend & Data

- PostgreSQL / MongoDB integration
- User authentication (JWT)
- Real prescription OCR (Google Vision API)
- Persistent cart & order state
- Admin API for hub/rider management

### Phase 3: Transactions & Delivery

- Payment gateway integration (Razorpay)
- Real-time WebSocket tracking
- Push notifications (FCM)
- Rider assignment algorithm
- Cold chain IoT sensor integration

### Phase 4: Scale & Intelligence

- Drug-drug interaction engine
- Multi-language support (i18n)
- Doctor e-prescribing portal
- Insurance auto-claim integration
- PWA + offline support

### Phase 5: Compliance & Launch

- HIPAA / Indian health data compliance audit
- CDSCO regulatory filing
- Performance optimization & CDN
- Security penetration testing
- Public beta launch

---

## 10. Key File Reference

| File                                  | Purpose                                    |
|---------------------------------------|--------------------------------------------|
| [`server.ts`](file:///d:/Projects/Genmedi/server.ts) | Express backend with all API routes |
| [`src/App.tsx`](file:///d:/Projects/Genmedi/src/App.tsx) | Root component with state & routing |
| [`src/types.ts`](file:///d:/Projects/Genmedi/src/types.ts) | All TypeScript interfaces |
| [`src/data/mockData.ts`](file:///d:/Projects/Genmedi/src/data/mockData.ts) | All mock/seed data |
| [`src/index.css`](file:///d:/Projects/Genmedi/src/index.css) | Global styles & Tailwind imports |
| [`vite.config.ts`](file:///d:/Projects/Genmedi/vite.config.ts) | Vite + Tailwind plugin config |
| [`index.html`](file:///d:/Projects/Genmedi/index.html) | HTML entry with fonts & meta tags |
| [`package.json`](file:///d:/Projects/Genmedi/package.json) | Dependencies & scripts |
| [`.env.example`](file:///d:/Projects/Genmedi/.env.example) | Environment variable template |
| [`decisions.md`](file:///d:/Projects/Genmedi/decisions.md) | Technical decision log |
| [`rules.md`](file:///d:/Projects/Genmedi/rules.md) | Coding standards & project rules |
| [`changelog.md`](file:///d:/Projects/Genmedi/changelog.md) | Version history |

---

*Last updated: 2026-09-08*
