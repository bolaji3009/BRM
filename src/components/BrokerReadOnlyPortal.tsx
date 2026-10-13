'use client';

import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Wallet,
  Users,
  TrendingUp,
  FileText,
  Award,
  Share2,
  Copy,
} from 'lucide-react';
import { BrokerData, QuoteDealData, CommissionData, mockDb } from '@/lib/mockDb';

interface BrokerReadOnlyPortalProps {
  broker: BrokerData;
  deals: QuoteDealData[];
  commissions: CommissionData[];
}

export const BrokerReadOnlyPortal: React.FC<BrokerReadOnlyPortalProps> = ({
  broker,
  deals,
  commissions,
}) => {
  const isRetail = broker.brokerType === 'RETAIL';
  const brokerDeals = deals.filter((d) => d.brokerId === broker.id || d.brokerName === broker.companyName);
  const brokerCommissions = commissions.filter((c) => c.brokerId === broker.id);

  const referralCode = mockDb.referralCodes.find((r) => r.brokerId === broker.id) || mockDb.referralCodes[0];

  const totalLives = isRetail
    ? (referralCode?.totalConversions || 24)
    : (brokerDeals.reduce((sum, d) => sum + (d.totalLives || 0), 0) || 850);

  const totalGrossPremium = isRetail
    ? (referralCode?.totalEligiblePremium || 1200000)
    : (brokerDeals.reduce((sum, d) => sum + (d.totalPremium || 0), 0) || 38250000);

  const totalEarnedCommission = brokerCommissions.reduce((sum, c) => sum + c.netPayout, 0) || (isRetail ? 32400 : 2450762.5);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner - Light Clean Mitera Style */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E5E5E3]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#E0F2F4] text-[#0299A7] text-xs font-bold px-3 py-1 rounded-full mb-3">
              <ShieldCheck className="w-4 h-4 text-[#0299A7]" />
              <span>{isRetail ? 'Retail SBU Referral Partner Hub' : 'Corporate SBU Accredited Broker Portal'}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#22282B]">{broker.companyName}</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              SBU Type: <span className="font-bold text-[#037A86]">{broker.brokerType} SBU</span> • Partnership Tier:{' '}
              <span className="font-bold text-[#037A86]">{broker.tierLevel.replace('_', ' ')}</span>
            </p>
          </div>

          <div className="bg-[#F2F2F0] p-4 rounded-xl border border-[#E5E5E3] min-w-[220px]">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Account Status</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0299A7]" />
              <span className="font-bold text-sm text-[#037A86] capitalize">{broker.status}</span>
            </div>
            <p className="text-xs text-[#0299A7] mt-2 font-mono font-bold">
              Broker Code: {broker.brokerCode || 'HMO-BRK-1001'}
            </p>
          </div>
        </div>
      </div>

      {/* Retail Referral Code Banner for Retail SBU Brokers */}
      {isRetail && (
        <div className="bg-[#E0F2F4] p-6 rounded-2xl border border-teal-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#037A86] tracking-wider flex items-center space-x-1.5">
              <Share2 className="w-4 h-4 text-[#0299A7]" />
              <span>Assigned MApp Retail Referral Code</span>
            </span>
            <span className="text-xs bg-white text-[#0299A7] font-extrabold px-3 py-1 rounded-full border border-teal-200">
              3% Retail Commission Rate
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-teal-100">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Referral Code</p>
              <p className="text-xl font-mono font-black text-[#037A86] mt-0.5">{referralCode.code}</p>
              <p className="text-xs text-slate-600 font-mono text-[11px] mt-1">{referralCode.deepLink}</p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(referralCode.deepLink);
                alert('MApp Referral Link copied to clipboard!');
              }}
              className="px-4 py-2.5 bg-[#0299A7] hover:bg-[#037A86] text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 shrink-0 transition-all"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Referral Link</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isRetail ? 'Retail Enrolments' : 'Active Lives Covered'}
            </p>
            <Users className="w-5 h-5 text-[#0299A7]" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalLives.toLocaleString()} Enrollees</p>
          <p className="text-[11px] text-[#037A86] font-bold mt-1">
            {isRetail ? 'Attributed via MApp code' : 'Active across corporate plans'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Premium</p>
            <TrendingUp className="w-5 h-5 text-[#0299A7]" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₦{totalGrossPremium.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">{isRetail ? 'Qualifying retail receipts' : 'Billed annually'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Earned Commission Wallet</p>
            <Wallet className="w-5 h-5 text-[#037A86]" />
          </div>
          <p className="text-2xl font-black text-[#037A86] mt-2">₦{totalEarnedCommission.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-bold mt-1">Net after FIRS Withholding Tax</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">SBU Commission Rule</p>
            <Award className="w-5 h-5 text-[#0299A7]" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {isRetail ? '3% Standard' : '10% Corporate'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{isRetail ? 'MApp Enrolment Rule' : 'Negotiated Agreement'}</p>
        </div>
      </div>

      {/* Account Verification Profile Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-[#037A86] text-base flex items-center space-x-2 border-b border-slate-200 pb-3">
          <UserCheck className="w-5 h-5 text-[#0299A7]" />
          <span>Accreditation & Payout Account Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-[#F2F2F0] rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold uppercase">SBU Category</p>
            <p className="font-mono font-bold text-slate-900 mt-1">{broker.brokerType} SBU</p>
          </div>

          <div className="p-3.5 bg-[#F2F2F0] rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold uppercase">National Identity / TIN</p>
            <p className="font-mono font-bold text-slate-900 mt-1">{broker.nin || broker.taxIdNumber || 'TIN-98214019-0001'}</p>
          </div>

          <div className="p-3.5 bg-[#F2F2F0] rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Tax Identification Number</p>
            <p className="font-mono font-bold text-slate-900 mt-1">{broker.taxIdNumber || 'TIN-98214019-0001'}</p>
          </div>

          <div className="p-3.5 bg-[#F2F2F0] rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Commission NUBAN Payout</p>
            <p className="font-bold text-slate-900 mt-1">{broker.bankName || 'GTBank'}</p>
            <p className="font-mono text-slate-700">{broker.accountNumber || '0123456789'}</p>
          </div>
        </div>
      </div>

      {/* Read-Only Corporate Bids / Quotes or Retail Attribution Log */}
      {!isRetail ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-[#037A86] text-base mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#0299A7]" />
            <span>Active Corporate Quotes & Bids Log</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="pb-3">Client Company</th>
                  <th className="pb-3">HR Contact</th>
                  <th className="pb-3">Enrolled Lives</th>
                  <th className="pb-3">Total Annual Premium</th>
                  <th className="pb-3">Deal Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(brokerDeals.length > 0 ? brokerDeals : [
                  {
                    id: 'd1',
                    companyName: 'Dangote Foods Plc',
                    contactPerson: 'Alhaji Musa Dangote',
                    totalLives: 250,
                    totalPremium: 11250000,
                    stage: 'PROPOSAL_SENT',
                  },
                  {
                    id: 'd2',
                    companyName: 'Flutterwave Tech Ltd',
                    contactPerson: 'Kemi Adebayo',
                    totalLives: 180,
                    totalPremium: 8100000,
                    stage: 'CLOSED_WON',
                  },
                ]).map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3.5 font-bold text-slate-900">{d.companyName}</td>
                    <td className="py-3.5 text-slate-600">{d.contactPerson}</td>
                    <td className="py-3.5 font-semibold text-slate-800">{d.totalLives} Lives</td>
                    <td className="py-3.5 font-mono font-bold text-slate-900">₦{d.totalPremium?.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          d.stage === 'CLOSED_WON'
                            ? 'bg-[#E0F2F4] text-[#037A86]'
                            : 'bg-[#FCE8E6] text-[#D66F66]'
                        }`}
                      >
                        {d.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-[#037A86] text-base mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#0299A7]" />
            <span>Retail Enrolments & MApp Referral Attribution Log</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="pb-3">Enrolment ID</th>
                  <th className="pb-3">Referral Code Used</th>
                  <th className="pb-3">Plan Enrolled</th>
                  <th className="pb-3">Qualifying Premium</th>
                  <th className="pb-3">Calculated Commission (3%)</th>
                  <th className="pb-3">Lifecycle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 font-mono font-bold text-[#037A86]">MAPP-ENR-9921</td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">{referralCode.code}</td>
                  <td className="py-3.5 font-medium text-slate-700">Mitera Retail Bronze Care</td>
                  <td className="py-3.5 font-mono text-slate-900">₦50,000</td>
                  <td className="py-3.5 font-mono font-bold text-[#0299A7]">₦1,500</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2F4] text-[#037A86]">
                      ELIGIBLE
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
