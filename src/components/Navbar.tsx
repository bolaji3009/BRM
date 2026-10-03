import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface NavbarProps {
  currentRole: 'BROKER' | 'HMO_ADMIN';
  userName: string;
  userEmail: string;
  onRoleSwitch?: (newRole: 'BROKER' | 'HMO_ADMIN') => void;
  onLogout?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  userName,
  userEmail,
  onRoleSwitch,
  onLogout,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/logo.png" alt="Mitera Health Logo" className="object-contain h-full w-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Mitera Health</span>
                <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded border border-teal-500/30">
                  BRM Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">National Health Insurance Authority (NHIA) Partner Hub</p>
            </div>
          </div>

          {/* User Info & Role Switcher */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{userName}</p>
              <p className="text-xs text-slate-400">{userEmail}</p>
            </div>

            {/* Quick Demo Role Toggle & Logout */}
            <div className="flex items-center space-x-2">
              {onRoleSwitch && (
                <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => onRoleSwitch('BROKER')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      currentRole === 'BROKER'
                        ? 'bg-teal-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Broker View
                  </button>
                  <button
                    onClick={() => onRoleSwitch('HMO_ADMIN')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      currentRole === 'HMO_ADMIN'
                        ? 'bg-teal-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    HMO Admin
                  </button>
                </div>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
