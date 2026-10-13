import {
  Role,
  BrokerType,
  OnboardingStatus,
  TierLevel,
  HospitalTier,
  DealStage,
  CommissionLifecycleStatus,
  ReferralCodeData,
  CorporateAgreementData,
  PaymentBatchData,
  DisputeData,
} from './types';

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface BrokerData {
  id: string;
  userId: string;
  brokerCode?: string | null;
  brokerType: BrokerType;
  companyName: string;
  rcNumber?: string | null;
  naicomLicenseNumber?: string | null;
  naicomExpiryDate?: string | null;
  nhiaAccreditationNo?: string | null;
  taxIdNumber?: string | null;
  vatCompliant: boolean;
  nin?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  phone: string;
  state: string;
  lga: string;
  address: string;
  status: OnboardingStatus;
  tierLevel: TierLevel;
  riskScore: number;
  ndpaConsent: boolean;
  rejectionReason?: string | null;
  createdAt: string;
}

export interface PlanData {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  annualBaseRate: number;
  minLives: number;
  hospitalTier: HospitalTier;
  features: string[];
}

export interface HospitalData {
  id: string;
  name: string;
  state: string;
  lga: string;
  address: string;
  tier: HospitalTier;
  phone: string;
  email?: string;
  services: string[];
  active: boolean;
}

export interface EngagementData {
  id: string;
  brokerId: string;
  title: string;
  channel: string;
  notes: string;
  loggedBy: string;
  scheduledAt?: string;
  createdAt: string;
}

export interface QuoteBreakoutItem {
  planId: string;
  name: string;
  staffCount: number;
  finalPricePerHead: number;
  subtotal: number;
}

export interface QuoteDealData {
  id: string;
  brokerId: string;
  brokerName?: string;
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  stage: DealStage;
  totalLives: number;
  breakout: QuoteBreakoutItem[];
  totalPremium: number;
  discountApplied: number;
  proposalPdfUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface CommissionData {
  id: string;
  brokerId: string;
  brokerName?: string;
  quoteDealId?: string;
  companyName?: string;
  sbu: 'CORPORATE' | 'RETAIL';
  grossPremium: number;
  commissionRate: number;
  grossCommission: number;
  whtRate: number;
  whtAmount: number;
  netPayout: number;
  status: CommissionLifecycleStatus;
  payoutRef?: string;
  paidAt?: string;
  createdAt: string;
}

export interface DocumentData {
  id: string;
  brokerId: string;
  docType: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isVerified: boolean;
  watermarked: boolean;
  createdAt: string;
}

class MockDatabase {
  users: UserData[] = [
    { id: 'usr-admin-1', email: 'admin@miterahealth.com.ng', name: 'Dr. Temitope Adebayo', role: 'HMO_ADMIN' },
    { id: 'usr-broker-1', email: 'corporate@apexinsurance.ng', name: 'Chidi Okonkwo', role: 'BROKER' },
    { id: 'usr-broker-2', email: 'individual@broker.ng', name: 'Babajide Chukwuma', role: 'BROKER' },
  ];

  brokers: BrokerData[] = [
    {
      id: 'brk-apex-1',
      userId: 'usr-broker-1',
      brokerCode: 'HMO-BRK-1001',
      brokerType: 'CORPORATE',
      companyName: 'Apex Insurance Brokers Ltd',
      rcNumber: 'RC-1294821',
      naicomLicenseNumber: 'NAICOM/BRK/2024/089',
      naicomExpiryDate: '2026-12-31',
      nhiaAccreditationNo: 'NHIA/ACT/9902',
      taxIdNumber: 'TIN-98214019-0001',
      vatCompliant: true,
      nin: '10293847561',
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0123456789',
      accountName: 'Apex Insurance Brokers Ltd',
      phone: '+234 803 111 2233',
      state: 'Lagos',
      lga: 'Ikeja',
      address: '14 Allen Avenue, Ikeja, Lagos',
      status: 'ACTIVE',
      tierLevel: 'ELITE_PARTNER',
      riskScore: 12,
      ndpaConsent: true,
      createdAt: '2024-01-10T09:00:00.000Z',
    },
    {
      id: 'brk-retail-2',
      userId: 'usr-broker-2',
      brokerCode: 'HMO-BRK-2002',
      brokerType: 'RETAIL',
      companyName: 'Babajide Chukwuma',
      rcNumber: null,
      naicomLicenseNumber: null,
      naicomExpiryDate: null,
      nhiaAccreditationNo: null,
      taxIdNumber: 'TIN-48201948-0002',
      vatCompliant: false,
      nin: '99887766554',
      bankName: 'Zenith Bank',
      accountNumber: '2088192039',
      accountName: 'Babajide Chukwuma',
      phone: '+234 802 999 8877',
      state: 'Lagos',
      lga: 'Ikeja',
      address: '12 Allen Avenue, Ikeja, Lagos',
      status: 'ACTIVE',
      tierLevel: 'RETAIL_PARTNER',
      riskScore: 10,
      ndpaConsent: true,
      createdAt: '2024-02-01T12:00:00.000Z',
    },
  ];

  referralCodes: ReferralCodeData[] = [
    {
      id: 'ref-1',
      code: 'MAPP-BABAJIDE-01',
      brokerId: 'brk-retail-2',
      brokerName: 'Babajide Chukwuma',
      deepLink: 'https://mapp.miterahealth.com/enrol?ref=MAPP-BABAJIDE-01',
      commissionRate: 3.0,
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      isActive: true,
      totalConversions: 24,
      totalEligiblePremium: 1200000,
      totalCommissionEarned: 36000,
    },
  ];

  corporateAgreements: CorporateAgreementData[] = [
    {
      id: 'agr-1',
      agreementNumber: 'MTR-AGR-2026-001',
      brokerId: 'brk-apex-1',
      brokerName: 'Apex Insurance Brokers Ltd',
      clientName: 'Zenith Logistics & Maritime Ltd',
      agreedRate: 10.0,
      brokerSplitPct: 100,
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      status: 'APPROVED',
      signedDocumentUrl: '/docs/Signed_Agreement_Zenith.pdf',
    },
  ];

  paymentBatches: PaymentBatchData[] = [
    {
      id: 'batch-1',
      batchNumber: 'MTR-PAY-2026-B1',
      sbu: 'CORPORATE',
      itemCount: 1,
      grossAmount: 2579750,
      whtAmount: 128987.5,
      netPayoutAmount: 2450762.5,
      status: 'DISBURSED',
      createdAt: '2026-03-20T10:00:00.000Z',
      approvedBy: 'Dr. Temitope Adebayo',
      paymentReference: 'GTB-DISB-99210',
    },
  ];

  disputes: DisputeData[] = [
    {
      id: 'disp-1',
      disputeNumber: 'DSP-2026-001',
      brokerId: 'brk-retail-2',
      brokerName: 'Babajide Chukwuma',
      clientOrCode: 'MAPP-BABAJIDE-01',
      category: 'MISSING_ATTRIBUTION',
      explanation: 'Enrolment for Client Mr. Kunle Adeleke on MApp did not auto-attribute code MAPP-BABAJIDE-01.',
      status: 'IN_REVIEW',
      createdAt: '2026-03-22T14:00:00.000Z',
    },
  ];

  plans: PlanData[] = [
    {
      id: 'plan-bronze',
      code: 'MITERA-BRONZE',
      name: 'Mitera Retail Bronze Care',
      category: 'Retail',
      description: 'Essential primary and secondary care coverage for individuals and retail workforce.',
      annualBaseRate: 45000,
      minLives: 1,
      hospitalTier: 'TIER_1_BASIC',
      features: [
        'General & Specialist Consultations',
        'Outpatient Diagnostics & Labs',
        'Inpatient Care (up to ₦250,000/yr)',
        'Basic Dental & Optical Care',
        'Maternity Care (Up to ₦150,000)',
      ],
    },
    {
      id: 'plan-silver',
      code: 'MITERA-SILVER',
      name: 'Mitera Corporate Silver Plan',
      category: 'Corporate',
      description: 'Comprehensive mid-tier corporate plan with wide hospital access across Nigeria.',
      annualBaseRate: 95000,
      minLives: 10,
      hospitalTier: 'TIER_2_STANDARD',
      features: [
        'Unlimited Outpatient Consultations',
        'Advanced Diagnostic Imaging (X-Ray, Ultrasound)',
        'Inpatient Admission (up to ₦750,000/yr)',
        'Comprehensive Dental & Optical Care',
        'Maternity Delivery Cover (up to ₦350,000)',
        'Chronic Illness Management',
      ],
    },
    {
      id: 'plan-gold',
      code: 'MITERA-GOLD',
      name: 'Mitera Executive Gold Care',
      category: 'Corporate',
      description: 'Premium executive healthcare plan including Tier 3/4 top-class hospitals and international telemedicine.',
      annualBaseRate: 220000,
      minLives: 5,
      hospitalTier: 'TIER_3_PREMIUM',
      features: [
        'Executive & VIP Clinic Access (Lagoon, Reddington, St. Nicholas)',
        'Unlimited Inpatient Admission (up to ₦3,500,000/yr)',
        'Global Telemedicine & Specialist Second Opinions',
        'Executive Annual Health Checkup Package',
        'Comprehensive Cancer Screening & Dialysis',
        'Emergency Air Ambulance Support',
      ],
    },
  ];

  hospitals: HospitalData[] = [
    {
      id: 'hosp-1',
      name: 'Lagoon Hospital Victoria Island',
      state: 'Lagos',
      lga: 'Eti-Osa',
      address: '174B Corporation Drive, Victoria Island, Lagos',
      tier: 'TIER_3_PREMIUM',
      phone: '+234 1 271 9000',
      email: 'info@lagoonhospitals.com',
      services: ['General Medicine', 'Surgery', 'Maternity', 'ICU', 'Diagnostics', 'Telemedicine'],
      active: true,
    },
    {
      id: 'hosp-2',
      name: 'Reddington Hospital Ikeja',
      state: 'Lagos',
      lga: 'Ikeja',
      address: '39 Isaac John Street, GRA Ikeja, Lagos',
      tier: 'TIER_3_PREMIUM',
      phone: '+234 1 271 5340',
      email: 'care@reddingtonhospital.com',
      services: ['Cardiology', 'Surgical Center', 'Executive Health', 'Maternity', 'Emergency'],
      active: true,
    },
    {
      id: 'hosp-3',
      name: 'St. Nicholas Hospital Lagos Island',
      state: 'Lagos',
      lga: 'Lagos Island',
      address: '57 Campbell Street, Lagos Island',
      tier: 'TIER_3_PREMIUM',
      phone: '+234 1 280 0600',
      email: 'contact@saintnicholashospital.com',
      services: ['Nephrology', 'Surgery', 'Obstetrics', 'Pediatrics', 'Laboratory'],
      active: true,
    },
  ];

  engagements: EngagementData[] = [
    {
      id: 'eng-1',
      brokerId: 'brk-apex-1',
      title: 'Corporate Pitch Presentation - Zenith Logistics',
      channel: 'MEETING',
      notes: 'Presented Mitera Corporate Gold and Silver plans to HR Director. Agreed on 10% brokerage split.',
      loggedBy: 'Chidi Okonkwo (Apex Insurance)',
      scheduledAt: '2026-03-10T10:00:00.000Z',
      createdAt: '2026-03-10T11:30:00.000Z',
    },
  ];

  quoteDeals: QuoteDealData[] = [
    {
      id: 'deal-1',
      brokerId: 'brk-apex-1',
      brokerName: 'Apex Insurance Brokers Ltd',
      companyName: 'Zenith Logistics & Maritime Ltd',
      contactPerson: 'Engr. Babatunde Sanusi',
      contactEmail: 'b.sanusi@zenithlogistics.ng',
      contactPhone: '+234 802 334 5566',
      stage: 'CLOSED_WON',
      totalLives: 280,
      breakout: [
        { planId: 'plan-gold', name: 'Mitera Executive Gold Care', staffCount: 30, finalPricePerHead: 187000, subtotal: 5610000 },
        { planId: 'plan-silver', name: 'Mitera Corporate Silver Plan', staffCount: 250, finalPricePerHead: 80750, subtotal: 20187500 },
      ],
      totalPremium: 25797500,
      discountApplied: 15,
      notes: '280 employees total. 30 Executives on Gold Plan, 250 Staff on Silver Plan. 15% corporate volume discount applied.',
      createdAt: '2026-03-14T09:00:00.000Z',
    },
  ];

  commissions: CommissionData[] = [
    {
      id: 'comm-1',
      brokerId: 'brk-apex-1',
      brokerName: 'Apex Insurance Brokers Ltd',
      quoteDealId: 'deal-1',
      companyName: 'Zenith Logistics & Maritime Ltd',
      sbu: 'CORPORATE',
      grossPremium: 25797500,
      commissionRate: 10.0,
      grossCommission: 2579750,
      whtRate: 5.0,
      whtAmount: 128987.5,
      netPayout: 2450762.5,
      status: 'PAID',
      payoutRef: 'PAY-MTR-2026-991',
      paidAt: '2026-03-20T16:00:00.000Z',
      createdAt: '2026-03-15T10:00:00.000Z',
    },
    {
      id: 'comm-2',
      brokerId: 'brk-retail-2',
      brokerName: 'Babajide Chukwuma',
      companyName: 'MApp Retail Enrolments (24 Lives)',
      sbu: 'RETAIL',
      grossPremium: 1200000,
      commissionRate: 3.0,
      grossCommission: 36000,
      whtRate: 10.0,
      whtAmount: 3600,
      netPayout: 32400,
      status: 'ELIGIBLE',
      createdAt: '2026-03-21T08:00:00.000Z',
    },
  ];

  documents: DocumentData[] = [
    {
      id: 'doc-1',
      brokerId: 'brk-apex-1',
      docType: 'CAC_CERT',
      fileUrl: '/mock/cac_certificate_apex.pdf',
      fileName: 'CAC_Registration_Certificate_Apex.pdf',
      fileSize: 1024500,
      mimeType: 'application/pdf',
      isVerified: true,
      watermarked: true,
      createdAt: '2026-01-10T09:15:00.000Z',
    },
  ];
}

export const mockDb = new MockDatabase();
