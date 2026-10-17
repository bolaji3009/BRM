# Mitera Health HMO — Broker Relationship Management (BRM) System
## System Administrator Technical Guide & Operating Manual

---

### System Architecture & Security Posture
The **Mitera Health HMO BRM System** is engineered as a high-performance, fault-tolerant platform running on the **Next.js App Router** framework. It enforces **role-based access control (RBAC)**, **maker-checker dual authorization**, **kobo-integer currency precision**, and **immutable audit logging** in compliance with Nigerian NDPA 2023 data residency and financial regulations.

---

### Core System Configurations

```
                 ┌──────────────────────────────────────────────────┐
                 │       SYSTEM ADMINISTRATOR CONTROL HUB           │
                 └────────────────────────┬─────────────────────────┘
                                          │
       ┌───────────────────┬──────────────┴───────────────┬──────────────────┐
       ▼                   ▼                              ▼                  ▼
┌──────────────┐   ┌──────────────┐               ┌──────────────┐   ┌──────────────┐
│ MAKER-CHECKER│   │ RULE VERSION │               │ BANK DISBURS │   │ AUDIT LEDGER │
│  DUAL QUEUE  │   │ EFFECTIVE DATES              │ NUBAN BATCH  │   │ APPEND-ONLY  │
└──────────────┘   └──────────────┘               └──────────────┘   └──────────────┘
```

---

### System Administrator Responsibilities & SOPs

#### 1. Maker-Checker Governance & Dual-Approval Controls
* **Policy:** System Administrators cannot directly modify high-risk parameters without Maker-Checker dual authorization.
* **Trigger Operations:**
  * **Broker Bank NUBAN Account Changes:** Prevents fraudulent payout redirection.
  * **Custom Rate Overrides:** Rate adjustments exceeding the standard 10% commercial band.
  * **Manual Financial Adjustments:** Ledger credits or debit overrides.
  * **Broker Status Changes:** Re-activations or suspensions.
* **Admin Procedure:**
  1. Navigate to `HMO Governance Portal` ➔ `Maker-Checker`.
  2. Inspect `oldValue` vs `newValue` and review the justification.
  3. Approvals execute master data state transitions and record an immutable event in `auditEvents`.

---

#### 2. Effective-Dated Rule Versioning
* **Policy:** All commission calculation rules, corporate agreements, and rate cards are **effective-dated** (`effectiveFrom` / `effectiveTo`).
* **Prospective Principle:** Rule changes apply **prospectively only**. Recalculations store the active `ruleVersion` string (e.g. `v2026.1.0-REGULATORY`) alongside JSON calculation steps to guarantee 100% reproducible results during audits.

---

#### 3. Payment Batches & NUBAN Disbursement File Export
* **Policy:** Prevent duplicate payment processing by generating unique batch keys (`batchNumber`).
* **Procedure:**
  1. Open `Payment Batches`.
  2. Filter by `SBU` (`CORPORATE` or `RETAIL`).
  3. Validate aggregated gross payouts, FIRS WHT deductions (5% Corporate / 10% Individual), and net disbursement amounts.
  4. Export the NUBAN disbursement batch file formatted for GTBank / Zenith Corporate Banking APIs.

---

#### 4. Anti-Abuse & Anti-Self-Referral Controls
* **Policy:** Detect and hold fraudulent retail enrolments submitted by brokers attempting self-referral.
* **Safeguards Engine:**
  * Hashes and compares enrollee **BVN**, **NUBAN account holder name**, **payment card ID**, and **mobile device ID**.
  * Suspends commission accrual automatically if similarity exceeds risk threshold (>10).

---

#### 5. Data Privacy, Encryption & NDPA Data Residency
* **Data Residency:** All database storage and system backups reside within Nigerian jurisdiction or compliant cloud regions with local data backups.
* **Encryption Standards:**
  * **In Transit:** TLS 1.3 encryption across all internal and public API endpoints.
  * **At Rest:** AES-256 database column-level encryption for sensitive PII and bank details.
* **Masking Policy:** System views mask bank account numbers (`******3746`) and tax IDs for non-privileged roles.

---

#### 6. System Backup, Disaster Recovery & Retention
* **RPO (Recovery Point Objective):** < 15 minutes via automated WAL (Write-Ahead Logging) database replication.
* **RTO (Recovery Time Objective):** < 2 hours with automated failover infrastructure.
* **Retention Policy:** Append-only transaction and audit logs retained for 7 years per Nigerian regulatory requirements.
