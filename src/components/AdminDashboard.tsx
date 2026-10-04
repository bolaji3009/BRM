import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Check,
  Ban,
} from 'lucide-react';
import { BrokerData, DocumentData, CommissionData, QuoteDealData, PlanData, HospitalData, EngagementData } from '@/lib/mockDb';
import { QuoteGenerator } from '@/components/QuoteGenerator';
import { HospitalSearchModule } from '@/components/HospitalSearchModule';
import { PipelineTracker } from '@/components/PipelineTracker';
import { CommissionLedger } from '@/components/CommissionLedger';

interface AdminDashboardProps {
  brokers: BrokerData[];
  documents: DocumentData[];
  commissions: CommissionData[];
  deals: QuoteDealData[];
  plans: PlanData[];
  hospitals: HospitalData[];
  engagements: EngagementData[];
  onApproveBroker: (brokerId: string, tier: any) => void;
  onRejectBroker: (brokerId: string, reason: string) => void;
  onCreateDeal?: (deal: Partial<QuoteDealData>) => void;
  onAddEngagement?: (eng: Partial<EngagementData>) => void;
  onUpdateDealStage?: (dealId: string, stage: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  brokers,
  documents,
  commissions,
  deals,
  plans,
  hospitals,
  engagements,
  onApproveBroker,
  onRejectBroker,
  onCreateDeal,
  onAddEngagement,
  onUpdateDealStage,
}) => {
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'BROKERS' | 'QUOTE' | 'HOSPITALS' | 'PIPELINE' | 'COMMISSIONS'>('QUEUE');
  const [selectedBroker, setSelectedBroker] = useState<BrokerData | null>(brokers[1] || brokers[0] || null);
  const [selectedTier, setSelectedTier] = useState<string>('CORPORATE_BROKER');

  const pendingBrokers = brokers.filter((b) => b.status === 'PENDING_VERIFICATION' || b.status === 'DRAFT');

  const exportNhiaReturnsCsv = () => {
    const headers = [
      'Broker Code',
      'Company Name',
      'RC Number',
      'NAICOM License',
      'NHIA Accreditation',
      'TIN',
      'Status',
      'Tier Level',
      'State',
      'Phone',
    ];

    const rows = brokers.map((b) => [
      b.brokerCode || 'N/A',
      `"${b.companyName}"`,
      b.rcNumber || 'N/A',
      b.naicomLicenseNumber || 'N/A',
      b.nhiaAccreditationNo || 'N/A',
      b.taxIdNumber || 'N/A',
      b.status,
      b.tierLevel,
      b.state,
      b.phone,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NHIA_Monthly_Broker_Returns_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      {/* Banner */}
      <div className="bg-[#037A86] text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 mb-3">
              <ShieldCheck className="w-4 h-4 text-teal-200" />
              <span>HMO Executive Compliance & Governance Portal</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Multi-Level Broker Review & NHIA Returns</h2>
            <p className="text-teal-100/90 text-sm mt-1">
              Audit submitted CAC & NAICOM docs, assign tier overrides, and export regulatory monthly returns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={exportNhiaReturnsCsv}
              className="px-4 py-2 bg-[#0299A7] hover:bg-[#025F69] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 shrink-0 transition-all border border-teal-300/30"
            >
              <Download className="w-4 h-4" />
              <span>Export NHIA Returns CSV</span>
            </button>

            <div className="flex items-center space-x-1 bg-[#025F69] p-1 rounded-xl border border-teal-600/30 overflow-x-auto">
              <button
                onClick={() => setActiveTab('QUEUE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
                  activeTab === 'QUEUE' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                Review Queue ({pendingBrokers.length})
              </button>
              <button
                onClick={() => setActiveTab('BROKERS')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
                  activeTab === 'BROKERS' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                All Brokers ({brokers.length})
              </button>
              <button
                onClick={() => setActiveTab('QUOTE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
                  activeTab === 'QUOTE' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                Quote Generator
              </button>
              <button
                onClick={() => setActiveTab('HOSPITALS')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
                  activeTab === 'HOSPITALS' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                Hospitals Directory
              </button>
              <button
                onClick={() => setActiveTab('PIPELINE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
                  activeTab === 'PIPELINE' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                CRM Pipeline
              </button>
              <button
                onClick={() => setActiveTab('COMMISSIONS')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all ${
                  activeTab === 'COMMISSIONS' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                Commissions & Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-white">
        {activeTab === 'QUEUE' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Queue List */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Pending Onboarding Applications</h3>
              {pendingBrokers.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBroker(b)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedBroker?.id === b.id
                      ? 'border-[#0299A7] bg-[#E0F2F4] shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{b.companyName}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                      Risk Score: {b.riskScore}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">RC: {b.rcNumber} • NAICOM: {b.naicomLicenseNumber}</p>
                  <p className="text-[11px] text-slate-500 mt-2">Submitted from: {b.state}, Nigeria</p>
                </div>
              ))}

              {pendingBrokers.length === 0 && (
                <div className="p-8 text-center border border-slate-200 rounded-xl bg-slate-50">
                  <CheckCircle2 className="w-8 h-8 text-[#0299A7] mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Review Queue Empty</p>
                  <p className="text-[11px] text-slate-500 mt-1">All broker applications have been audited and verified.</p>
                </div>
              )}
            </div>

            {/* Audit Inspector Panel */}
            {selectedBroker ? (
              <div className="lg:col-span-7 bg-[#F2F2F0] p-6 rounded-2xl border border-slate-200 space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-extrabold text-[#037A86] text-lg">{selectedBroker.companyName}</h3>
                      <p className="text-xs text-slate-600">Contact: {selectedBroker.phone} • {selectedBroker.address}</p>
                    </div>

                    <span className="text-xs bg-[#037A86] text-white font-mono font-bold px-3 py-1 rounded-lg">
                      {selectedBroker.brokerCode || 'PENDING CODE'}
                    </span>
                  </div>

                  {/* Vetting Credentials Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">CAC RC Number</p>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedBroker.rcNumber || 'N/A'}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">NAICOM License</p>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedBroker.naicomLicenseNumber || 'N/A'}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Bank NUBAN</p>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedBroker.accountNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Audit Approval Actions */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Audit Decision & Tier Level Assignment</h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assign Partnership Tier Level</label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#0299A7]"
                    >
                      <option value="RETAIL_AGENT">Retail Agent (Standard 10% split)</option>
                      <option value="CORPORATE_BROKER">Corporate Broker (5% volume tier discount)</option>
                      <option value="ELITE_PARTNER">Elite Corporate Partner (10% volume discount + overriding)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onApproveBroker(selectedBroker.id, selectedTier)}
                      className="w-1/2 py-2.5 bg-[#0299A7] hover:bg-[#037A86] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Activate Broker</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const reason = prompt('Please specify the rejection reason:', 'Expired NAICOM License');
                        if (reason) onRejectBroker(selectedBroker.id, reason);
                      }}
                      className="w-1/2 py-2.5 bg-[#EF8E85] hover:bg-[#D66F66] text-[#22282B] hover:text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : activeTab === 'BROKERS' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="pb-3">Broker Code</th>
                  <th className="pb-3">Broker Name</th>
                  <th className="pb-3">Broker Type</th>
                  <th className="pb-3">NAICOM License</th>
                  <th className="pb-3">Tier Level</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {brokers.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3.5 font-mono font-bold text-[#037A86]">{b.brokerCode || 'N/A'}</td>
                    <td className="py-3.5 font-bold text-slate-900">{b.companyName}</td>
                    <td className="py-3.5 font-semibold text-slate-700">{b.brokerType}</td>
                    <td className="py-3.5 font-mono text-slate-700">{b.naicomLicenseNumber}</td>
                    <td className="py-3.5 font-semibold text-slate-800">{b.tierLevel}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'ACTIVE'
                          ? 'bg-[#E0F2F4] text-[#037A86]'
                          : 'bg-[#FCE8E6] text-[#D66F66]'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'QUOTE' ? (
          <QuoteGenerator
            plans={plans}
            broker={brokers[0]}
            onCreateDeal={onCreateDeal || (() => {})}
          />
        ) : activeTab === 'HOSPITALS' ? (
          <HospitalSearchModule hospitals={hospitals} />
        ) : activeTab === 'PIPELINE' ? (
          <PipelineTracker
            deals={deals}
            engagements={engagements}
            broker={brokers[0]}
            onAddEngagement={onAddEngagement || (() => {})}
            onUpdateDealStage={onUpdateDealStage || (() => {})}
          />
        ) : (
          <CommissionLedger
            commissions={commissions}
            broker={brokers[0]}
          />
        )}
      </div>
    </div>
  );
};
