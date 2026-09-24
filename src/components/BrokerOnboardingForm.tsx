import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { BrokerData } from '@/lib/mockDb';

interface BrokerOnboardingFormProps {
  broker: BrokerData;
  onUpdateBroker: (updated: Partial<BrokerData>) => void;
}

export const BrokerOnboardingForm: React.FC<BrokerOnboardingFormProps> = ({
  broker,
  onUpdateBroker,
}) => {
  const [formData, setFormData] = useState({
    companyName: broker.companyName || '',
    brokerType: broker.brokerType || 'CORPORATE',
    rcNumber: broker.rcNumber || '',
    naicomLicenseNumber: broker.naicomLicenseNumber || '',
    naicomExpiryDate: broker.naicomExpiryDate || '',
    nhiaAccreditationNo: broker.nhiaAccreditationNo || '',
    taxIdNumber: broker.taxIdNumber || '',
    vatCompliant: broker.vatCompliant || false,
    nin: broker.nin || '',
    bvn: broker.bvn || '',
    bankName: broker.bankName || 'Guaranty Trust Bank (GTBank)',
    accountNumber: broker.accountNumber || '',
    accountName: broker.accountName || '',
    phone: broker.phone || '',
    state: broker.state || 'Lagos',
    lga: broker.lga || 'Ikeja',
    address: broker.address || '',
    ndpaConsent: broker.ndpaConsent || false,
  });

  const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});
  const [verified, setVerified] = useState<{ [key: string]: boolean }>({
    cac: !!broker.rcNumber,
    naicom: !!broker.naicomLicenseNumber,
    bvn: !!broker.bvn,
    nin: !!broker.nin,
  });

  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: string }>({
    cacCert: broker.rcNumber ? 'CAC_Registration_Certificate_Apex.pdf' : '',
    naicomLicense: broker.naicomLicenseNumber ? 'NAICOM_Broker_License_2024.pdf' : '',
    taxClearance: broker.taxIdNumber ? 'Tax_Clearance_Certificate.pdf' : '',
    indemnityCover: 'Professional_Indemnity_Cover.pdf',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVerify = (type: string) => {
    setVerifying((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setVerifying((prev) => ({ ...prev, [type]: false }));
      setVerified((prev) => ({ ...prev, [type]: true }));
      if (type === 'bvn' && !formData.accountName) {
        setFormData((prev) => ({ ...prev, accountName: formData.companyName || 'APEX INSURANCE BROKERS LTD' }));
      }
    }, 1200);
  };

  const handleFileUpload = (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedDocs((prev) => ({ ...prev, [docKey]: file.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBroker({
      ...formData,
      status: 'PENDING_VERIFICATION',
      riskScore: formData.vatCompliant ? 15 : 30,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/30 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>NHIA & NAICOM Regulatory Compliance Portal</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Broker Onboarding & Verification (KYC)
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Complete mandatory corporate registration, licensing validation, and payout account verification.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 min-w-[220px]">
            <p className="text-xs text-slate-400 font-medium">Approval Status</p>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  broker.status === 'ACTIVE'
                    ? 'bg-emerald-500'
                    : broker.status === 'PENDING_VERIFICATION'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="font-semibold text-sm capitalize">
                {broker.status.replace('_', ' ')}
              </span>
            </div>
            {broker.brokerCode && (
              <p className="text-xs text-teal-400 mt-2 font-mono">Code: {broker.brokerCode}</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Step 1: Corporate Profile & Registration */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-200">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span>1. Corporate Profile & Entity Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Broker Partnership Type</label>
              <select
                name="brokerType"
                value={formData.brokerType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="CORPORATE">Corporate Brokerage Firm</option>
                <option value="INDIVIDUAL">Individual Licensed Agent</option>
                <option value="AGGREGATOR">Retail Aggregator Network</option>
                <option value="BANCASSURANCE">Bancassurance Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Registered Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                placeholder="e.g. Apex Insurance Brokers Ltd"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CAC Registration (RC Number)</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="rcNumber"
                  value={formData.rcNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="RC-1294821"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleVerify('cac')}
                  className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 flex items-center shrink-0"
                >
                  {verifying.cac ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : verified.cac ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : 'Verify CAC'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NAICOM Broker License Number</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="naicomLicenseNumber"
                  value={formData.naicomLicenseNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="NAICOM/BRK/2024/089"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleVerify('naicom')}
                  className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 flex items-center shrink-0"
                >
                  {verifying.naicom ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : verified.naicom ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : 'Check NAICOM'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NAICOM Expiry Date</label>
              <input
                type="date"
                name="naicomExpiryDate"
                value={formData.naicomExpiryDate ? formData.naicomExpiryDate.split('T')[0] : ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NHIA Accreditation Number</label>
              <input
                type="text"
                name="nhiaAccreditationNo"
                value={formData.nhiaAccreditationNo}
                onChange={handleInputChange}
                placeholder="NHIA/ACT/9902"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Tax, BVN & Bank Payout Details */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-200">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <span>2. Tax Verification & NUBAN Commission Payout Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Verification Number (BVN)</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="bvn"
                  value={formData.bvn}
                  onChange={handleInputChange}
                  maxLength={11}
                  placeholder="22114455667"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleVerify('bvn')}
                  className="px-3 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800 flex items-center shrink-0"
                >
                  {verifying.bvn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : verified.bvn ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : 'Validate NUBAN'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                <option value="Zenith Bank">Zenith Bank</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="Access Bank">Access Bank</option>
                <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NUBAN Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                maxLength={10}
                placeholder="0123456789"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Validated Account Name</label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                readOnly
                placeholder="Auto-validated via Paystack/Dojah NUBAN"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tax Identification Number (TIN)</label>
              <input
                type="text"
                name="taxIdNumber"
                value={formData.taxIdNumber}
                onChange={handleInputChange}
                placeholder="TIN-98214019-0001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">National Identity Number (NIN)</label>
              <input
                type="text"
                name="nin"
                value={formData.nin}
                onChange={handleInputChange}
                maxLength={11}
                placeholder="10293847561"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Required Regulatory Uploads */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-200">
            <FileCheck2 className="w-5 h-5 text-teal-600" />
            <span>3. Audit Documents Upload & Watermarking</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[
              { key: 'cacCert', label: 'CAC Certificate of Incorporation (Form CAC 1.1)' },
              { key: 'naicomLicense', label: 'Valid NAICOM Broker License Copy' },
              { key: 'taxClearance', label: 'FIRS Tax Clearance Certificate (TCC)' },
              { key: 'indemnityCover', label: 'Professional Indemnity Insurance Cover Policy' },
            ].map((doc) => (
              <div key={doc.key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                  {uploadedDocs[doc.key] ? (
                    <div className="flex items-center space-x-2 mt-2 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="truncate max-w-[200px]">{uploadedDocs[doc.key]}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">PDF or High-Res Image (Max 5MB)</p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-teal-600" />
                    <span>Upload Document</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpeg,.jpg"
                      className="hidden"
                      onChange={(e) => handleFileUpload(doc.key, e)}
                    />
                  </label>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                    Mitera Watermarked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NDPA 2023 Consent & Submission */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="ndpaConsent"
              name="ndpaConsent"
              checked={formData.ndpaConsent}
              onChange={handleInputChange}
              required
              className="mt-1 w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="ndpaConsent" className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">NDPA 2023 Data Protection Consent:</span> I hereby consent to Mitera Health Limited processing my corporate and personally identifiable information (PII) strictly for regulatory compliance vetting with NHIA, NAICOM, FIRS, and commission payout setup under the Nigeria Data Protection Act 2023.
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Submitting sends your application to Mitera Compliance Queue for automated risk-scoring and final approval.
          </p>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center space-x-2"
          >
            <span>Submit Onboarding Application</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
