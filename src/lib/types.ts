export type Role = 'BROKER' | 'HMO_ADMIN';

export type SBU = 'CORPORATE' | 'RETAIL';

export type BrokerType = 'CORPORATE' | 'RETAIL';

export type OnboardingStatus = 'DRAFT' | 'PENDING_VERIFICATION' | 'IN_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export type TierLevel = 'RETAIL_PARTNER' | 'CORPORATE_BROKER' | 'ELITE_PARTNER';

export type DealStage = 'LEAD' | 'PRICING_REVIEW' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export type CommissionLifecycleStatus =
  | 'IDENTIFIED'
  | 'ACCRUED'
  | 'ELIGIBLE'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PAID'
  | 'DISPUTED'
  | 'REVERSED';

export type HospitalTier = 'TIER_1_BASIC' | 'TIER_2_STANDARD' | 'TIER_3_PREMIUM' | 'TIER_4_EXECUTIVE';

export interface ReferralCodeData {
  id: string;
  code: string;
  brokerId: string;
  brokerName: string;
  deepLink: string;
  commissionRate: number; // e.g. 3% for Retail
  validFrom: string;
  validTo: string;
  isActive: boolean;
  totalConversions: number;
  totalEligiblePremium: number;
  totalCommissionEarned: number;
}

export interface CorporateAgreementData {
  id: string;
  agreementNumber: string;
  brokerId: string;
  brokerName: string;
  clientName: string;
  agreedRate: number; // e.g. 5% or 10%
  brokerSplitPct: number; // e.g. 100% or split 80%
  effectiveFrom: string;
  effectiveTo: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'EXPIRED';
  signedDocumentUrl?: string;
}

export interface PaymentBatchData {
  id: string;
  batchNumber: string;
  sbu: SBU;
  itemCount: number;
  grossAmount: number;
  whtAmount: number;
  netPayoutAmount: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'DISBURSED' | 'RECONCILED';
  createdAt: string;
  approvedBy?: string;
  paymentReference?: string;
}

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

export interface MakerCheckerRequest {
  id: string;
  requestType: 'BANK_DETAIL_CHANGE' | 'HIGH_VALUE_AGREEMENT' | 'MANUAL_ADJUSTMENT' | 'BROKER_ACTIVATION';
  brokerId: string;
  brokerName: string;
  requestedBy: string;
  requestedAt: string;
  oldValue: string;
  newValue: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
}

export interface AuditEventData {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'BROKER' | 'AGREEMENT' | 'COMMISSION' | 'REFERRAL_CODE' | 'BATCH' | 'DISPUTE';
  entityId: string;
  ruleVersion?: string;
  previousState?: string;
  newState: string;
  ipAddress: string;
}

export interface DisputeData {
  id: string;
  disputeNumber: string;
  brokerId: string;
  brokerName: string;
  clientOrCode: string;
  category: 'MISSING_ATTRIBUTION' | 'INCORRECT_RATE' | 'WHT_CALCULATION' | 'DELAYED_PAYOUT';
  explanation: string;
  status: 'OPEN' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  adjustmentAmountKobo?: number;
  linkedAdjustmentType?: 'CREDIT' | 'DEBIT';
  resolutionNotes?: string;
  createdAt: string;
}
