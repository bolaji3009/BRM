import { PrismaClient, Role, BrokerType, OnboardingStatus, TierLevel, HospitalTier, DealStage, CommissionStatus } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Mitera Health BRM Database...');

  // Clean existing data
  await db.commission.deleteMany();
  await db.quoteDeal.deleteMany();
  await db.engagement.deleteMany();
  await db.hospital.deleteMany();
  await db.rateCard.deleteMany();
  await db.plan.deleteMany();
  await db.kYCVerification.deleteMany();
  await db.document.deleteMany();
  await db.broker.deleteMany();
  await db.user.deleteMany();

  // Create Users & Brokers
  // 1. HMO Admin
  const adminUser = await db.user.create({
    data: {
      email: 'admin@miterahealth.com.ng',
      name: 'Dr. Temitope Adebayo',
      password: 'password123',
      role: Role.HMO_ADMIN,
    },
  });

  // 2. Demo Active Broker
  const brokerUser1 = await db.user.create({
    data: {
      email: 'broker@apexinsurance.ng',
      name: 'Chidi Okonkwo',
      password: 'password123',
      role: Role.BROKER,
    },
  });

  const broker1 = await db.broker.create({
    data: {
      userId: brokerUser1.id,
      brokerCode: 'HMO-BRK-1001',
      brokerType: BrokerType.CORPORATE,
      companyName: 'Apex Insurance Brokers Ltd',
      rcNumber: 'RC-1294821',
      naicomLicenseNumber: 'NAICOM/BRK/2024/089',
      naicomExpiryDate: new Date('2026-12-31'),
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
      status: OnboardingStatus.ACTIVE,
      tierLevel: TierLevel.ELITE_PARTNER,
      riskScore: 12,
      ndpaConsent: true,
      quizPassed: true,
      quizScore: 90,
      certifiedAt: new Date(),
    },
  });

  // 3. Demo Pending Broker
  const brokerUser2 = await db.user.create({
    data: {
      email: 'sales@primehealth.ng',
      name: 'Fatima Umar',
      password: 'password123',
      role: Role.BROKER,
    },
  });

  const broker2 = await db.broker.create({
    data: {
      userId: brokerUser2.id,
      brokerCode: 'HMO-BRK-1002',
      brokerType: BrokerType.CORPORATE,
      companyName: 'PrimeCare Financial & Insurance Partners',
      rcNumber: 'RC-8839201',
      naicomLicenseNumber: 'NAICOM/BRK/2024/311',
      naicomExpiryDate: new Date('2025-08-30'),
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
      status: OnboardingStatus.PENDING_VERIFICATION,
      tierLevel: TierLevel.CORPORATE_BROKER,
      riskScore: 25,
      ndpaConsent: true,
      quizPassed: true,
      quizScore: 80,
      certifiedAt: new Date(),
    },
  });

  // Create Plans
  const planBronze = await db.plan.create({
    data: {
      code: 'MITERA-BRONZE',
      name: 'Mitera Retail Bronze Care',
      category: 'SME',
      description: 'Essential primary and secondary care coverage for SMEs and retail workforce.',
      annualBaseRate: 45000,
      minLives: 5,
      hospitalTier: HospitalTier.TIER_1_BASIC,
      featuresJson: JSON.stringify([
        'General & Specialist Consultations',
        'Outpatient Diagnostics & Labs',
        'Inpatient Care (up to ₦250,000/yr)',
        'Basic Dental & Optical Care',
        'Maternity Care (Up to ₦150,000)',
      ]),
    },
  });

  const planSilver = await db.plan.create({
    data: {
      code: 'MITERA-SILVER',
      name: 'Mitera Corporate Silver Plan',
      category: 'Corporate',
      description: 'Comprehensive mid-tier corporate plan with wide hospital access across Nigeria.',
      annualBaseRate: 95000,
      minLives: 10,
      hospitalTier: HospitalTier.TIER_2_STANDARD,
      featuresJson: JSON.stringify([
        'Unlimited Outpatient Consultations',
        'Advanced Diagnostic Imaging (X-Ray, Ultrasound)',
        'Inpatient Admission (up to ₦750,000/yr)',
        'Comprehensive Dental & Optical Care',
        'Maternity Delivery Cover (up to ₦350,000)',
        'Chronic Illness Management',
      ]),
    },
  });

  const planGold = await db.plan.create({
    data: {
      code: 'MITERA-GOLD',
      name: 'Mitera Executive Gold Care',
      category: 'Corporate',
      description: 'Premium executive healthcare plan including Tier 3/4 top-class hospitals and international telemedicine.',
      annualBaseRate: 220000,
      minLives: 5,
      hospitalTier: HospitalTier.TIER_3_PREMIUM,
      featuresJson: JSON.stringify([
        'Executive & VIP Clinic Access (Lagoon, Reddington, St. Nicholas)',
        'Unlimited Inpatient Admission (up to ₦3,500,000/yr)',
        'Global Telemedicine & Specialist Second Opinions',
        'Executive Annual Health Checkup Package',
        'Comprehensive Cancer Screening & Dialysis',
        'Emergency Air Ambulance Support',
      ]),
    },
  });

  const planMaternity = await db.plan.create({
    data: {
      code: 'MITERA-MATERNITY-CARD',
      name: 'Mitera Maternity Savings Card® Plan',
      category: 'Maternity',
      description: 'Targeted care plan and savings model for expectant mothers and infant healthcare.',
      annualBaseRate: 120000,
      minLives: 1,
      hospitalTier: HospitalTier.TIER_2_STANDARD,
      featuresJson: JSON.stringify([
        'Antenatal Care & Routine Scans',
        'Normal Delivery & C-Section Cover',
        'Immunization for Newborns (up to 1 Year)',
        'Postnatal Care & Pediatric Consultations',
      ]),
    },
  });

  // Create Rate Cards for Tiers
  await db.rateCard.createMany({
    data: [
      { planId: planBronze.id, tierLevel: TierLevel.RETAIL_AGENT, discountPercentage: 0, customBasePrice: 45000 },
      { planId: planBronze.id, tierLevel: TierLevel.ELITE_PARTNER, discountPercentage: 5, customBasePrice: 42750 },
      { planId: planSilver.id, tierLevel: TierLevel.RETAIL_AGENT, discountPercentage: 0, customBasePrice: 95000 },
      { planId: planSilver.id, tierLevel: TierLevel.CORPORATE_BROKER, discountPercentage: 5, customBasePrice: 90250 },
      { planId: planSilver.id, tierLevel: TierLevel.ELITE_PARTNER, discountPercentage: 10, customBasePrice: 85500 },
      { planId: planGold.id, tierLevel: TierLevel.RETAIL_AGENT, discountPercentage: 0, customBasePrice: 220000 },
      { planId: planGold.id, tierLevel: TierLevel.ELITE_PARTNER, discountPercentage: 12, customBasePrice: 193600 },
    ],
  });

  // Create Hospitals Network Seed Data
  await db.hospital.createMany({
    data: [
      {
        name: 'Lagoon Hospital Victoria Island',
        state: 'Lagos',
        lga: 'Eti-Osa',
        address: '174B Corporation Drive, Victoria Island, Lagos',
        tier: HospitalTier.TIER_3_PREMIUM,
        phone: '+234 1 271 9000',
        email: 'info@lagoonhospitals.com',
        services: 'General Medicine, Surgery, Maternity, ICU, Diagnostics, Telemedicine',
      },
      {
        name: 'Reddington Hospital Ikeja',
        state: 'Lagos',
        lga: 'Ikeja',
        address: '39 Isaac John Street, GRA Ikeja, Lagos',
        tier: HospitalTier.TIER_3_PREMIUM,
        phone: '+234 1 271 5340',
        email: 'care@reddingtonhospital.com',
        services: 'Cardiology, Surgical Center, Executive Health, Maternity, Emergency',
      },
      {
        name: 'St. Nicholas Hospital Lagos Island',
        state: 'Lagos',
        lga: 'Lagos Island',
        address: '57 Campbell Street, Lagos Island',
        tier: HospitalTier.TIER_3_PREMIUM,
        phone: '+234 1 280 0600',
        email: 'contact@saintnicholashospital.com',
        services: 'Nephrology, Surgery, Obstetrics, Pediatrics, Laboratory',
      },
      {
        name: 'First Cardiology Consultants',
        state: 'Lagos',
        lga: 'Ikoyi',
        address: '20A Lugard Avenue, Ikoyi, Lagos',
        tier: HospitalTier.TIER_4_EXECUTIVE,
        phone: '+234 1 463 0720',
        email: 'info@firstcardiology.org',
        services: 'Advanced Cardiovascular Care, ICU, Executive Diagnostics',
      },
      {
        name: 'Nizamiye Hospital Abuja',
        state: 'FCT - Abuja',
        lga: 'Abuja Municipal',
        address: 'Plot 112 CAD, Sector Centre A, Life Camp, Abuja',
        tier: HospitalTier.TIER_3_PREMIUM,
        phone: '+234 818 888 8811',
        email: 'info@nizamiye.ng',
        services: 'Trauma Center, MRI/CT Scan, Neurosurgery, Executive Care',
      },
      {
        name: 'Limi Hospital Abuja',
        state: 'FCT - Abuja',
        lga: 'Abuja Municipal',
        address: '14 Constitution Avenue, Central Business District, Abuja',
        tier: HospitalTier.TIER_2_STANDARD,
        phone: '+234 9 291 3000',
        email: 'help@limihospital.org',
        services: 'Family Medicine, Pediatrics, Antenatal, Dental, Pharmacy',
      },
      {
        name: 'University College Hospital (UCH) Private Wing',
        state: 'Oyo',
        lga: 'Ibadan North',
        address: 'Queen Elizabeth Road, Ibadan',
        tier: HospitalTier.TIER_2_STANDARD,
        phone: '+234 2 241 0088',
        email: 'info@uch-ibadan.org.ng',
        services: 'Specialist Care, Surgery, Oncology, Renal Unit',
      },
      {
        name: 'Memphys Hospital Enugu',
        state: 'Enugu',
        lga: 'Enugu North',
        address: 'Km 2 Enugu-Onitsha Expressway, Enugu',
        tier: HospitalTier.TIER_2_STANDARD,
        phone: '+234 42 258 800',
        email: 'contact@memphys.org',
        services: 'Neurosurgery, Spine Surgery, CT Scan, Intensive Care',
      },
      {
        name: 'Bridge Clinic Port Harcourt',
        state: 'Rivers',
        lga: 'Port Harcourt',
        address: '41 Stadium Road, Port Harcourt',
        tier: HospitalTier.TIER_2_STANDARD,
        phone: '+234 84 303 500',
        email: 'enquiries@thebridgeclinic.com',
        services: 'Fertility, Gynecological Care, Maternity, General OPD',
      },
    ],
  });

  // Create Deals & Quotes
  const quote1 = await db.quoteDeal.create({
    data: {
      brokerId: broker1.id,
      companyName: 'Zenith Logistics & Maritime Ltd',
      contactPerson: 'Engr. Babatunde Sanusi',
      contactEmail: 'b.sanusi@zenithlogistics.ng',
      contactPhone: '+234 802 334 5566',
      stage: DealStage.PROPOSAL_SENT,
      totalLives: 280,
      breakoutJson: JSON.stringify([
        { planId: planGold.id, name: 'Mitera Executive Gold Care', staffCount: 30, finalPricePerHead: 187000, subtotal: 5610000 },
        { planId: planSilver.id, name: 'Mitera Corporate Silver Plan', staffCount: 250, finalPricePerHead: 80750, subtotal: 20187500 },
      ]),
      totalPremium: 25797500,
      discountApplied: 15,
      notes: '280 employees total. 30 Executives on Gold Plan, 250 Staff on Silver Plan. 15% corporate volume discount applied.',
    },
  });

  // Create Engagement Log
  await db.engagement.create({
    data: {
      brokerId: broker1.id,
      title: 'Corporate Pitch Presentation - Zenith Logistics',
      channel: 'MEETING',
      notes: 'Presented Mitera Corporate Gold and Silver plans to HR Director. Requested customized hospital directory list including Lagoon VI.',
      loggedBy: 'Chidi Okonkwo (Apex Insurance)',
      scheduledAt: new Date(),
    },
  });

  // Create Commission Entry
  await db.commission.create({
    data: {
      brokerId: broker1.id,
      quoteDealId: quote1.id,
      grossPremium: 25797500,
      commissionRate: 10.0,
      grossCommission: 25797500 * 0.10, // 2,579,750
      whtRate: 5.0, // 5% corporate tax withholding
      whtAmount: (25797500 * 0.10) * 0.05, // 128,987.5
      netPayout: (25797500 * 0.10) * 0.95, // 2,450,762.5
      status: CommissionStatus.PAID,
      payoutRef: 'PAY-MTR-2024-991',
      paidAt: new Date(),
    },
  });

  console.log('✅ Mitera Health BRM Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
