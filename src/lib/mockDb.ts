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
  MakerCheckerRequest,
  AuditEventData,
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
  taxIdNumber?: string | null;
  vatCompliant: boolean;
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
      taxIdNumber: 'TIN-98214019-0001',
      vatCompliant: true,
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
      taxIdNumber: 'TIN-48201948-0002',
      vatCompliant: false,
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
    // CORPORATE PLANS - 30+ members
    {
      id: 'plan-mi-shield',
      code: 'MTR-CORP-SHIELD',
      name: 'Mi Shield Plan',
      category: 'Corporate (30+ Members)',
      description: 'Baseline corporate health plan covering core inpatient, outpatient, and general consultations.',
      annualBaseRate: 65000,
      minLives: 30,
      hospitalTier: 'TIER_2_STANDARD',
      features: ['General Consultations', 'Outpatient Labs', 'Inpatient Admission', 'Emergency Care'],
    },
    {
      id: 'plan-mi-gem',
      code: 'MTR-CORP-GEM',
      name: 'MI Gem Plan',
      category: 'Corporate (30+ Members)',
      description: 'Mid-tier corporate healthcare cover with expanded specialist and dental benefits.',
      annualBaseRate: 95000,
      minLives: 30,
      hospitalTier: 'TIER_2_STANDARD',
      features: ['Specialist Consultations', 'Advanced Diagnostics', 'Inpatient Care', 'Basic Dental & Optical'],
    },
    {
      id: 'plan-mi-crystal',
      code: 'MTR-CORP-CRYSTAL',
      name: 'MI Crystal Plan',
      category: 'Corporate (30+ Members)',
      description: 'Comprehensive corporate cover with access to top regional hospitals and surgeries.',
      annualBaseRate: 145000,
      minLives: 30,
      hospitalTier: 'TIER_3_PREMIUM',
      features: ['Specialist & VIP Clinics', 'Comprehensive Surgery Cover', 'Maternity Care', 'Advanced Dental'],
    },
    {
      id: 'plan-mi-platinum-corp',
      code: 'MTR-CORP-PLATINUM',
      name: 'MI Platinum Plan',
      category: 'Corporate (30+ Members)',
      description: 'Executive corporate healthcare tier with premier hospital network access nationwide.',
      annualBaseRate: 220000,
      minLives: 30,
      hospitalTier: 'TIER_3_PREMIUM',
      features: ['VIP Hospital Access', 'Chronic Disease Care', 'Maternity Delivery', 'Annual Executive Health Check'],
    },
    {
      id: 'plan-mi-elite',
      code: 'MTR-CORP-ELITE',
      name: 'MI Elite Plan',
      category: 'Corporate (30+ Members)',
      description: 'Flagship VIP corporate suite including international second opinion and air ambulance evacuation.',
      annualBaseRate: 380000,
      minLives: 30,
      hospitalTier: 'TIER_4_EXECUTIVE',
      features: ['Executive Clinics (Lagoon, Reddington, St. Nicholas)', 'Global Telemedicine', 'Air Ambulance Evacuation', 'Comprehensive Care'],
    },

    // SME / SMALL GROUP PLANS - 3-30 members
    {
      id: 'plan-mi-lite',
      code: 'MTR-SME-LITE',
      name: 'Mi Lite Plan',
      category: 'SME / Small Group (3-30 Members)',
      description: 'Affordable primary care coverage designed for small business teams.',
      annualBaseRate: 48000,
      minLives: 3,
      hospitalTier: 'TIER_1_BASIC',
      features: ['Primary Consultations', 'Basic Outpatient Medicine', 'Emergency Care'],
    },
    {
      id: 'plan-mi-classic-sme',
      code: 'MTR-SME-CLASSIC',
      name: 'Mi Classic Plan',
      category: 'SME / Small Group (3-30 Members)',
      description: 'Balanced healthcare coverage for growing small and medium businesses.',
      annualBaseRate: 72000,
      minLives: 3,
      hospitalTier: 'TIER_2_STANDARD',
      features: ['General & Specialist Consultations', 'Inpatient Admission', 'Basic Dental Care'],
    },
    {
      id: 'plan-mi-gold-sme',
      code: 'MTR-SME-GOLD',
      name: 'Mi Gold Plan',
      category: 'SME / Small Group (3-30 Members)',
      description: 'Enhanced SME plan with maternity and optical care benefits.',
      annualBaseRate: 110000,
      minLives: 3,
      hospitalTier: 'TIER_2_STANDARD',
      features: ['Full Inpatient & Outpatient', 'Maternity Cover', 'Optical & Dental', 'Wellness Checkup'],
    },
    {
      id: 'plan-mi-gold-plus-sme',
      code: 'MTR-SME-GOLD-PLUS',
      name: 'Mi Gold+ Plus Plan',
      category: 'SME / Small Group (3-30 Members)',
      description: 'Premium SME health tier offering premium hospital access for small teams.',
      annualBaseRate: 165000,
      minLives: 3,
      hospitalTier: 'TIER_3_PREMIUM',
      features: ['Tier 3 Premium Hospitals', 'Advanced Diagnostics', 'Comprehensive Maternity', 'Physiotherapy'],
    },

    // RETAIL PLANS - Individuals & Families
    {
      id: 'plan-mi-basic-retail',
      code: 'MTR-RETAIL-BASIC',
      name: 'Mi Basic Plan',
      category: 'Retail (Individuals & Families)',
      description: 'Essential health cover for individuals seeking baseline medical security.',
      annualBaseRate: 42000,
      minLives: 1,
      hospitalTier: 'TIER_1_BASIC',
      features: ['General Consultations', 'Basic Outpatient Care', 'Inpatient Stabilization'],
    },
    {
      id: 'plan-mi-classic-retail',
      code: 'MTR-RETAIL-CLASSIC',
      name: 'Mi Classic Plan',
      category: 'Retail (Individuals & Families)',
      description: 'Standard individual and family plan with comprehensive primary care.',
      annualBaseRate: 68000,
      minLives: 1,
      hospitalTier: 'TIER_2_STANDARD',
      features: ['Outpatient & Inpatient Care', 'Basic Surgeries', 'Maternity Care'],
    },
    {
      id: 'plan-mi-platinum-retail',
      code: 'MTR-RETAIL-PLATINUM',
      name: 'Mi Platinum Plan',
      category: 'Retail (Individuals & Families)',
      description: 'Top-tier retail plan with premium hospital network access for families.',
      annualBaseRate: 185000,
      minLives: 1,
      hospitalTier: 'TIER_3_PREMIUM',
      features: ['Premium Clinics', 'Full Dental & Optical', 'Advanced Diagnostics', 'Comprehensive Inpatient'],
    },

    // ELDERLY CARE PLANS - 60+ years
    {
      id: 'plan-elderly',
      code: 'MTR-CARE-ELDERLY',
      name: 'Elderly Plan',
      category: 'Elderly Care (60+ Years)',
      description: 'Specialized healthcare coverage tailored for senior citizens aged 60 and above.',
      annualBaseRate: 135000,
      minLives: 1,
      hospitalTier: 'TIER_2_STANDARD',
      features: ['Chronic Disease Management (Hypertension, Diabetes)', 'Specialist Geriatric Care', 'Physiotherapy'],
    },
    {
      id: 'plan-elderly-plus',
      code: 'MTR-CARE-ELDERLY-PLUS',
      name: 'Elderly+ Plan',
      category: 'Elderly Care (60+ Years)',
      description: 'Comprehensive senior care package with home nursing support and premium hospital access.',
      annualBaseRate: 240000,
      minLives: 1,
      hospitalTier: 'TIER_3_PREMIUM',
      features: ['Premium Hospital Access', 'Home Nursing Visits', 'Comprehensive Cardiac & Renal Care'],
    },

    // MATERNITY PLAN
    {
      id: 'plan-maternity',
      code: 'MTR-CARE-MATERNITY',
      name: 'Maternity Plan',
      category: 'Maternity Special Cover',
      description: 'Dedicated maternal and infant care package covering antenatal, delivery, and postnatal care.',
      annualBaseRate: 125000,
      minLives: 1,
      hospitalTier: 'TIER_2_STANDARD',
      features: ['Antenatal Consultations & Scans', 'Normal & C-Section Delivery Cover', 'Immunization for Newborn'],
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

  makerCheckerRequests: MakerCheckerRequest[] = [
    {
      id: 'mc-101',
      requestType: 'BANK_DETAIL_CHANGE',
      brokerId: 'brk-apex-1',
      brokerName: 'Apex Insurance Brokers Ltd',
      requestedBy: 'Chidi Okonkwo (Broker Admin)',
      requestedAt: '2026-03-24T11:20:00.000Z',
      oldValue: 'GTBank - 0123456789 (Apex Insurance Brokers)',
      newValue: 'Zenith Bank - 1019283746 (Apex Insurance Brokers)',
      status: 'PENDING_REVIEW',
      reason: 'Corporate account migration to Zenith Corporate Banking',
    },
    {
      id: 'mc-102',
      requestType: 'HIGH_VALUE_AGREEMENT',
      brokerId: 'brk-apex-1',
      brokerName: 'Apex Insurance Brokers Ltd',
      requestedBy: 'Sales Lead (Corporate SBU)',
      requestedAt: '2026-03-23T16:45:00.000Z',
      oldValue: 'Standard Tier Rate (5.0%)',
      newValue: 'Custom Agreed Rate (12.5%) for Dangote Foods (5000 lives)',
      status: 'PENDING_REVIEW',
      reason: 'Institutional Account rate override - exceeds standard 10% threshold',
    },
  ];

  auditEvents: AuditEventData[] = [
    {
      id: 'aud-201',
      timestamp: '2026-03-24T12:00:00.000Z',
      actorId: 'usr-admin-1',
      actorName: 'Dr. Temitope Adebayo',
      actorRole: 'HMO_ADMIN',
      action: 'APPROVE_AGREEMENT',
      entityType: 'AGREEMENT',
      entityId: 'agr-1',
      ruleVersion: 'v2026.1.0',
      previousState: 'DRAFT',
      newState: 'APPROVED (Agreed Rate: 10.0%, Effective: 2026-01-01 to 2026-12-31)',
      ipAddress: '102.89.23.14',
    },
    {
      id: 'aud-202',
      timestamp: '2026-03-20T16:00:00.000Z',
      actorId: 'usr-admin-1',
      actorName: 'Dr. Temitope Adebayo',
      actorRole: 'HMO_ADMIN',
      action: 'DISBURSE_PAYMENT_BATCH',
      entityType: 'BATCH',
      entityId: 'batch-1',
      ruleVersion: 'v2026.1.0',
      previousState: 'APPROVED',
      newState: 'DISBURSED (Net Disbursement: ₦2,450,762.50, Ref: GTB-DISB-99210)',
      ipAddress: '102.89.23.14',
    },
    {
      id: 'aud-203',
      timestamp: '2026-03-15T10:00:00.000Z',
      actorId: 'SYSTEM_ENGINE',
      actorName: 'Mitera Commission Engine',
      actorRole: 'SYSTEM',
      action: 'CALCULATE_COMMISSION',
      entityType: 'COMMISSION',
      entityId: 'comm-1',
      ruleVersion: 'v2026.1.0',
      previousState: 'NONE',
      newState: 'ACCRUED (Eligible Premium: ₦25,797,500.00, Gross Commission: ₦2,579,750.00)',
      ipAddress: '127.0.0.1',
    },
  ];
}

export const mockDb = new MockDatabase();
