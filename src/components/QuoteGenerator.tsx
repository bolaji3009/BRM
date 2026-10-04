import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Download,
  Building,
  CheckCircle,
  Layers,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PlanData, QuoteDealData, BrokerData } from '@/lib/mockDb';

interface QuoteGeneratorProps {
  plans: PlanData[];
  broker: BrokerData;
  onCreateDeal: (newDeal: Partial<QuoteDealData>) => void;
}

interface CategoryInput {
  categoryName: string;
  planId: string;
  staffCount: number;
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({
  plans,
  broker,
  onCreateDeal,
}) => {
  const [companyName, setCompanyName] = useState('Aramco Nigeria Ltd');
  const [contactPerson, setContactPerson] = useState('David Adeleke');
  const [contactEmail, setContactEmail] = useState('d.adeleke@aramco.ng');
  const [contactPhone, setContactPhone] = useState('+234 803 777 9900');
  const [notes] = useState('');

  const [categories, setCategories] = useState<CategoryInput[]>([
    { categoryName: 'Executive Team', planId: plans[2]?.id || 'plan-gold', staffCount: 15 },
    { categoryName: 'Core Operations Staff', planId: plans[1]?.id || 'plan-silver', staffCount: 85 },
  ]);

  const addCategory = () => {
    setCategories([
      ...categories,
      { categoryName: `Staff Group ${categories.length + 1}`, planId: plans[0]?.id || 'plan-bronze', staffCount: 20 },
    ]);
  };

  const removeCategory = (index: number) => {
    if (categories.length === 1) return;
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof CategoryInput, value: any) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  // Calculate premium logic matching Node.js engine
  const calculateQuoteBreakdown = () => {
    let totalLives = 0;
    categories.forEach((c) => (totalLives += Number(c.staffCount) || 0));

    // Determine volume discount tier
    let volumeDiscount = 0;
    if (totalLives >= 100) volumeDiscount = 0.15; // 15% off for 100+ lives
    else if (totalLives >= 50) volumeDiscount = 0.10; // 10% off for 50+ lives
    else if (totalLives >= 25) volumeDiscount = 0.05; // 5% off for 25+ lives

    // Additional broker tier discount (e.g. Elite Partner get extra 5%)
    let tierExtraDiscount = 0;
    if (broker.tierLevel === 'ELITE_PARTNER') tierExtraDiscount = 0.05;

    const totalDiscountPct = Math.min(volumeDiscount + tierExtraDiscount, 0.25);

    let grossTotal = 0;
    const breakout = categories.map((cat) => {
      const selectedPlan = plans.find((p) => p.id === cat.planId) || plans[0];
      const baseRate = selectedPlan.annualBaseRate;
      const finalPricePerHead = Math.round(baseRate * (1 - totalDiscountPct));
      const subtotal = finalPricePerHead * (cat.staffCount || 0);

      grossTotal += subtotal;

      return {
        categoryName: cat.categoryName,
        planId: selectedPlan.id,
        name: selectedPlan.name,
        staffCount: cat.staffCount || 0,
        basePricePerHead: baseRate,
        finalPricePerHead,
        subtotal,
      };
    });

    return {
      totalLives,
      totalDiscountPct: totalDiscountPct * 100,
      totalPremium: grossTotal,
      breakout,
    };
  };

  const calculation = calculateQuoteBreakdown();

  const handleSaveDeal = () => {
    const dealData: Partial<QuoteDealData> = {
      brokerId: broker.id,
      brokerName: broker.companyName,
      companyName,
      contactPerson,
      contactEmail,
      contactPhone,
      stage: 'PROPOSAL_SENT',
      totalLives: calculation.totalLives,
      breakout: calculation.breakout,
      totalPremium: calculation.totalPremium,
      discountApplied: calculation.totalDiscountPct,
      notes,
    };

    onCreateDeal(dealData);
    alert('Quote Proposal successfully created and logged to your active pipeline!');
  };

  const generateProposalPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Mitera Branding Header
    doc.setFillColor(3, 122, 134); // #037A86
    doc.rect(0, 0, 210, 35, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('MITERA HEALTH LIMITED', 14, 20);

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(224, 242, 244);
    doc.text('CORPORATE HEALTHCARE PROPOSAL & QUOTATION', 14, 27);

    doc.setTextColor(255, 255, 255);
    doc.text(`Ref: MTR-QTE-${Math.floor(100000 + Math.random() * 900000)}`, 196, 20, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 196, 27, { align: 'right' });

    // Client & Broker Details
    doc.setTextColor(34, 40, 43);
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('Prepared For Client:', 14, 48);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(companyName, 14, 54);
    doc.text(`Attn: ${contactPerson} (${contactEmail})`, 14, 60);

    doc.setFont('Helvetica', 'bold');
    doc.text('Prepared By Official Broker:', 120, 48);
    doc.setFont('Helvetica', 'normal');
    doc.text(broker.companyName, 120, 54);
    doc.text(`Broker Code: ${broker.brokerCode || 'HMO-BRK-1001'}`, 120, 60);

    // Table of Plan Breakdown
    const tableData = calculation.breakout.map((b) => [
      b.categoryName,
      b.name,
      b.staffCount.toString(),
      `N${b.basePricePerHead.toLocaleString()}`,
      `N${b.finalPricePerHead.toLocaleString()}`,
      `N${b.subtotal.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Category', 'HMO Plan Name', 'Lives', 'Standard Rate', 'Discounted Rate', 'Annual Subtotal']],
      body: tableData,
      headStyles: { fillColor: [2, 153, 167], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      foot: [
        [
          'TOTAL ENROLLEES',
          `${calculation.totalLives} Lives`,
          '',
          `Applied Discount: ${calculation.totalDiscountPct}%`,
          'GRAND TOTAL',
          `N${calculation.totalPremium.toLocaleString()}`,
        ],
      ],
      footStyles: { fillColor: [242, 242, 240], textColor: [34, 40, 43], fontStyle: 'bold' },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Terms & Conditions
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Terms & Subscription Guidelines:', 14, finalY);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(85, 85, 85);
    doc.text('1. Quote pricing is valid for 30 calendar days from date of issue.', 14, finalY + 6);
    doc.text('2. Hospital network access is governed by the selected plan tier.', 14, finalY + 11);
    doc.text('3. Payment terms are subject to Mitera Health corporate billing agreement.', 14, finalY + 16);

    doc.save(`Mitera_Corporate_Quote_${companyName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E3] overflow-hidden">
      {/* Light Clean Hero Header Card */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 border-b border-[#E5E5E3]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#E0F2F4] text-[#0299A7] text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Calculator className="w-4 h-4 text-[#0299A7]" />
              <span>Node.js Dynamic Pricing Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#22282B]">Dynamic Corporate Quote Generator</h2>
            <p className="text-slate-600 text-sm mt-1">
              Calculate volume-banded premiums, mix-and-match staff tiers, and export co-branded PDF proposals.
            </p>
          </div>

          <div className="bg-[#E0F2F4] p-4 rounded-xl border border-teal-200 text-right min-w-[200px]">
            <p className="text-xs text-[#037A86] font-bold">Applied Volume Discount</p>
            <p className="text-2xl font-extrabold text-[#0299A7] mt-0.5">
              {calculation.totalDiscountPct}% Off
            </p>
            <p className="text-[11px] text-slate-700 font-semibold">Total Enrollees: {calculation.totalLives} Lives</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#FFFFFF]">
        {/* Left Column: Form & Mix-and-Match Categories */}
        <div className="lg:col-span-7 space-y-6">
          {/* Client Info */}
          <div className="bg-[#F2F2F0] p-5 rounded-2xl border border-[#E5E5E3]">
            <h3 className="text-xs font-extrabold uppercase text-[#037A86] tracking-wider mb-4 flex items-center space-x-1.5">
              <Building className="w-4 h-4 text-[#0299A7]" />
              <span>Prospect Corporate Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E5E3] text-[#22282B] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#0299A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E5E3] text-[#22282B] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#0299A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E5E3] text-[#22282B] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#0299A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E5E3] text-[#22282B] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#0299A7] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Plan Breakdown Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#037A86] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#0299A7]" />
                <span>Workforce Plan Categories & Tiers</span>
              </h3>
              <button
                type="button"
                onClick={addCategory}
                className="px-3 py-1.5 bg-[#E0F2F4] text-[#037A86] hover:bg-teal-100 text-xs font-bold rounded-lg transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category Group</span>
              </button>
            </div>

            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={idx} className="p-4 border border-[#E5E5E3] rounded-xl bg-white shadow-xs flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Group Label</label>
                    <input
                      type="text"
                      value={cat.categoryName}
                      onChange={(e) => updateCategory(idx, 'categoryName', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0299A7]"
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Select Plan Tier</label>
                    <select
                      value={cat.planId}
                      onChange={(e) => updateCategory(idx, 'planId', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0299A7]"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₦{p.annualBaseRate.toLocaleString()}/head)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-1/4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Headcount</label>
                    <input
                      type="number"
                      min={1}
                      value={cat.staffCount}
                      onChange={(e) => updateCategory(idx, 'staffCount', parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-bold focus:ring-2 focus:ring-[#0299A7]"
                    />
                  </div>

                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(idx)}
                      className="p-2 text-[#D66F66] hover:text-white hover:bg-[#D66F66] bg-[#FCE8E6] rounded-lg mt-3 sm:mt-4 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Premium Calculation Ledger in Light #E0F2F4 */}
        <div className="lg:col-span-5 bg-[#E0F2F4] text-[#22282B] p-6 rounded-2xl flex flex-col justify-between border border-teal-200">
          <div>
            <h3 className="text-lg font-extrabold text-[#037A86] border-b border-teal-200 pb-3 flex items-center justify-between">
              <span>Quote Summary Ledger</span>
              <span className="text-xs bg-white text-[#037A86] border border-teal-200 font-bold px-2.5 py-1 rounded-full">
                Live Calculated
              </span>
            </h3>

            <div className="mt-5 space-y-4">
              {calculation.breakout.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs pb-3 border-b border-teal-200/70">
                  <div>
                    <p className="font-bold text-[#22282B]">{b.categoryName}</p>
                    <p className="text-slate-600 text-[11px]">{b.name} ({b.staffCount} lives)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[#037A86] font-bold">₦{b.subtotal.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-600">₦{b.finalPricePerHead.toLocaleString()} / head</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-teal-200 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-medium">Total Workforce Count:</span>
              <span className="font-bold text-[#22282B]">{calculation.totalLives} Enrollees</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-medium">Applied Volume Discount:</span>
              <span className="font-extrabold text-[#0299A7]">{calculation.totalDiscountPct}% Off</span>
            </div>

            <div className="flex items-center justify-between text-base pt-3 border-t border-teal-200">
              <span className="font-extrabold text-[#037A86]">Total Annual Premium:</span>
              <span className="font-extrabold text-2xl text-[#0299A7] font-mono">
                ₦{calculation.totalPremium.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={generateProposalPdf}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-[#E5E5E3] text-[#22282B] text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <Download className="w-4 h-4 text-[#037A86]" />
                <span>Export PDF Quote</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDeal}
                className="w-full py-3 bg-[#0299A7] hover:bg-[#037A86] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Log Deal to CRM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
