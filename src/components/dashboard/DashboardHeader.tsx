import React from 'react';
import { EnatLogo } from '../common/EnatLogo';
import { SyncStatusPill } from '../common/SyncStatusPill';
import { Bell, Settings, LogOut, Shield } from 'lucide-react';
import { UserAuthSession } from '../../types';

interface DashboardHeaderProps {
  session: UserAuthSession;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  session,
  onOpenSettings,
  onLogout,
}) => {
  return (
    <div className="pb-3 border-b border-purple-900/40">
      {/* Top row with Logo and Live Sync Pill */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <EnatLogo size="sm" showTagline={false} />
        <div className="flex items-center gap-1.5">
          <SyncStatusPill />
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-[#160A29] border border-purple-900/60 hover:border-purple-500/60 flex items-center justify-center text-purple-200 hover:text-white transition-colors cursor-pointer"
            title="Settings & System Cache"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-8 h-8 rounded-full bg-[#160A29] border border-purple-900/60 hover:border-rose-500/60 flex items-center justify-center text-purple-300/60 hover:text-rose-400 transition-colors cursor-pointer"
            title="Lock App / Switch User"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* User greeting and quick status */}
      <div className="flex items-center justify-between px-0.5">
        <div>
          <span className="text-[11px] font-medium text-purple-300">Welcome back,</span>
          <h1 className="text-base font-bold text-white tracking-tight leading-snug">
            {session.fullName.split(' ')[0]} {session.fullName.split(' ')[1] || ''}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 bg-[#160A29] border border-purple-800/60 px-2.5 py-1 rounded-full text-[10px] text-purple-200 font-mono">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Biometrics Active</span>
        </div>
      </div>
    </div>
  );
};
