import React from 'react';

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
}) => {
  return (
    <header className="bg-[#037A86] text-white border-b border-[#025F69] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/logo.png" alt="Mitera Health Logo" className="object-contain h-full w-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Mitera Health</span>
                <span className="text-xs bg-[#0299A7] text-white font-semibold px-2 py-0.5 rounded border border-teal-300/30">
                  BRM Portal
                </span>
              </div>
              <p className="text-xs text-teal-100/80 font-medium hidden sm:block">National Health Insurance Authority (NHIA) Partner Hub</p>
            </div>
          </div>

          {/* User Info & Role Switcher */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{userName}</p>
              <p className="text-xs text-teal-100/80">{userEmail}</p>
            </div>

            {/* Quick Demo Role Toggle & Logout */}
            <div className="flex items-center space-x-2">
              {onRoleSwitch && (
                <div className="flex items-center bg-[#025F69] p-1 rounded-lg border border-teal-600/40">
                  <button
                    onClick={() => onRoleSwitch('BROKER')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      currentRole === 'BROKER'
                        ? 'bg-[#0299A7] text-white shadow-sm ring-1 ring-white/20'
                        : 'text-teal-100 hover:text-white'
                    }`}
                  >
                    Broker View
                  </button>
                  <button
                    onClick={() => onRoleSwitch('HMO_ADMIN')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      currentRole === 'HMO_ADMIN'
                        ? 'bg-[#0299A7] text-white shadow-sm ring-1 ring-white/20'
                        : 'text-teal-100 hover:text-white'
                    }`}
                  >
                    HMO Admin
                  </button>
                </div>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-[#EF8E85] hover:bg-[#D66F66] text-[#22282B] hover:text-white text-xs font-bold rounded-lg transition-all shadow-sm"
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
