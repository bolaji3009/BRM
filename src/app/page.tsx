'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BrokerOnboardingForm } from '@/components/BrokerOnboardingForm';
import { QuoteGenerator } from '@/components/QuoteGenerator';
import { TrainingQuizModule } from '@/components/TrainingQuizModule';
import { HospitalSearchModule } from '@/components/HospitalSearchModule';
import { PipelineTracker } from '@/components/PipelineTracker';
import { CommissionLedger } from '@/components/CommissionLedger';
import { AdminDashboard } from '@/components/AdminDashboard';
import { mockDb, BrokerData, QuoteDealData, EngagementData } from '@/lib/mockDb';
import {
  Building2,
  Calculator,
  GraduationCap,
  Hospital,
  TrendingUp,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<'BROKER' | 'HMO_ADMIN'>('BROKER');
  const [activeTab, setActiveTab] = useState<string>('ONBOARDING');

  // React State initialized from mockDb
  const [brokers, setBrokers] = useState<BrokerData[]>(mockDb.brokers);
  const [currentBroker, setCurrentBroker] = useState<BrokerData>(mockDb.brokers[0]);
  const [plans] = useState(mockDb.plans);
  const [hospitals] = useState(mockDb.hospitals);
  const [deals, setDeals] = useState<QuoteDealData[]>(mockDb.quoteDeals);
  const [engagements, setEngagements] = useState<EngagementData[]>(mockDb.engagements);
  const [commissions] = useState(mockDb.commissions);
  const [documents] = useState(mockDb.documents);

  // Handlers for Broker Updates
  const handleUpdateBroker = (updated: Partial<BrokerData>) => {
    const updatedBroker = { ...currentBroker, ...updated };
    setCurrentBroker(updatedBroker);
    setBrokers((prev) => prev.map((b) => (b.id === updatedBroker.id ? updatedBroker : b)));
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

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        userName={currentRole === 'BROKER' ? currentBroker.companyName : 'Dr. Temitope Adebayo'}
        userEmail={currentRole === 'BROKER' ? 'chidi@apexinsurance.ng' : 'admin@miterahealth.com.ng'}
        onRoleSwitch={(role) => {
          setCurrentRole(role);
          if (role === 'HMO_ADMIN') setActiveTab('ADMIN');
          else setActiveTab('ONBOARDING');
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs for Broker View */}
        {currentRole === 'BROKER' && (
          <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200 mb-6 flex items-center space-x-2 overflow-x-auto">
            {[
              { id: 'ONBOARDING', label: '1. KYC Onboarding', icon: Building2 },
              { id: 'TRAINING', label: '2. Ethics Quiz & Cert', icon: GraduationCap },
              { id: 'QUOTE', label: '3. Quote Generator', icon: Calculator },
              { id: 'HOSPITALS', label: '4. Hospital Network', icon: Hospital },
              { id: 'PIPELINE', label: '5. Pipeline & CRM', icon: TrendingUp },
              { id: 'COMMISSION', label: '6. Commissions & Wallet', icon: Wallet },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Content Rendering */}
        {currentRole === 'HMO_ADMIN' || activeTab === 'ADMIN' ? (
          <AdminDashboard
            brokers={brokers}
            documents={documents}
            commissions={commissions}
            deals={deals}
            onApproveBroker={handleApproveBroker}
            onRejectBroker={handleRejectBroker}
          />
        ) : (
          <>
            {activeTab === 'ONBOARDING' && (
              <BrokerOnboardingForm
                broker={currentBroker}
                onUpdateBroker={handleUpdateBroker}
              />
            )}

            {activeTab === 'TRAINING' && (
              <TrainingQuizModule
                broker={currentBroker}
                onUpdateBroker={handleUpdateBroker}
              />
            )}

            {activeTab === 'QUOTE' && (
              <QuoteGenerator
                plans={plans}
                broker={currentBroker}
                onCreateDeal={handleCreateDeal}
              />
            )}

            {activeTab === 'HOSPITALS' && (
              <HospitalSearchModule hospitals={hospitals} />
            )}

            {activeTab === 'PIPELINE' && (
              <PipelineTracker
                deals={deals}
                engagements={engagements}
                broker={currentBroker}
                onAddEngagement={handleAddEngagement}
                onUpdateDealStage={handleUpdateDealStage}
              />
            )}

            {activeTab === 'COMMISSION' && (
              <CommissionLedger
                commissions={commissions}
                broker={currentBroker}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
