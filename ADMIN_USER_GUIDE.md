# Mitera Health HMO — Broker Relationship Management (BRM) System
## Executive Administration User Guide & Standard Operating Procedures (SOP)

---

### Executive Summary & Operating Principles
The **Mitera Health HMO Broker Relationship Management (BRM) System** is a regulatory-compliant enterprise platform designed to govern the full lifecycle of healthcare brokers and sales partners. Operating across two distinct Strategic Business Units (**Corporate SBU** and **Retail SBU**), the BRM platform guarantees **zero duplicate commission payments**, **explainable step-by-step financial breakdowns**, and **immutable audit traceability** in strict compliance with Nigerian health insurance and financial governance standards.

---

### Core Operating Pillars & Strategic Business Units (SBUs)

```
                       ┌──────────────────────────────────────────────┐
                       │           MITERA HEALTH HMO BRM              │
                       └──────────────────────┬───────────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │      CORPORATE SBU      │                       │       RETAIL SBU        │
        ├─────────────────────────┤                       ├─────────────────────────┤
        │ • Negotiated Agreements │                       │ • Mitera MApp App Links │
        │ • Custom Rate Splits    │                       │ • Unique Referral Codes │
        │ • Banded Volume Quotes  │                       │ • Anti-Self-Referral    │
        │ • Corporate Groups 30+  │                       │ • Individual / Family   │
        └─────────────────────────┘                       └─────────────────────────┘
```

---

### Key Modules & Standard Operating Procedures

#### 1. Onboarding Review Queue & KYC Vetting
* **Objective:** Review, verify, and approve incoming broker applications.
* **Access Navigation:** `HMO Governance Portal` ➔ `Review Queue` tab.
* **Operating Procedure:**
  1. Select a pending application from the left panel.
  2. Inspect the uploaded corporate credentials:
     * **CAC Corporate Registration Number**
     * **NAICOM Broker License Number & Expiry Date**
     * **Tax Identification Number (TIN)**
     * **Corporate NUBAN Bank Account Details**
  3. Review the automated **Risk Score** (e.g., Risk Score: 10–12).
  4. Select the appropriate **Partnership Tier Level**:
     * `Retail Partner`: 3% standard MApp referral commission split.
     * `Corporate Broker`: 5% volume discount tier eligibility.
     * `Elite Partner`: 10% volume discount + overriding commission split.
  5. Click **Approve & Activate Broker** to auto-generate a unique Broker Code (e.g. `HMO-BRK-1001`) and send login credentials. If rejected, select a mandatory reason (e.g. *Expired NAICOM License*).

---

#### 2. Corporate SBU Agreement Configuration
* **Objective:** Configure negotiated, effective-dated corporate brokerage agreements linked to corporate accounts.
* **Access Navigation:** `HMO Governance Portal` ➔ `Corporate Agreements` tab.
* **Operating Procedure:**
  1. Click **Configure Corporate Agreement** to open the in-app configuration modal.
  2. Select the **Corporate Broker Partner** from the active brokers list.
  3. Enter the **Corporate Client Name** (e.g. *Cadbury Nigeria Plc*, *Dangote Foods*).
  4. Define commercial terms:
     * **Agreed Commission Rate (%):** Standard 10% or negotiated rate.
     * **Broker Split Share (%):** Percentage share payable to broker.
     * **Effective Window:** Select Effective Start Date and End Date.
     * **SLA Terms:** Input specific payment lead times (e.g. 30-day settlement window).
  5. Click **Save & Activate Corporate Agreement**. The system logs an immutable audit event for the rule version.

---

#### 3. Retail SBU Referral Code Management
* **Objective:** Issue, track, and monitor referral links used by Retail agents on the Mitera MApp.
* **Access Navigation:** `HMO Governance Portal` ➔ `Retail Codes` tab.
* **Operating Procedure:**
  1. Click **Generate Referral Code**.
  2. Enter the custom alphanumeric code (e.g. `MAPP-BABAJIDE-01`).
  3. The system generates a deep link (`https://mapp.miterahealth.com/enrol?ref=MAPP-BABAJIDE-01`).
  4. Monitor real-time performance indicators:
     * **Total Enrolment Conversions**
     * **Eligible Premium Generated (₦)**
     * **Total Commission Earned (₦)**
  5. **Anti-Self-Referral Safeguards:** The engine automatically hashes enrollee BVN, payment instruments, and mobile device IDs to flag and hold self-referral attempts before commission accrual.

---

#### 4. Maker-Checker Dual Approval Queue
* **Objective:** Enforce dual-control governance for critical system modifications.
* **Access Navigation:** `HMO Governance Portal` ➔ `Maker-Checker` tab.
* **Mandatory Trigger Actions:**
  * **Bank Detail Updates** (e.g. Broker NUBAN changes)
  * **High-Value Rate Overrides** (Agreed commission > 10% threshold)
  * **Manual Financial Adjustments**
* **Operating Procedure:**
  1. The **Maker** (Sales Lead / Broker Admin) submits the requested change.
  2. The **Checker** (Compliance Officer / Finance Admin) logs in and opens the Maker-Checker queue.
  3. Compare **Current Value** vs **Proposed New Value** alongside stated reasons.
  4. Click **Approve & Execute Change** or **Reject Request**. Approvals instantly update master data and emit an immutable audit event.

---

#### 5. Dynamic Corporate Quote Generator
* **Objective:** Generate real-time banded corporate HMO proposals with custom price-per-head overrides and downloadable co-branded PDF proposals.
* **Access Navigation:** `HMO Governance Portal` ➔ `Quote Generator` tab.
* **Operating Procedure:**
  1. Enter corporate client details and total workforce headcounts across categories (e.g. Executives, Staff, Operations).
  2. The dynamic engine calculates volume discounts based on employee count bands:
     * **100+ lives:** 15% volume discount
     * **50–99 lives:** 10% volume discount
  3. **Admin Price Override:** HMO admins can manually edit the **Admin Price/Head (₦)** field per plan category to reflect negotiated terms.
  4. Click **Download Formal Proposal PDF** to generate an official co-branded quote document with complete cost breakdowns.

---

#### 6. Payment Batches & Bank Disbursement
* **Objective:** Consolidate approved commissions into bank upload disbursement files.
* **Access Navigation:** `HMO Governance Portal` ➔ `Payment Batches` tab.
* **Operating Procedure:**
  1. Select the target SBU (`CORPORATE` or `RETAIL`) and billing cycle.
  2. Review the aggregated financial totals:
     * **Gross Commission Amount (₦)**
     * **Statutory FIRS Withholding Tax Deduction (-₦)** (5% Corporate / 10% Individual)
     * **Net Payable Disbursement (₦)**
  3. Click **Generate Bank Upload File** to export a NUBAN-compliant disbursement file (GTBank / Zenith Corporate Banking format) for Treasury processing.

---

#### 7. Commission Ledger & Explainable Calculation Trace
* **Objective:** Inspect commission history and review step-by-step formula execution.
* **Access Navigation:** `HMO Governance Portal` ➔ `Commissions Ledger` tab.
* **Operating Procedure:**
  1. Locate the target transaction in the ledger table.
  2. Click **Explain Breakdown** to open the formula trace modal.
  3. Review the 6-step calculation sequence:
     * **Step 1:** Eligible Gross Premium Receipt
     * **Step 2:** Non-Commissionable Deductions (Levies, Admin Fees)
     * **Step 3:** Net Commissionable Base
     * **Step 4:** Rate Application (`Net Base * Commission %`)
     * **Step 5:** FIRS Withholding Tax (`Gross Commission * WHT %`)
     * **Step 6:** Net Payable Amount
  4. Click **Download Statement PDF** to print official tax and payout statements.

---

#### 8. Financial Dispute & Adjustment Ledger
* **Objective:** Log and resolve broker attribution, rate, or payout disputes.
* **Access Navigation:** `Commissions Ledger` ➔ `Raise Adjustment / Dispute`.
* **Operating Procedure:**
  1. Select the dispute category (*Missing Attribution*, *Incorrect Rate*, *WHT Discrepancy*).
  2. Enter the claimed adjustment amount in Naira and provide justification.
  3. Submit the claim.
  4. **Immutable Ledger Rule:** Past transaction receipts are **never overwritten**. Approved resolutions issue a separate, linked credit/debit adjustment entry in the ledger.

---

#### 9. Immutable Governance & Audit Trail
* **Objective:** Review append-only logs for regulatory returns and system events.
* **Access Navigation:** `HMO Governance Portal` ➔ `Audit Trail` tab.
* **Captured Audit Metadata:**
  * **Timestamp:** Date and time of action.
  * **Actor & Role:** Identity of user or system process executing the action.
  * **Action Type:** `APPROVE_AGREEMENT`, `DISBURSE_PAYMENT_BATCH`, `CALCULATE_COMMISSION`, etc.
  * **Entity ID & Rule Version:** Affected entity and active rule version (e.g. `v2026.1.0-REGULATORY`).
  * **State Change Details:** Previous state vs New state snapshot.
  * **IP Address:** Source network location.

---

#### 10. Regulatory Returns Export
* **Objective:** Export monthly broker returns for compliance auditing.
* **Access Navigation:** `HMO Governance Portal` ➔ Top Navigation Header.
* **Operating Procedure:**
  1. Click **Export Regulatory Returns CSV**.
  2. The system auto-downloads `Regulatory_Broker_Returns_YYYY-MM-DD.csv` containing all active broker codes, RC numbers, NAICOM licenses, tax IDs, tier levels, and operational statuses.

---

### System Safeguards Summary
1. **Zero Duplicate Payments:** Guaranteed via database unique constraint on `source_transaction_id + broker_id + rule_version`.
2. **Kobo Integer Precision:** All monetary amounts are processed in integer kobo to eliminate floating-point rounding errors.
3. **Prospective Rate Versioning:** Rate modifications take effect prospectively unless explicit backdated authorization passes Maker-Checker approval.
4. **Maker-Checker Separation:** Users cannot self-approve rate overrides or bank details without independent checker review.
