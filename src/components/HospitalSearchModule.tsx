import React, { useState, useMemo } from 'react';
import {
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  Download,
  Filter,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HospitalData } from '@/lib/mockDb';

interface HospitalSearchModuleProps {
  hospitals: HospitalData[];
}

export const HospitalSearchModule: React.FC<HospitalSearchModuleProps> = ({ hospitals }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  // Extract unique states
  const states = useMemo(() => {
    const unique = Array.from(new Set(hospitals.map((h) => h.state)));
    return ['ALL', ...unique];
  }, [hospitals]);

  // Filtered hospital network list
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.lga.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesState = selectedState === 'ALL' || h.state === selectedState;
      const matchesTier = selectedTier === 'ALL' || h.tier === selectedTier;

      return matchesSearch && matchesState && matchesTier;
    });
  }, [hospitals, searchTerm, selectedState, selectedTier]);

  const exportOfflinePdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 297, 28, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('MITERA HEALTH HMO - OFFICIAL HOSPITAL NETWORK DIRECTORY', 14, 18);

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(6, 182, 212);
    doc.text(`Exported State: ${selectedState} | Tier Level: ${selectedTier} | Total Providers: ${filteredHospitals.length}`, 14, 24);

    const tableData = filteredHospitals.map((h) => [
      h.name,
      `${h.lga}, ${h.state}`,
      h.address,
      h.tier.replace('_', ' '),
      h.phone,
      h.services.slice(0, 3).join(', '),
    ]);

    autoTable(doc, {
      startY: 32,
      head: [['Hospital Facility Name', 'State & LGA', 'Address', 'Network Tier', 'Phone Contact', 'Primary Specialties']],
      body: tableData,
      headStyles: { fillColor: [14, 116, 144], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    doc.save(`Mitera_Hospital_Network_${selectedState}.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/30 mb-3">
              <Building2 className="w-4 h-4" />
              <span>700+ Accredited Care Providers Nationwide</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Searchable Hospital Network Directory</h2>
            <p className="text-slate-300 text-sm mt-1">
              Query hospital tiers dynamically during client pitches or export custom offline PDFs for field agents.
            </p>
          </div>

          <button
            onClick={exportOfflinePdf}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Offline Network PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by hospital name, LGA, address, or specialist service (e.g. Lagoon, ICU, Cardiology)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700"
            >
              <option value="ALL">All States in Nigeria</option>
              {states.filter((s) => s !== 'ALL').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700"
            >
              <option value="ALL">All Network Tiers</option>
              <option value="TIER_1_BASIC">Tier 1 - Basic SME Access</option>
              <option value="TIER_2_STANDARD">Tier 2 - Standard Corporate</option>
              <option value="TIER_3_PREMIUM">Tier 3 - Premium Executive</option>
              <option value="TIER_4_EXECUTIVE">Tier 4 - VIP & Specialist</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="border border-slate-200 rounded-2xl p-5 bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      hosp.tier === 'TIER_4_EXECUTIVE' || hosp.tier === 'TIER_3_PREMIUM'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}
                  >
                    {hosp.tier.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>NHIA Accredited</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">{hosp.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>
                      {hosp.lga}, <strong className="text-slate-800">{hosp.state}</strong>
                    </span>
                  </p>
                  <p className="text-slate-500 pl-5 text-[11px] leading-tight">{hosp.address}</p>
                  <p className="flex items-center space-x-1.5 pt-1">
                    <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-mono text-slate-800">{hosp.phone}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Available Clinical Specialties
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {hosp.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>Direct Provider Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No hospital facilities found matching your search query.</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or adjusting search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
