# Mitera Health HMO — Broker Relationship Management (BRM) System
## Software Developer Technical Architecture & Integration Guide

---

### Executive Overview & Stack Architecture
The **Mitera Health HMO BRM System** is a unified full-stack application built on **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**. It communicates with backend databases (Prisma / Supabase PostgreSQL) and integrates with the **Mitera MApp / Odyssey ecosystem** via secure REST APIs and webhooks.

---

### Repository Structure & Component Blueprint

```
src/
├── app/
│   ├── layout.tsx             # Global layout & metadata configuration
│   ├── page.tsx               # Main entry point with Gated Auth & RBAC router
│   └── globals.css            # Tailwind directives & brand CSS design tokens
├── components/
│   ├── AuthPage.tsx           # Gated login, signup, 2FA, and test credential fill
│   ├── AdminDashboard.tsx     # HMO Executive Compliance, Agreements, Maker-Checker & Audit
│   ├── BrokerReadOnlyPortal.tsx # Broker SBU portal, bids log, MApp referral code & dispute button
│   ├── QuoteGenerator.tsx     # Dynamic corporate premium engine & PDF proposal exporter
│   ├── PipelineTracker.tsx    # CRM deal pipeline kanban & interactive deal creator
│   ├── CommissionLedger.tsx   # Commission wallet, 6-step explainable formula trace modal
│   └── BrokerOnboardingForm.tsx # Dual-SBU self-service onboarding wizard
└── lib/
    ├── types.ts               # Strict TypeScript interfaces, enums & data schemas
    └── mockDb.ts              # In-memory reactive mock database & default seed state
```

---

### Core Data Models & Schemas (`src/lib/types.ts`)

#### 1. Broker Master Schema
```typescript
export type SBU = 'CORPORATE' | 'RETAIL';
export type BrokerType = 'CORPORATE' | 'RETAIL';
export type OnboardingStatus = 'DRAFT' | 'PENDING_VERIFICATION' | 'IN_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export interface BrokerData {
  id: string;
  userId: string;
  brokerCode?: string | null;
  brokerType: BrokerType;
  companyName: string;
  rcNumber?: string | null;
  naicomLicenseNumber?: string | null;
  taxIdNumber?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  status: OnboardingStatus;
  tierLevel: TierLevel;
  riskScore: number;
}
```

#### 2. Commission Calculation Breakdown Schema
```typescript
export interface CommissionCalculationStep {
  stepNumber: number;
  description: string;
  formula: string;
  valueInKobo: number;
  formattedValue: string;
}

export interface CommissionCalculationBreakdown {
  ruleVersion: string;
  preundedBaseKobo: number;
  nonCommissionableExclusionsKobo: number;
  netBaseKobo: number;
  appliedPercentage: number;
  grossCommissionKobo: number;
  whtRatePct: number;
  whtDeductionKobo: number;
  netCommissionPayableKobo: number;
  steps: CommissionCalculationStep[];
}
```

---

### External System Integration Guide

To connect this BRM Portal to Mitera's production ecosystem, integrate with the following key endpoints and events:

#### 1. MApp / Mitera Odyssey Application Integration (Retail SBU)
* **Referral Code Validation API:** `POST /api/v1/referrals/validate`
  * **Payload:** `{ "code": "MAPP-BABAJIDE-01", "prospectId": "usr_9912" }`
  * **Response:** `{ "valid": true, "brokerId": "brk-retail-2", "program": "RETAIL_3PCT" }`
* **Real-Time Sales Attribution Webhook:** `POST /api/v1/events/enrolment-completed`
  * **Payload:** `{ "enrolmentId": "ENR-8812", "referralCode": "MAPP-BABAJIDE-01", "eligiblePremiumKobo": 5000000, "status": "ACTIVE_PAID" }`
  * **Behavior:** Triggers the Commission Engine to evaluate anti-self-referral checks (BVN/Device ID hash match) and create an `ELIGIBLE` retail commission event.

#### 2. Policy Administration System (Corporate SBU)
* **Corporate Policy Activation Event:** `POST /api/v1/events/policy-activated`
  * **Payload:** `{ "policyNumber": "MTR-POL-2026-004", "corporateClientId": "cadbury-nigeria", "confirmedReceiptKobo": 1250000000, "activeLives": 150 }`
  * **Behavior:** Evaluates effective-dated `CorporateAgreementData` for the linked broker, calculates net commissionable base (after non-commissionable fees), and transitions status from `ACCRUED` to `ELIGIBLE`.

#### 3. Payment Gateway / Collections (Paystack / Flutterwave)
* **Premium Receipt & Reversal Webhooks:** `POST /api/v1/webhooks/payment`
  * **Behavior:** On `charge.success`, creates or refreshes the commission event using `idempotencyKey = transactionRef + brokerId + ruleVersion`. On `refund.processed` or `chargeback`, automatically issues a linked negative reversal entry in the commission ledger.

#### 4. Finance & Accounting / NUBAN Settlement
* **Bank Disbursement API / Batch Export:** `GET /api/v1/finance/batches/{batchId}/export`
  * **Behavior:** Generates a NUBAN-compliant payment file for GTBank / Zenith Corporate Internet Banking containing gross payouts, deducted FIRS WHT (5% Corporate / 10% Individual), and net transfer amounts.

---

### Brand Color Tokens & Styling System

The application layout follows a strict 70/20/10 visual rule using Tailwind CSS tokens:
* **Primary Teal:** `#0299A7` (`bg-[#0299A7]`, `text-[#0299A7]`)
* **Darker Teal Header:** `#037A86` (`bg-[#037A86]`, `text-[#037A86]`)
* **Light Teal Background:** `#E0F2F4` (`bg-[#E0F2F4]`)
* **Off-White Container Background:** `#F2F2F0` (`bg-[#F2F2F0]`)
* **Charcoal Text:** `#22282B` (`text-[#22282B]`)
* **Coral Attention Accent:** `#EF8E85` / `#D66F66` (`bg-[#EF8E85]`)
