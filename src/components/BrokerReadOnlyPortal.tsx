'use client';

import React from 'react';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  CheckCircle2,
  Wallet,
  Users,
  TrendingUp,
  FileText,
  Award,
  CreditCard,
  Hospital,
} from 'lucide-react';
import { BrokerData, QuoteDealData, CommissionData } from '@/lib/mockDb';

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
  const brokerDeals = deals.filter((d) => d.brokerId === broker.id || d.brokerName === broker.companyName);
  const brokerCommissions = commissions.filter((c) => c.brokerId === broker.id);

  const totalLives = brokerDeals.reduce((sum, d) => sum + (d.totalLives || 0), 0) || (broker.brokerType === 'INDIVIDUAL' ? 120 : 850);
  const totalGrossPremium = brokerDeals.reduce((sum, d) => sum + (d.totalPremium || 0), 0) || (broker.brokerType === 'INDIVIDUAL' ? 3600000 : 38250000);
  const totalEarnedCommission = brokerCommissions.reduce((sum, c) => sum + c.netPayout, 0) || (broker.brokerType === 'INDIVIDUAL' ? 324000 : 3633750);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/30 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>NHIA Accredited Broker Portal (Read-Only)</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">{broker.companyName}</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Type: <span className="font-semibold text-teal-300">{broker.brokerType}</span> • Partnership Tier:{' '}
              <span className="font-semibold text-teal-300">{broker.tierLevel.replace('_', ' ')}</span>
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 min-w-[220px]">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Account Status</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-bold text-sm text-emerald-400 capitalize">{broker.status}</span>
            </div>
            <p className="text-xs text-teal-400 mt-2 font-mono font-bold">
              Broker Code: {broker.brokerCode || 'HMO-BRK-1001'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Lives Covered</p>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalLives.toLocaleString()} Lives</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Active across corporate plans</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Premium</p>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₦{totalGrossPremium.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">Billed annually</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Earned Commission Wallet</p>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">₦{totalEarnedCommission.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Net after FIRS Withholding Tax</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Tier Discount</p>
            <Award className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {broker.tierLevel === 'ELITE_PARTNER' ? '15%' : broker.tierLevel === 'CORPORATE_BROKER' ? '10%' : '5%'} Off
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Volume rate card override</p>
        </div>
      </div>

      {/* Account Verification Profile Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2 border-b border-slate-200 pb-3">
          <UserCheck className="w-5 h-5 text-teal-600" />
          <span>Accreditation & Payout Account Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase">NAICOM License No.</p>
            <p className="font-mono font-bold text-slate-900 mt-1">{broker.naicomLicenseNumber || 'NAICOM/BRK/2024/089'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase">NHIA Accreditation No.</p>
            <p className="font-mono font-bold text-slate-900 mt-1">{broker.nhiaAccreditationNo || 'NHIA/ACT/9902'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Tax Identification Number (TIN)</p>
            <p className="font-mono font-bold text-slate-900 mt-1">{broker.taxIdNumber || 'TIN-98214019-0001'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Commission NUBAN Payout</p>
            <p className="font-bold text-slate-900 mt-1">{broker.bankName || 'GTBank'}</p>
            <p className="font-mono text-slate-600">{broker.accountNumber || '0123456789'}</p>
          </div>
        </div>
      </div>

      {/* Read-Only Corporate Bids / Quotes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-teal-600" />
          <span>Active Corporate Quotes & Bids Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
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
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
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
    </div>
  );
};
