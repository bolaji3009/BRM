import {
  Role,
  BrokerType,
  OnboardingStatus,
  TierLevel,
  HospitalTier,
  DealStage,
  CommissionStatus,
  VerificationStatus,
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
  bvn?: string | null;
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
  quizPassed: boolean;
  quizScore?: number | null;
  certifiedAt?: string | null;
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
  grossPremium: number;
  commissionRate: number;
  grossCommission: number;
  whtRate: number;
  whtAmount: number;
  netPayout: number;
  status: CommissionStatus;
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

// In-Memory Database Store for robust offline execution & instant reactivity
class MockDatabase {
  users: UserData[] = [
    { id: 'usr-admin-1', email: 'admin@miterahealth.com.ng', name: 'Dr. Temitope Adebayo', role: 'HMO_ADMIN' },
    { id: 'usr-broker-1', email: 'broker@apexinsurance.ng', name: 'Chidi Okonkwo', role: 'BROKER' },
    { id: 'usr-broker-2', email: 'sales@primehealth.ng', name: 'Fatima Umar', role: 'BROKER' },
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
      bvn: '22114455667',
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
      quizPassed: true,
      quizScore: 90,
      certifiedAt: '2024-01-15T10:00:00.000Z',
      createdAt: '2024-01-10T09:00:00.000Z',
    },
    {
      id: 'brk-prime-2',
      userId: 'usr-broker-2',
      brokerCode: 'HMO-BRK-1002',
      brokerType: 'CORPORATE',
      companyName: 'PrimeCare Financial & Insurance Partners',
      rcNumber: 'RC-8839201',
      naicomLicenseNumber: 'NAICOM/BRK/2024/311',
      naicomExpiryDate: '2025-08-30',
      nhiaAccreditationNo: 'NHIA/ACT/4410',
      taxIdNumber: 'TIN-33291048-0001',
      vatCompliant: true,
      nin: '99887766554',
      bvn: '22998877112',
      bankName: 'Zenith Bank',
      accountNumber: '2088192039',
      accountName: 'PrimeCare Financial Partners',
      phone: '+234 802 999 8877',
      state: 'FCT - Abuja',
      lga: 'Abuja Municipal',
      address: 'Plot 450 Central Business District, Abuja',
      status: 'PENDING_VERIFICATION',
      tierLevel: 'CORPORATE_BROKER',
      riskScore: 25,
      ndpaConsent: true,
      quizPassed: true,
      quizScore: 80,
      certifiedAt: '2024-02-01T14:30:00.000Z',
      createdAt: '2024-02-01T12:00:00.000Z',
    },
  ];

  plans: PlanData[] = [
    {
      id: 'plan-bronze',
      code: 'MITERA-BRONZE',
      name: 'Mitera Retail Bronze Care',
      category: 'SME',
      description: 'Essential primary and secondary care coverage for SMEs and retail workforce.',
      annualBaseRate: 45000,
      minLives: 5,
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
    {
      id: 'plan-maternity',
      code: 'MITERA-MATERNITY-CARD',
      name: 'Mitera Maternity Savings Card® Plan',
      category: 'Maternity',
      description: 'Targeted care plan and savings model for expectant mothers and infant healthcare.',
      annualBaseRate: 120000,
      minLives: 1,
      hospitalTier: 'TIER_2_STANDARD',
      features: [
        'Antenatal Care & Routine Scans',
        'Normal Delivery & C-Section Cover',
        'Immunization for Newborns (up to 1 Year)',
        'Postnatal Care & Pediatric Consultations',
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
    {
      id: 'hosp-4',
      name: 'First Cardiology Consultants',
      state: 'Lagos',
      lga: 'Ikoyi',
      address: '20A Lugard Avenue, Ikoyi, Lagos',
      tier: 'TIER_4_EXECUTIVE',
      phone: '+234 1 463 0720',
      email: 'info@firstcardiology.org',
      services: ['Advanced Cardiovascular Care', 'ICU', 'Executive Diagnostics'],
      active: true,
    },
    {
      id: 'hosp-5',
      name: 'Nizamiye Hospital Abuja',
      state: 'FCT - Abuja',
      lga: 'Abuja Municipal',
      address: 'Plot 112 CAD, Sector Centre A, Life Camp, Abuja',
      tier: 'TIER_3_PREMIUM',
      phone: '+234 818 888 8811',
      email: 'info@nizamiye.ng',
      services: ['Trauma Center', 'MRI/CT Scan', 'Neurosurgery', 'Executive Care'],
      active: true,
    },
    {
      id: 'hosp-6',
      name: 'Limi Hospital Abuja',
      state: 'FCT - Abuja',
      lga: 'Abuja Municipal',
      address: '14 Constitution Avenue, Central Business District, Abuja',
      tier: 'TIER_2_STANDARD',
      phone: '+234 9 291 3000',
      email: 'help@limihospital.org',
      services: ['Family Medicine', 'Pediatrics', 'Antenatal', 'Dental', 'Pharmacy'],
      active: true,
    },
    {
      id: 'hosp-7',
      name: 'University College Hospital (UCH) Private Wing',
      state: 'Oyo',
      lga: 'Ibadan North',
      address: 'Queen Elizabeth Road, Ibadan',
      tier: 'TIER_2_STANDARD',
      phone: '+234 2 241 0088',
      email: 'info@uch-ibadan.org.ng',
      services: ['Specialist Care', 'Surgery', 'Oncology', 'Renal Unit'],
      active: true,
    },
    {
      id: 'hosp-8',
      name: 'Memphys Hospital Enugu',
      state: 'Enugu',
      lga: 'Enugu North',
      address: 'Km 2 Enugu-Onitsha Expressway, Enugu',
      tier: 'TIER_2_STANDARD',
      phone: '+234 42 258 800',
      email: 'contact@memphys.org',
      services: ['Neurosurgery', 'Spine Surgery', 'CT Scan', 'Intensive Care'],
      active: true,
    },
    {
      id: 'hosp-9',
      name: 'Bridge Clinic Port Harcourt',
      state: 'Rivers',
      lga: 'Port Harcourt',
      address: '41 Stadium Road, Port Harcourt',
      tier: 'TIER_2_STANDARD',
      phone: '+234 84 303 500',
      email: 'enquiries@thebridgeclinic.com',
      services: ['Fertility', 'Gynecological Care', 'Maternity', 'General OPD'],
      active: true,
    },
  ];

  engagements: EngagementData[] = [
    {
      id: 'eng-1',
      brokerId: 'brk-apex-1',
      title: 'Corporate Pitch Presentation - Zenith Logistics',
      channel: 'MEETING',
      notes: 'Presented Mitera Corporate Gold and Silver plans to HR Director. Requested customized hospital directory list including Lagoon VI.',
      loggedBy: 'Chidi Okonkwo (Apex Insurance)',
      scheduledAt: '2024-03-10T10:00:00.000Z',
      createdAt: '2024-03-10T11:30:00.000Z',
    },
    {
      id: 'eng-2',
      brokerId: 'brk-apex-1',
      title: 'Rate Sheet Verification & Volume Discount Discussion',
      channel: 'CALL',
      notes: 'Agreed on 15% volume tier discount for Zenith Logistics staff count exceeding 250 enrollees.',
      loggedBy: 'Dr. Temitope Adebayo (Mitera HMO)',
      scheduledAt: '2024-03-12T14:00:00.000Z',
      createdAt: '2024-03-12T15:00:00.000Z',
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
      createdAt: '2024-03-14T09:00:00.000Z',
    },
    {
      id: 'deal-2',
      brokerId: 'brk-apex-1',
      brokerName: 'Apex Insurance Brokers Ltd',
      companyName: 'Kwara Agro Industries Ltd',
      contactPerson: 'Hajiya Amina Bello',
      contactEmail: 'a.bello@kwaraagro.com',
      contactPhone: '+234 805 112 3344',
      stage: 'PROPOSAL_SENT',
      totalLives: 120,
      breakout: [
        { planId: 'plan-silver', name: 'Mitera Corporate Silver Plan', staffCount: 120, finalPricePerHead: 80750, subtotal: 9690000 },
      ],
      totalPremium: 9690000,
      discountApplied: 15,
      notes: 'Corporate pitch sent with custom hospital network list in Kwara & Lagos.',
      createdAt: '2024-03-18T11:00:00.000Z',
    },
  ];

  commissions: CommissionData[] = [
    {
      id: 'comm-1',
      brokerId: 'brk-apex-1',
      brokerName: 'Apex Insurance Brokers Ltd',
      quoteDealId: 'deal-1',
      companyName: 'Zenith Logistics & Maritime Ltd',
      grossPremium: 25797500,
      commissionRate: 10.0,
      grossCommission: 2579750,
      whtRate: 5.0,
      whtAmount: 128987.5,
      netPayout: 2450762.5,
      status: 'PAID',
      payoutRef: 'PAY-MTR-2024-991',
      paidAt: '2024-03-20T16:00:00.000Z',
      createdAt: '2024-03-15T10:00:00.000Z',
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
      createdAt: '2024-01-10T09:15:00.000Z',
    },
    {
      id: 'doc-2',
      brokerId: 'brk-apex-1',
      docType: 'NAICOM_LICENSE',
      fileUrl: '/mock/naicom_license_apex.pdf',
      fileName: 'NAICOM_Broker_License_2024.pdf',
      fileSize: 840200,
      mimeType: 'application/pdf',
      isVerified: true,
      watermarked: true,
      createdAt: '2024-01-10T09:16:00.000Z',
    },
    {
      id: 'doc-3',
      brokerId: 'brk-prime-2',
      docType: 'CAC_CERT',
      fileUrl: '/mock/cac_certificate_prime.pdf',
      fileName: 'CAC_Cert_PrimeCare.pdf',
      fileSize: 950000,
      mimeType: 'application/pdf',
      isVerified: false,
      watermarked: true,
      createdAt: '2024-02-01T12:05:00.000Z',
    },
  ];
}

export const mockDb = new MockDatabase();
