import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface NavbarProps {
  currentRole: 'BROKER' | 'HMO_ADMIN';
  userName: string;
  userEmail: string;
  onRoleSwitch?: (newRole: 'BROKER' | 'HMO_ADMIN') => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  userName,
  userEmail,
  onRoleSwitch,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-[#62c6d3] text-slate-900 border-b border-[#52b6c3] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/logo.png" alt="Mitera Health Logo" className="object-contain h-full w-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Mitera Health</span>
                <span className="text-xs bg-slate-900 text-white font-semibold px-2 py-0.5 rounded border border-slate-800">
                  BRM Portal
                </span>
              </div>
              <p className="text-xs text-slate-800 font-medium hidden sm:block">National Health Insurance Authority (NHIA) Partner Hub</p>
            </div>
          </div>

          {/* User Info & Role Switcher */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-800">{userEmail}</p>
            </div>

            {/* Quick Demo Role Toggle */}
            <div className="flex items-center bg-slate-900/10 p-1 rounded-lg border border-slate-900/20">
              <button
                onClick={() => onRoleSwitch && onRoleSwitch('BROKER')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentRole === 'BROKER'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-800 hover:text-slate-900'
                }`}
              >
                Broker Portal
              </button>
              <button
                onClick={() => onRoleSwitch && onRoleSwitch('HMO_ADMIN')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentRole === 'HMO_ADMIN'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-800 hover:text-slate-900'
                }`}
              >
                HMO Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
