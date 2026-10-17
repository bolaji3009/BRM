import React, { useState } from 'react';
import {
  Wallet,
  Download,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommissionData, BrokerData, mockDb } from '@/lib/mockDb';
import { CommissionCalculationBreakdown } from '@/lib/types';

interface CommissionLedgerProps {
  commissions: CommissionData[];
  broker: BrokerData;
  isBrokerView?: boolean;
}

export const CommissionLedger: React.FC<CommissionLedgerProps> = ({ commissions, broker, isBrokerView = false }) => {
  const [selectedCommission, setSelectedCommission] = useState<CommissionData | null>(null);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const [disputeForm, setDisputeForm] = useState({
    category: 'MISSING_ATTRIBUTION' as const,
    clientOrCode: 'MAPP-RETAIL-ENROLMENT',
    explanation: 'Discrepancy in tier rate application or missing enrollee attribution.',
    claimedAmount: 15000,
  });

  const generateExplainableBreakdown = (c: CommissionData): CommissionCalculationBreakdown => {
    const grossPremiumKobo = Math.round(c.grossPremium * 100);
    const nonCommissionableKobo = c.sbu === 'CORPORATE' ? 20000000 : 0; // ₦200,000 regulatory levy/admin fee
    const netBaseKobo = grossPremiumKobo - nonCommissionableKobo;
    const grossCommKobo = Math.round((netBaseKobo * c.commissionRate) / 100);
    const whtDeductionKobo = Math.round((grossCommKobo * c.whtRate) / 100);
    const netPayableKobo = grossCommKobo - whtDeductionKobo;

    return {
      ruleVersion: 'v2026.1.0-REGULATORY',
      preundedBaseKobo: grossPremiumKobo,
      nonCommissionableExclusionsKobo: nonCommissionableKobo,
      netBaseKobo: netBaseKobo,
      appliedPercentage: c.commissionRate,
      grossCommissionKobo: grossCommKobo,
      whtRatePct: c.whtRate,
      whtDeductionKobo: whtDeductionKobo,
      netCommissionPayableKobo: netPayableKobo,
      steps: [
        {
          stepNumber: 1,
          description: 'Confirm Eligible Gross Premium Receipt',
          formula: 'Source Transaction Receipt',
          valueInKobo: grossPremiumKobo,
          formattedValue: `₦${(grossPremiumKobo / 100).toLocaleString()}`,
        },
        {
          stepNumber: 2,
          description: 'Deduct Non-Commissionable Items (Taxes, Regulatory Levies & Admin Fees)',
          formula: 'Eligible Premium - Exclusions',
          valueInKobo: nonCommissionableKobo,
          formattedValue: `-₦${(nonCommissionableKobo / 100).toLocaleString()}`,
        },
        {
          stepNumber: 3,
          description: 'Net Eligible Commissionable Base',
          formula: 'Step 1 - Step 2',
          valueInKobo: netBaseKobo,
          formattedValue: `₦${(netBaseKobo / 100).toLocaleString()}`,
        },
        {
          stepNumber: 4,
          description: `Apply Effective Rule Version (Rate: ${c.commissionRate}%)`,
          formula: `Net Base * ${c.commissionRate}%`,
          valueInKobo: grossCommKobo,
          formattedValue: `₦${(grossCommKobo / 100).toLocaleString()}`,
        },
        {
          stepNumber: 5,
          description: `Deduct FIRS Statutory Withholding Tax (${c.whtRate}%)`,
          formula: `Gross Commission * ${c.whtRate}% WHT`,
          valueInKobo: whtDeductionKobo,
          formattedValue: `-₦${(whtDeductionKobo / 100).toLocaleString()}`,
        },
        {
          stepNumber: 6,
          description: 'Final Net Payable Commission Amount',
          formula: 'Step 4 - Step 5',
          valueInKobo: netPayableKobo,
          formattedValue: `₦${(netPayableKobo / 100).toLocaleString()}`,
        },
      ],
    };
  };

  const handleRaiseDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.disputes.push({
      id: `disp-${Date.now()}`,
      disputeNumber: `DSP-2026-00${mockDb.disputes.length + 1}`,
      brokerId: broker.id,
      brokerName: broker.companyName,
      clientOrCode: disputeForm.clientOrCode,
      category: disputeForm.category,
      explanation: disputeForm.explanation,
      status: 'OPEN',
      adjustmentAmountKobo: Math.round(disputeForm.claimedAmount * 100),
      linkedAdjustmentType: 'CREDIT',
      createdAt: new Date().toISOString(),
    });

    setShowDisputeModal(false);
    alert('Dispute and Adjustment request successfully submitted! An append-only credit adjustment ledger entry has been logged for Finance review.');
  };

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
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E3] overflow-hidden">
      {/* Banner */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 border-b border-[#E5E5E3]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#E0F2F4] text-[#0299A7] text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Wallet className="w-4 h-4 text-[#0299A7]" />
              <span>Transparent Commission Ledger & Wallet</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#22282B]">Commission Payouts & FIRS Tax Statements</h2>
            <p className="text-slate-600 text-sm mt-1">
              Automated 5% Corporate / 10% Individual Withholding Tax (WHT) calculations with NUBAN bank reconciliation.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isBrokerView && (
              <button
                onClick={() => setShowDisputeModal(true)}
                className="px-4 py-2.5 bg-[#EF8E85] hover:bg-[#D66F66] text-[#22282B] hover:text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Raise Adjustment / Dispute</span>
              </button>
            )}

            <button
              onClick={exportStatementPdf}
              className="px-5 py-2.5 bg-[#0299A7] hover:bg-[#037A86] text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 shrink-0 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Statement PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#F2F2F0] border-b border-[#E5E5E3]">
        <div className="p-5 bg-white border border-[#E5E5E3] rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Gross Commissions Earned</p>
          <p className="text-2xl font-extrabold text-[#22282B] font-mono mt-1">
            ₦{totals.grossCommissions.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Based on 10% standard corporate split</p>
        </div>

        <div className="p-5 bg-white border border-[#E5E5E3] rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">FIRS Withholding Tax (WHT)</p>
          <p className="text-2xl font-extrabold text-[#D66F66] font-mono mt-1">
            -₦{totals.totalWht.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">5% Corporate WHT deducted at source</p>
        </div>

        <div className="p-5 bg-[#E0F2F4] text-[#22282B] rounded-2xl border border-teal-200 shadow-xs">
          <p className="text-xs font-extrabold text-[#037A86] uppercase">Net Disbursed / Wallet Balance</p>
          <p className="text-2xl font-black text-[#0299A7] font-mono mt-1">
            ₦{totals.netPayouts.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-700 mt-1 font-semibold">Direct NUBAN bank transfer ready</p>
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
              <th className="pb-3 text-right">Audit Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {commissions.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
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
                        : 'bg-[#FCE8E6] text-[#D66F66]'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{c.status}</span>
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => {
                      setSelectedCommission(c);
                      setShowExplanationModal(true);
                    }}
                    className="px-3 py-1 bg-[#E0F2F4] hover:bg-teal-200 text-[#037A86] text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1 ml-auto"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explain Breakdown</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explainable Calculation Breakdown Modal */}
      {showExplanationModal && selectedCommission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] bg-[#E0F2F4] text-[#037A86] font-extrabold px-2.5 py-0.5 rounded-full">
                  Effective Rule Version: v2026.1.0-REGULATORY
                </span>
                <h3 className="text-lg font-extrabold text-[#037A86] mt-1">
                  Commission Calculation Trace & Breakdown
                </h3>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {(() => {
              const breakdown = generateExplainableBreakdown(selectedCommission);
              return (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#F2F2F0] rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Client Deal</p>
                      <p className="font-bold text-slate-900">{selectedCommission.companyName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">SBU Rule Set</p>
                      <p className="font-bold text-[#037A86]">{selectedCommission.sbu} SBU</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Net Payout</p>
                      <p className="font-extrabold font-mono text-[#0299A7]">₦{selectedCommission.netPayout.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#E0F2F4] text-[#037A86] font-bold">
                        <tr>
                          <th className="p-2.5">Step #</th>
                          <th className="p-2.5">Calculation Description</th>
                          <th className="p-2.5">Formula / Operation</th>
                          <th className="p-2.5 text-right">Computed Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {breakdown.steps.map((s) => (
                          <tr key={s.stepNumber} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold font-mono text-[#037A86]">{s.stepNumber}</td>
                            <td className="p-2.5 font-medium text-slate-800">{s.description}</td>
                            <td className="p-2.5 font-mono text-slate-600 text-[11px]">{s.formula}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">{s.formattedValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Audit Traceability Guarantee:</strong> Every calculation step is stored as a JSON snapshot tied to immutable rule version <code>v2026.1.0-REGULATORY</code> with unique transaction key.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Raise Dispute / Adjustment Request Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-lg font-extrabold text-[#037A86]">Raise Adjustment / Commission Dispute</h3>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleRaiseDisputeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dispute Category</label>
                <select
                  value={disputeForm.category}
                  onChange={(e) => setDisputeForm({ ...disputeForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0299A7]"
                >
                  <option value="MISSING_ATTRIBUTION">Missing Enrolment Attribution (MApp / Corporate)</option>
                  <option value="INCORRECT_RATE">Incorrect Agreement Rate Applied</option>
                  <option value="WHT_CALCULATION">FIRS WHT Calculation Discrepancy</option>
                  <option value="DELAYED_PAYOUT">Delayed Settlement Payout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client Name / Referral Code Reference</label>
                <input
                  type="text"
                  required
                  value={disputeForm.clientOrCode}
                  onChange={(e) => setDisputeForm({ ...disputeForm, clientOrCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0299A7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Claimed Financial Adjustment Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={disputeForm.claimedAmount}
                  onChange={(e) => setDisputeForm({ ...disputeForm, claimedAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold font-mono focus:ring-2 focus:ring-[#0299A7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation & Evidence Summary</label>
                <textarea
                  rows={3}
                  required
                  value={disputeForm.explanation}
                  onChange={(e) => setDisputeForm({ ...disputeForm, explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0299A7]"
                />
              </div>

              <div className="p-3 bg-[#E0F2F4] text-[#037A86] rounded-xl text-[11px] font-medium">
                <strong>Immutable Adjustment Policy:</strong> Submitting a dispute will never overwrite or alter past transaction receipts. Approved resolutions will issue a separate, linked credit/debit adjustment entry in the ledger.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0299A7] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#037A86]"
                >
                  Submit Dispute & Log Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
