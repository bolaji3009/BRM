export type Role = 'BROKER' | 'HMO_ADMIN';

export type BrokerType = 'INDIVIDUAL' | 'CORPORATE' | 'AGGREGATOR' | 'BANCASSURANCE';

export type OnboardingStatus = 'DRAFT' | 'PENDING_VERIFICATION' | 'IN_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export type TierLevel = 'RETAIL_AGENT' | 'CORPORATE_BROKER' | 'AGGREGATOR' | 'ELITE_PARTNER';

export type VerificationStatus = 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'FAILED';

export type DealStage = 'LEAD' | 'PRICING_REVIEW' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';

export type HospitalTier = 'TIER_1_BASIC' | 'TIER_2_STANDARD' | 'TIER_3_PREMIUM' | 'TIER_4_EXECUTIVE';
