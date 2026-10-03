'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, UserPlus, KeyRound, CheckCircle2, User, Building2 } from 'lucide-react';
import { BrokerOnboardingForm } from '@/components/BrokerOnboardingForm';
import { BrokerData } from '@/lib/mockDb';

interface AuthPageProps {
  onLogin: (role: 'BROKER' | 'HMO_ADMIN', email: string, brokerData?: BrokerData) => void;
  mockBrokers: BrokerData[];
  onRegisterBroker: (newBroker: Partial<BrokerData>) => BrokerData;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLogin,
  mockBrokers,
  onRegisterBroker,
}) => {
  const [view, setView] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // HMO Admin Credentials
    if (email.trim().toLowerCase() === 'admin@miterahealth.com.ng' && password === 'mitera@12345%') {
      onLogin('HMO_ADMIN', email);
      return;
    }

    // Corporate Broker Test Creds
    if (email.trim().toLowerCase() === 'corporate@apexinsurance.ng' && password === 'broker123') {
      const corpBroker = mockBrokers.find((b) => b.brokerType === 'CORPORATE') || mockBrokers[0];
      onLogin('BROKER', email, corpBroker);
      return;
    }

    // Individual Broker Test Creds
    if (email.trim().toLowerCase() === 'individual@broker.ng' && password === 'broker123') {
      const indBroker = mockBrokers.find((b) => b.brokerType === 'INDIVIDUAL') || {
        id: 'brk-ind-001',
        userId: 'usr-ind-001',
        companyName: 'Babajide Chukwuma',
        brokerType: 'INDIVIDUAL' as const,
        naicomLicenseNumber: 'NAICOM/IND/2024/991',
        naicomExpiryDate: '2026-12-31',
        nhiaAccreditationNo: 'NHIA/IND/001',
        accountNumber: '0987654321',
        bankName: 'Zenith Bank',
        accountName: 'Babajide Chukwuma',
        phone: '+234 803 111 2222',
        state: 'Lagos',
        lga: 'Ikeja',
        address: '12 Allen Avenue, Ikeja, Lagos',
        status: 'ACTIVE' as const,
        tierLevel: 'RETAIL_AGENT' as const,
        riskScore: 10,
        vatCompliant: false,
        ndpaConsent: true,
        quizPassed: true,
        brokerCode: 'HMO-BRK-IND-1002',
        createdAt: new Date().toISOString(),
      };
      onLogin('BROKER', email, indBroker);
      return;
    }

    // Check if matching any broker email in system
    const matched = mockBrokers.find((b) => b.companyName.toLowerCase().includes('apex') && email.toLowerCase().includes('apex'));
    if (matched && password === 'broker123') {
      onLogin('BROKER', email, matched);
      return;
    }

    setErrorMsg('Invalid login credentials. Please use test credentials provided below.');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
  };

  const handleSignupSubmit = (brokerData: Partial<BrokerData>) => {
    const createdBroker = onRegisterBroker(brokerData);
    alert(`Registration & Onboarding Successful! Auto-generated Broker Code: ${createdBroker.brokerCode}`);
    onLogin('BROKER', `${createdBroker.companyName.toLowerCase().replace(/\s+/g, '')}@broker.ng`, createdBroker);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Branding */}
      <div className="text-center max-w-md mx-auto mb-8">
        <div className="w-16 h-14 rounded-2xl bg-white p-2 mx-auto flex items-center justify-center shadow-xl mb-4">
          <img src="/logo.png" alt="Mitera Health Logo" className="object-contain h-full w-full" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Mitera Health HMO</h1>
        <p className="text-slate-400 text-xs mt-1 font-semibold tracking-wide uppercase">
          Broker Relationship Management (BRM) Portal
        </p>
      </div>

      {view === 'LOGIN' && (
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-teal-400" />
              <span>Portal Sign In</span>
            </h2>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2.5 py-1 rounded-full border border-teal-500/30">
              NHIA Gated Access
            </span>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setView('FORGOT')}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <p className="text-xs text-slate-400">
              New broker partner?{' '}
              <button
                onClick={() => setView('SIGNUP')}
                className="text-teal-400 hover:text-teal-300 font-bold ml-1"
              >
                Register & Onboard
              </button>
            </p>
          </div>

          {/* Preset Demo Credentials Box */}
          <div className="mt-6 p-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl text-left space-y-2">
            <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Test Access Credentials</span>
            </p>

            <div className="text-xs space-y-1.5 pt-1 text-slate-300 font-mono">
              <div
                onClick={() => {
                  setEmail('admin@miterahealth.com.ng');
                  setPassword('mitera@12345%');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded mr-2 font-sans">
                    HMO Admin
                  </span>
                  <p className="text-slate-200">admin@miterahealth.com.ng</p>
                </div>
                <span className="text-[10px] text-teal-400 font-sans">Click to fill</span>
              </div>

              <div
                onClick={() => {
                  setEmail('corporate@apexinsurance.ng');
                  setPassword('broker123');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 rounded mr-2 font-sans">
                    Corporate Broker
                  </span>
                  <p className="text-slate-200">corporate@apexinsurance.ng</p>
                </div>
                <span className="text-[10px] text-teal-400 font-sans">Click to fill</span>
              </div>

              <div
                onClick={() => {
                  setEmail('individual@broker.ng');
                  setPassword('broker123');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded mr-2 font-sans">
                    Individual Agent
                  </span>
                  <p className="text-slate-200">individual@broker.ng</p>
                </div>
                <span className="text-[10px] text-teal-400 font-sans">Click to fill</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'FORGOT' && (
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-slate-400 text-xs mb-6">
            Enter your accredited broker email to receive password recovery instructions.
          </p>

          {resetSent ? (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <p className="font-bold">Password Reset Link Dispatched</p>
              <p className="text-[11px] text-emerald-200">
                Check your inbox at <span className="font-mono text-white">{email}</span> for reset instructions.
              </p>
              <button
                onClick={() => {
                  setResetSent(false);
                  setView('LOGIN');
                }}
                className="mt-2 text-xs text-white font-bold underline"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Broker Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="broker@company.ng"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Send Reset Link
              </button>

              <button
                type="button"
                onClick={() => setView('LOGIN')}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      )}

      {view === 'SIGNUP' && (
        <div className="w-full max-w-4xl bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-slate-900">
          <div className="flex items-center justify-between mb-6 border-b border-slate-700/80 pb-4 text-white">
            <div>
              <h2 className="text-2xl font-extrabold">Broker Self-Service Onboarding & Registration</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Fill in your entity & accreditation details once to instantly create your broker account and submitted profile.
              </p>
            </div>

            <button
              onClick={() => setView('LOGIN')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl"
            >
              Back to Login
            </button>
          </div>

          <BrokerOnboardingForm
            broker={{
              id: `brk-${Date.now()}`,
              userId: `usr-brk-${Date.now()}`,
              companyName: '',
              brokerType: 'CORPORATE',
              rcNumber: '',
              naicomLicenseNumber: '',
              naicomExpiryDate: '',
              nhiaAccreditationNo: '',
              taxIdNumber: '',
              vatCompliant: false,
              bankName: 'Guaranty Trust Bank (GTBank)',
              accountNumber: '',
              accountName: '',
              phone: '',
              state: 'Lagos',
              lga: 'Ikeja',
              address: '',
              status: 'PENDING_VERIFICATION',
              tierLevel: 'RETAIL_AGENT',
              riskScore: 10,
              ndpaConsent: false,
              quizPassed: false,
              createdAt: new Date().toISOString(),
            }}
            onUpdateBroker={(data) => handleSignupSubmit(data)}
          />
        </div>
      )}
    </div>
  );
};
