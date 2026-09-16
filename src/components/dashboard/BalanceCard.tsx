import React, { useState } from 'react';
import { Eye, EyeOff, Send, Heart, Grid, QrCode, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { BankAccount } from '../../types';

interface BalanceCardProps {
  account: BankAccount;
  onOpenTransfer: () => void;
  onOpenDonations: () => void;
  onOpenMiniApps: () => void;
  onOpenQr: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  account,
  onOpenTransfer,
  onOpenDonations,
  onOpenMiniApps,
  onOpenQr,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="relative">
      {/* Signature Enat Royal Purple & Violet Banking Card */}
      <div
        className="rounded-3xl p-5 shadow-2xl relative overflow-hidden text-white border border-purple-400/40"
        style={{
          background: 'linear-gradient(135deg, #2E0854 0%, #4A0E6E 35%, #581C87 70%, #6B21A8 100%)',
          boxShadow: '0 20px 40px -15px rgba(88, 28, 135, 0.6), 0 0 20px rgba(192, 132, 252, 0.25)',
        }}
      >
        {/* Subtle decorative watermark & luxury maternal curves */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-36 h-36 opacity-15 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized Enat sweeping curves watermark */}
            <path d="M25 15H35V85H25V15Z" fill="#FFFFFF" />
            <path d="M35 18C50 18 75 20 85 28C82 36 68 32 35 32V18Z" fill="#FFFFFF" />
            <path d="M35 46C48 46 65 47 75 52C72 58 58 56 35 56V46Z" fill="#FFFFFF" />
            <path d="M35 72C52 72 75 75 85 82C82 89 65 86 35 86V72Z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Top Card Row */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-purple-200 tracking-wider uppercase">
                {account.accountType}
              </span>
              <span className="text-[9px] bg-purple-950/80 text-purple-200 border border-purple-400/50 px-2 py-0.5 rounded font-mono font-semibold">
                PRIMARY
              </span>
            </div>
            <p className="text-xs text-purple-200/80 font-mono mt-1 tracking-wider">
              {account.accountNumber}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#170529]/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-400/40 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-[10px] font-bold tracking-wider text-purple-200">ENAT VIP</span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="my-5 relative z-10">
          <div className="flex items-center gap-2 text-purple-200/80 text-xs">
            <span>Available Balance</span>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 text-purple-300 hover:text-white transition-colors cursor-pointer"
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-purple-300 font-mono">ETB</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {showBalance ? account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '••••••••'}
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Optimistic Instant Sync Active
            </span>
          </div>
        </div>

        {/* Card Holder & Expiry */}
        <div className="flex items-end justify-between pt-2 border-t border-purple-500/30 text-purple-200 text-xs relative z-10">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-purple-300/70 block">Account Holder</span>
            <span className="font-semibold text-white tracking-wide">{account.holderName}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-purple-300/70 block">Branch</span>
            <span className="text-[11px] text-purple-100">Kazanchis Addis</span>
          </div>
        </div>
      </div>

      {/* Quick Banking Actions Ribbon */}
      <div className="grid grid-cols-4 gap-2.5 mt-4">
        <button
          type="button"
          onClick={onOpenTransfer}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#160A29] border border-purple-900/60 hover:border-purple-500/60 hover:bg-[#200D3B] transition-all group cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/25 group-hover:bg-purple-600/40 flex items-center justify-center text-purple-300 transition-colors mb-1.5">
            <Send className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white">Transfer</span>
          <span className="text-[9px] text-purple-300/60">Interbank</span>
        </button>

        <button
          type="button"
          onClick={onOpenMiniApps}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#160A29] border border-purple-900/60 hover:border-purple-500/60 hover:bg-[#200D3B] transition-all group cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-fuchsia-600/25 group-hover:bg-fuchsia-600/40 flex items-center justify-center text-fuchsia-300 transition-colors mb-1.5">
            <Grid className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white">Mini Apps</span>
          <span className="text-[9px] text-purple-300/60">Services</span>
        </button>

        <button
          type="button"
          onClick={onOpenDonations}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#160A29] border border-purple-900/60 hover:border-purple-500/60 hover:bg-[#200D3B] transition-all group cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-600/25 group-hover:bg-pink-600/40 flex items-center justify-center text-pink-300 transition-colors mb-1.5">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white">Donate</span>
          <span className="text-[9px] text-purple-300/60">Charity</span>
        </button>

        <button
          type="button"
          onClick={onOpenQr}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#160A29] border border-purple-900/60 hover:border-purple-500/60 hover:bg-[#200D3B] transition-all group cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/25 group-hover:bg-purple-500/40 flex items-center justify-center text-purple-200 transition-colors mb-1.5">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white">Scan QR</span>
          <span className="text-[9px] text-purple-300/60">Pay Merchant</span>
        </button>
      </div>
    </div>
  );
};
