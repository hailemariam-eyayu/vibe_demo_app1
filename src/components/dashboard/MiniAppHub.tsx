import React, { useState } from 'react';
import { MiniAppItem, BankAccount, BankTransaction } from '../../types';
import { SyncService } from '../../services/syncService';
import { Smartphone, Plane, Car, Wifi, Zap, GraduationCap, ArrowUpRight, Sparkles } from 'lucide-react';
import { MiniAppRunnerModal } from './MiniAppRunnerModal';

interface MiniAppHubProps {
  account: BankAccount;
  onTransactionSuccess: (tx: BankTransaction) => void;
}

export const MiniAppHub: React.FC<MiniAppHubProps> = ({ account, onTransactionSuccess }) => {
  const miniApps = SyncService.getMiniApps();
  const [selectedApp, setSelectedApp] = useState<MiniAppItem | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Plane':
        return <Plane className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  return (
    <div className="my-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Mini App Ecosystem
          </h3>
          <span className="text-[10px] bg-[#1C0D2E] text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded font-mono">
            {miniApps.length} Synced
          </span>
        </div>
        <span className="text-[11px] text-purple-300 font-medium">
          Instant Checkout
        </span>
      </div>

      {/* Mini App Grid */}
      <div className="grid grid-cols-2 gap-3">
        {miniApps.map((app) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className="p-3.5 rounded-2xl bg-[#160A29] border border-purple-900/60 hover:border-purple-500/60 hover:bg-[#200D3B] transition-all cursor-pointer group flex flex-col justify-between shadow-sm relative overflow-hidden"
          >
            {/* Ambient subtle glow */}
            <div
              className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-15 blur-xl pointer-events-none"
              style={{ backgroundColor: app.themeColor }}
            />

            <div>
              <div className="flex items-start justify-between mb-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: app.themeColor }}
                >
                  {getIcon(app.iconName)}
                </div>

                <div className="flex items-center gap-1">
                  {app.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-700/50">
                      {app.badge}
                    </span>
                  )}
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
                </div>
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                {app.name}
              </h4>
              <p className="text-[10px] text-purple-300/70 mt-1 line-clamp-2 leading-relaxed">
                {app.description}
              </p>
            </div>

            <div className="pt-2.5 mt-2 border-t border-purple-900/40 flex items-center justify-between text-[9px] text-purple-400/60 font-mono">
              <span>{app.provider.split('/')[0]}</span>
              <span>{app.version}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini App Runner Container */}
      {selectedApp && (
        <MiniAppRunnerModal
          app={selectedApp}
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          account={account}
          onTransactionSuccess={onTransactionSuccess}
        />
      )}
    </div>
  );
};
