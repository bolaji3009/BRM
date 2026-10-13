import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Check,
  Ban,
  FileText,
  CreditCard,
  AlertCircle,
  Plus,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { BrokerData, DocumentData, CommissionData, QuoteDealData, PlanData, HospitalData, EngagementData, mockDb } from '@/lib/mockDb';
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
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'BROKERS' | 'AGREEMENTS' | 'REFERRALS' | 'BATCHES' | 'DISPUTES' | 'QUOTE' | 'HOSPITALS' | 'PIPELINE' | 'COMMISSIONS'>('QUEUE');
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
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E3] overflow-hidden">
      {/* Light Clean Hero Banner per Mitera 70/20/10 Guidelines */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 border-b border-[#E5E5E3]">
        {/* Top Header Row with Title & Export Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#E0F2F4] text-[#0299A7] text-xs font-bold px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-4 h-4 text-[#0299A7]" />
              <span>HMO Executive Compliance & Governance Portal</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#22282B]">Broker Governance, SBUs & Settlement Hub</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Govern Corporate agreements, Retail MApp referral codes, commission batches, and regulatory NHIA monthly returns.
            </p>
          </div>

          <button
            onClick={exportNhiaReturnsCsv}
            className="px-4 py-2.5 bg-[#0299A7] hover:bg-[#037A86] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 shrink-0 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export NHIA Returns CSV</span>
          </button>
        </div>

        {/* Tab Navigation Bar placed below the Export Button */}
        <div className="pt-4 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('QUEUE')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'QUEUE'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Review Queue ({pendingBrokers.length})
            </button>
            <button
              onClick={() => setActiveTab('BROKERS')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'BROKERS'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Brokers ({brokers.length})
            </button>
            <button
              onClick={() => setActiveTab('AGREEMENTS')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'AGREEMENTS'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Corporate Agreements
            </button>
            <button
              onClick={() => setActiveTab('REFERRALS')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'REFERRALS'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Retail Codes
            </button>
            <button
              onClick={() => setActiveTab('BATCHES')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'BATCHES'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Payment Batches
            </button>
            <button
              onClick={() => setActiveTab('DISPUTES')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'DISPUTES'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Disputes ({mockDb.disputes.length})
            </button>
            <button
              onClick={() => setActiveTab('QUOTE')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'QUOTE'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Quote Generator
            </button>
            <button
              onClick={() => setActiveTab('HOSPITALS')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'HOSPITALS'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Hospitals Directory
            </button>
            <button
              onClick={() => setActiveTab('PIPELINE')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'PIPELINE'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              CRM Pipeline
            </button>
            <button
              onClick={() => setActiveTab('COMMISSIONS')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'COMMISSIONS'
                  ? 'bg-[#0299A7] text-white shadow-xs'
                  : 'bg-[#F2F2F0] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Commissions Ledger
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-white">
        {activeTab === 'QUEUE' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Queue List */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-bold text-[#22282B] text-sm mb-3">Pending Onboarding Applications</h3>
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
                    <span className="text-[10px] bg-[#FCE8E6] text-[#D66F66] font-extrabold px-2 py-0.5 rounded-full">
                      Risk Score: {b.riskScore}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">SBU: {b.brokerType} • RC: {b.rcNumber || 'N/A'}</p>
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
                      <p className="text-xs text-slate-600">Contact: {selectedBroker.phone} • SBU: {selectedBroker.brokerType}</p>
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
                      <option value="RETAIL_PARTNER">Retail Partner (3% MApp referral split)</option>
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
                  <th className="pb-3">SBU SBU Type</th>
                  <th className="pb-3">NAICOM / TIN</th>
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
                    <td className="py-3.5 font-mono text-slate-700">{b.naicomLicenseNumber || b.taxIdNumber || 'N/A'}</td>
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
        ) : activeTab === 'AGREEMENTS' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#037A86]">Corporate SBU Negotiated Agreements</h3>
                <p className="text-xs text-slate-600">Effective-dated brokerage rate agreements linked to corporate clients and policy groups.</p>
              </div>
              <button
                onClick={() => {
                  const client = prompt('Enter Corporate Client Name:', 'Dangote Foods Plc');
                  if (client) {
                    mockDb.corporateAgreements.push({
                      id: `agr-${Date.now()}`,
                      agreementNumber: `MTR-AGR-2026-0${mockDb.corporateAgreements.length + 1}`,
                      brokerId: brokers[0].id,
                      brokerName: brokers[0].companyName,
                      clientName: client,
                      agreedRate: 10.0,
                      brokerSplitPct: 100,
                      effectiveFrom: '2026-01-01',
                      effectiveTo: '2026-12-31',
                      status: 'APPROVED',
                    });
                    alert('Corporate agreement configured and activated!');
                  }
                }}
                className="px-4 py-2 bg-[#0299A7] hover:bg-[#037A86] text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Configure Corporate Agreement</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="pb-3">Agreement No.</th>
                    <th className="pb-3">Broker Partner</th>
                    <th className="pb-3">Corporate Client</th>
                    <th className="pb-3">Agreed Rate</th>
                    <th className="pb-3">Split %</th>
                    <th className="pb-3">Effective Window</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockDb.corporateAgreements.map((agr) => (
                    <tr key={agr.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-[#037A86]">{agr.agreementNumber}</td>
                      <td className="py-3 font-bold text-slate-900">{agr.brokerName}</td>
                      <td className="py-3 text-slate-800">{agr.clientName}</td>
                      <td className="py-3 font-mono font-bold text-[#0299A7]">{agr.agreedRate}%</td>
                      <td className="py-3 font-semibold text-slate-700">{agr.brokerSplitPct}%</td>
                      <td className="py-3 font-mono text-slate-600">{agr.effectiveFrom} to {agr.effectiveTo}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2F4] text-[#037A86]">
                          {agr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'REFERRALS' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#037A86]">Retail SBU Referral Code Management</h3>
                <p className="text-xs text-slate-600">Track MApp referral links, enrolment conversion attribution, and anti-self-referral checks.</p>
              </div>
              <button
                onClick={() => {
                  const code = prompt('Enter Unique Referral Code:', 'MAPP-MITERA-2026');
                  if (code) {
                    mockDb.referralCodes.push({
                      id: `ref-${Date.now()}`,
                      code: code.toUpperCase(),
                      brokerId: brokers[1]?.id || brokers[0].id,
                      brokerName: brokers[1]?.companyName || brokers[0].companyName,
                      deepLink: `https://mapp.miterahealth.com/enrol?ref=${code.toUpperCase()}`,
                      commissionRate: 3.0,
                      validFrom: '2026-01-01',
                      validTo: '2026-12-31',
                      isActive: true,
                      totalConversions: 0,
                      totalEligiblePremium: 0,
                      totalCommissionEarned: 0,
                    });
                    alert('Retail Referral Code generated!');
                  }
                }}
                className="px-4 py-2 bg-[#0299A7] hover:bg-[#037A86] text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Referral Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockDb.referralCodes.map((ref) => (
                <div key={ref.id} className="p-5 border border-slate-200 rounded-2xl bg-[#F2F2F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-[#037A86] text-sm bg-white px-3 py-1 rounded-lg border border-teal-200">
                      {ref.code}
                    </span>
                    <span className="text-[10px] bg-[#E0F2F4] text-[#037A86] font-bold px-2 py-0.5 rounded-full">
                      {ref.commissionRate}% Retail Rate
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">Assigned Broker: <strong>{ref.brokerName}</strong></p>
                  <p className="text-xs text-slate-500 font-mono text-[11px] truncate">{ref.deepLink}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase">Conversions</p>
                      <p className="font-bold text-slate-900 mt-0.5">{ref.totalConversions}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase">Premium</p>
                      <p className="font-bold text-slate-900 mt-0.5 font-mono">₦{ref.totalEligiblePremium.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase">Earned</p>
                      <p className="font-bold text-[#0299A7] mt-0.5 font-mono">₦{ref.totalCommissionEarned.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'BATCHES' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#037A86]">Settlement & Payment Batches</h3>
                <p className="text-xs text-slate-600">Consolidated SBU settlement batches with gross payouts, FIRS WHT deductions, and bank upload files.</p>
              </div>
              <button
                onClick={() => {
                  alert('Generated Bank Disbursement Upload File (NUBAN Batch Format) for Finance approval!');
                }}
                className="px-4 py-2 bg-[#0299A7] hover:bg-[#037A86] text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Generate Bank Upload File</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="pb-3">Batch Number</th>
                    <th className="pb-3">SBU</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Gross Amount</th>
                    <th className="pb-3">FIRS WHT</th>
                    <th className="pb-3">Net Disbursement</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockDb.paymentBatches.map((pb) => (
                    <tr key={pb.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-[#037A86]">{pb.batchNumber}</td>
                      <td className="py-3 font-bold text-slate-800">{pb.sbu}</td>
                      <td className="py-3 font-semibold text-slate-700">{pb.itemCount} items</td>
                      <td className="py-3 font-mono font-bold text-slate-900">₦{pb.grossAmount.toLocaleString()}</td>
                      <td className="py-3 font-mono text-[#D66F66] font-bold">-₦{pb.whtAmount.toLocaleString()}</td>
                      <td className="py-3 font-mono text-[#0299A7] font-extrabold">₦{pb.netPayoutAmount.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2F4] text-[#037A86]">
                          {pb.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'DISPUTES' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#037A86]">Disputes & Adjustment Log</h3>
                <p className="text-xs text-slate-600">Review broker attribution, rate, or payout disputes with append-only financial adjustments.</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockDb.disputes.map((disp) => (
                <div key={disp.id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#037A86] text-xs">{disp.disputeNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE8E6] text-[#D66F66]">
                      {disp.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">Broker: {disp.brokerName} ({disp.category})</p>
                  <p className="text-xs text-slate-600">{disp.explanation}</p>
                </div>
              ))}
            </div>
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
