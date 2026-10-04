'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AuthPage } from '@/components/AuthPage';
import { BrokerReadOnlyPortal } from '@/components/BrokerReadOnlyPortal';
import { AdminDashboard } from '@/components/AdminDashboard';
import { mockDb, BrokerData, QuoteDealData, EngagementData } from '@/lib/mockDb';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<'BROKER' | 'HMO_ADMIN'>('BROKER');

  // React State initialized from mockDb
  const [brokers, setBrokers] = useState<BrokerData[]>(mockDb.brokers);
  const [currentBroker, setCurrentBroker] = useState<BrokerData>(mockDb.brokers[0]);
  const [plans] = useState(mockDb.plans);
  const [hospitals] = useState(mockDb.hospitals);
  const [deals, setDeals] = useState<QuoteDealData[]>(mockDb.quoteDeals);
  const [engagements, setEngagements] = useState<EngagementData[]>(mockDb.engagements);
  const [commissions] = useState(mockDb.commissions);
  const [documents] = useState(mockDb.documents);

  const handleLogin = (role: 'BROKER' | 'HMO_ADMIN', email: string, brokerData?: BrokerData) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setUserEmail(email);
    if (brokerData) {
      setCurrentBroker(brokerData);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
  };

  const handleRegisterBroker = (newBrokerData: Partial<BrokerData>): BrokerData => {
    const createdBroker: BrokerData = {
      id: `brk-${Date.now()}`,
      userId: `usr-brk-${Date.now()}`,
      companyName: newBrokerData.companyName || 'New Broker Partner',
      brokerType: newBrokerData.brokerType || 'CORPORATE',
      rcNumber: newBrokerData.rcNumber || '',
      naicomLicenseNumber: newBrokerData.naicomLicenseNumber || 'NAICOM/BRK/2024/099',
      naicomExpiryDate: newBrokerData.naicomExpiryDate || '2026-12-31',
      nhiaAccreditationNo: newBrokerData.nhiaAccreditationNo || 'NHIA/ACT/9900',
      taxIdNumber: newBrokerData.taxIdNumber || '',
      vatCompliant: newBrokerData.vatCompliant || false,
      bankName: newBrokerData.bankName || 'GTBank',
      accountNumber: newBrokerData.accountNumber || '0123456789',
      accountName: newBrokerData.accountName || newBrokerData.companyName || 'Validated Broker',
      phone: newBrokerData.phone || '+234 800 000 0000',
      state: newBrokerData.state || 'Lagos',
      lga: newBrokerData.lga || 'Ikeja',
      address: newBrokerData.address || 'Lagos, Nigeria',
      status: 'PENDING_VERIFICATION',
      tierLevel: 'RETAIL_AGENT',
      riskScore: 10,
      ndpaConsent: true,
      quizPassed: false,
      brokerCode: `HMO-BRK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    setBrokers((prev) => [createdBroker, ...prev]);
    return createdBroker;
  };

  const handleCreateDeal = (newDeal: Partial<QuoteDealData>) => {
    const created: QuoteDealData = {
      id: `deal-${Date.now()}`,
      brokerId: currentBroker.id,
      brokerName: currentBroker.companyName,
      companyName: newDeal.companyName || 'New Corporate Client',
      contactPerson: newDeal.contactPerson || 'HR Manager',
      contactEmail: newDeal.contactEmail || 'hr@company.ng',
      contactPhone: newDeal.contactPhone || '+234 800 000 0000',
      stage: newDeal.stage || 'PROPOSAL_SENT',
      totalLives: newDeal.totalLives || 10,
      breakout: newDeal.breakout || [],
      totalPremium: newDeal.totalPremium || 0,
      discountApplied: newDeal.discountApplied || 0,
      notes: newDeal.notes || '',
      createdAt: new Date().toISOString(),
    };

    setDeals([created, ...deals]);
  };

  const handleAddEngagement = (newEng: Partial<EngagementData>) => {
    const created: EngagementData = {
      id: `eng-${Date.now()}`,
      brokerId: currentBroker.id,
      title: newEng.title || 'Client Meeting',
      channel: newEng.channel || 'CALL',
      notes: newEng.notes || '',
      loggedBy: newEng.loggedBy || currentBroker.companyName,
      scheduledAt: newEng.scheduledAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setEngagements([created, ...engagements]);
  };

  const handleUpdateDealStage = (dealId: string, newStage: any) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
  };

  const handleApproveBroker = (brokerId: string, tierLevel: any) => {
    setBrokers((prev) =>
      prev.map((b) =>
        b.id === brokerId
          ? {
              ...b,
              status: 'ACTIVE',
              tierLevel: tierLevel,
              brokerCode: b.brokerCode || `HMO-BRK-${Math.floor(1000 + Math.random() * 9000)}`,
            }
          : b
      )
    );
    alert('Broker application verified and marked ACTIVE!');
  };

  const handleRejectBroker = (brokerId: string, reason: string) => {
    setBrokers((prev) =>
      prev.map((b) =>
        b.id === brokerId
          ? {
              ...b,
              status: 'REJECTED',
              rejectionReason: reason,
            }
          : b
      )
    );
    alert(`Broker application rejected. Reason logged: ${reason}`);
  };

  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={handleLogin}
        mockBrokers={brokers}
        onRegisterBroker={handleRegisterBroker}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0] font-sans text-[#22282B] pb-16">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        userName={currentRole === 'BROKER' ? currentBroker.companyName : 'Dr. Temitope Adebayo'}
        userEmail={userEmail}
        onRoleSwitch={(role) => setCurrentRole(role)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {currentRole === 'HMO_ADMIN' ? (
          <AdminDashboard
            brokers={brokers}
            documents={documents}
            commissions={commissions}
            deals={deals}
            plans={plans}
            hospitals={hospitals}
            engagements={engagements}
            onApproveBroker={handleApproveBroker}
            onRejectBroker={handleRejectBroker}
            onCreateDeal={handleCreateDeal}
            onAddEngagement={handleAddEngagement}
            onUpdateDealStage={handleUpdateDealStage}
          />
        ) : (
          <BrokerReadOnlyPortal
            broker={currentBroker}
            deals={deals}
            commissions={commissions}
          />
        )}
      </main>
    </div>
  );
}
