import React from 'react';
import {
  Wallet,
  Download,
  CheckCircle2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommissionData, BrokerData } from '@/lib/mockDb';

interface CommissionLedgerProps {
  commissions: CommissionData[];
  broker: BrokerData;
}

export const CommissionLedger: React.FC<CommissionLedgerProps> = ({ commissions, broker }) => {
  const calculateTotals = () => {
    let grossCommissions = 0;
    let totalWht = 0;
    let netPayouts = 0;

    commissions.forEach((c) => {
      grossCommissions += c.grossCommission;
      totalWht += c.whtAmount;
      netPayouts += c.netPayout;
    });

    return { grossCommissions, totalWht, netPayouts };
  };

  const totals = calculateTotals();

  const exportStatementPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    doc.setFillColor(3, 122, 134); // #037A86 Darker Teal Header
    doc.rect(0, 0, 210, 30, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('MITERA HEALTH LIMITED', 14, 18);

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(224, 242, 244);
    doc.text('COMMISSION STATEMENT & WHT DEDUCTION SUMMARY', 14, 24);

    doc.setTextColor(34, 40, 43);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.text(`Broker Name: ${broker.companyName}`, 14, 40);
    doc.text(`Broker Code: ${broker.brokerCode || 'HMO-BRK-1001'}`, 14, 46);
    doc.text(`Payout Bank: ${broker.bankName} (${broker.accountNumber})`, 14, 52);

    const tableData = commissions.map((c) => [
      c.companyName || 'Corporate Client',
      `N${c.grossPremium.toLocaleString()}`,
      `${c.commissionRate}%`,
      `N${c.grossCommission.toLocaleString()}`,
      `N${c.whtAmount.toLocaleString()} (${c.whtRate}%)`,
      `N${c.netPayout.toLocaleString()}`,
      c.status,
    ]);

    autoTable(doc, {
      startY: 58,
      head: [['Corporate Client', 'Gross Premium', 'Rate', 'Gross Comm.', 'FIRS WHT', 'Net Payout', 'Status']],
      body: tableData,
      headStyles: { fillColor: [2, 153, 167], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      foot: [
        [
          'TOTALS',
          '',
          '',
          `N${totals.grossCommissions.toLocaleString()}`,
          `N${totals.totalWht.toLocaleString()}`,
          `N${totals.netPayouts.toLocaleString()}`,
          '',
        ],
      ],
      footStyles: { fillColor: [242, 242, 240], textColor: [34, 40, 43], fontStyle: 'bold' },
    });

    doc.save(`Mitera_Commission_Statement_${broker.brokerCode || '1001'}.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Banner */}
      <div className="bg-[#037A86] text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 mb-3">
              <Wallet className="w-4 h-4 text-teal-200" />
              <span>Transparent Commission Ledger & Wallet</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Commission Payouts & FIRS Tax Statements</h2>
            <p className="text-teal-100/90 text-sm mt-1">
              Automated 5% Corporate / 10% Individual Withholding Tax (WHT) calculations with NUBAN bank reconciliation.
            </p>
          </div>

          <button
            onClick={exportStatementPdf}
            className="px-5 py-2.5 bg-[#0299A7] hover:bg-[#025F69] text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 shrink-0 transition-all border border-teal-300/30"
          >
            <Download className="w-4 h-4" />
            <span>Download Statement PDF</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#F2F2F0] border-b border-slate-200">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Gross Commissions Earned</p>
          <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            ₦{totals.grossCommissions.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Based on 10% standard corporate split</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">FIRS Withholding Tax (WHT)</p>
          <p className="text-2xl font-extrabold text-[#D66F66] font-mono mt-1">
            -₦{totals.totalWht.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">5% Corporate WHT deducted at source</p>
        </div>

        <div className="p-5 bg-[#037A86] text-white rounded-2xl shadow-md border border-teal-700">
          <p className="text-xs font-bold text-teal-100 uppercase">Net Disbursed / Wallet Balance</p>
          <p className="text-2xl font-extrabold text-white font-mono mt-1">
            ₦{totals.netPayouts.toLocaleString()}
          </p>
          <p className="text-[11px] text-teal-100/90 mt-1">Direct NUBAN bank transfer ready</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="p-6 sm:p-8 overflow-x-auto bg-white">
        <h3 className="font-bold text-[#037A86] text-base mb-4">Commission Payout Breakdown</h3>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <th className="pb-3">Client Deal</th>
              <th className="pb-3">Gross Premium</th>
              <th className="pb-3">Comm. Rate</th>
              <th className="pb-3">Gross Comm.</th>
              <th className="pb-3">WHT Deducted</th>
              <th className="pb-3">Net Payout</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {commissions.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80">
                <td className="py-3.5 font-bold text-slate-900">{c.companyName || 'Zenith Logistics'}</td>
                <td className="py-3.5 font-mono text-slate-700">₦{c.grossPremium.toLocaleString()}</td>
                <td className="py-3.5 font-bold text-[#037A86]">{c.commissionRate}%</td>
                <td className="py-3.5 font-mono text-slate-900 font-bold">₦{c.grossCommission.toLocaleString()}</td>
                <td className="py-3.5 font-mono text-[#D66F66] font-bold">-₦{c.whtAmount.toLocaleString()}</td>
                <td className="py-3.5 font-mono text-[#037A86] font-extrabold">₦{c.netPayout.toLocaleString()}</td>
                <td className="py-3.5">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'PAID'
                        ? 'bg-[#E0F2F4] text-[#037A86]'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{c.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
