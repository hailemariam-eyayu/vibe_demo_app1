import React, { useState } from 'react';
import { QrCode, ScanLine, X, Copy, Check, ShieldCheck } from 'lucide-react';
import { BankAccount } from '../../types';
import { EnatLogo } from '../common/EnatLogo';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, account }) => {
  const [activeTab, setActiveTab] = useState<'RECEIVE' | 'SCAN'>('RECEIVE');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#180A29] border border-purple-800/80 w-full max-w-sm rounded-3xl p-5 shadow-2xl text-slate-100 relative">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Enat QR Pay</h3>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300/70 hover:text-white p-1 rounded-xl hover:bg-purple-900/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#10051E] rounded-2xl border border-purple-900/60 my-4">
          <button
            type="button"
            onClick={() => setActiveTab('RECEIVE')}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'RECEIVE'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            My Receive QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SCAN')}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'SCAN'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            Scan Merchant QR
          </button>
        </div>

        {activeTab === 'RECEIVE' ? (
          <div className="flex flex-col items-center text-center py-2">
            {/* Realistic stylized QR container */}
            <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-purple-400/80 mb-3 relative">
              {/* Center Enat emblem in QR code */}
              <div className="w-48 h-48 bg-white flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#3B0764" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#FFF" />
                  <rect x="13" y="13" width="10" height="10" fill="#581C87" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#3B0764" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#FFF" />
                  <rect x="77" y="13" width="10" height="10" fill="#581C87" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#3B0764" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#FFF" />
                  <rect x="13" y="77" width="10" height="10" fill="#581C87" />

                  {/* QR Matrix dot simulation */}
                  <rect x="36" y="8" width="8" height="8" rx="2" fill="#3B0764" />
                  <rect x="48" y="14" width="6" height="6" fill="#3B0764" />
                  <rect x="58" y="8" width="6" height="6" rx="1" fill="#3B0764" />

                  <rect x="8" y="38" width="8" height="8" fill="#3B0764" />
                  <rect x="20" y="42" width="6" height="6" fill="#3B0764" />
                  <rect x="14" y="54" width="8" height="8" rx="2" fill="#3B0764" />

                  <rect x="38" y="36" width="6" height="6" fill="#3B0764" />
                  <rect x="56" y="38" width="6" height="6" fill="#3B0764" />
                  <rect x="38" y="58" width="6" height="6" fill="#3B0764" />
                  <rect x="56" y="56" width="6" height="6" fill="#3B0764" />

                  <rect x="72" y="38" width="8" height="8" fill="#3B0764" />
                  <rect x="84" y="46" width="6" height="6" fill="#3B0764" />
                  <rect x="76" y="58" width="8" height="8" fill="#3B0764" />

                  <rect x="38" y="72" width="8" height="8" fill="#3B0764" />
                  <rect x="50" y="76" width="6" height="6" fill="#3B0764" />
                  <rect x="42" y="84" width="6" height="6" fill="#3B0764" />
                  <rect x="68" y="78" width="8" height="8" fill="#3B0764" />
                  <rect x="80" y="84" width="10" height="6" fill="#3B0764" />
                </svg>

                {/* Central Brand Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#581C87] to-[#3B0764] border-2 border-purple-400 flex items-center justify-center shadow-lg">
                    <span className="text-[10px] font-black text-white">ENAT</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-white tracking-wide">{account.holderName}</p>
            <p className="text-[11px] text-purple-300/70 font-mono mt-0.5">{account.accountNumber}</p>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 text-xs bg-purple-950/70 hover:bg-purple-900 border border-purple-800/60 text-purple-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Account' : 'Copy Account Number'}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="relative w-48 h-48 rounded-3xl bg-[#10051E] border-2 border-dashed border-purple-400/60 flex items-center justify-center overflow-hidden">
              <ScanLine className="w-12 h-12 text-purple-400 animate-pulse" />
              {/* Laser line */}
              <div className="absolute inset-x-0 h-0.5 bg-purple-400 shadow-[0_0_8px_#C084FC] animate-bounce" />
            </div>
            <p className="text-xs text-purple-200 mt-3 text-center">
              Align merchant or peer QR code inside the frame to pay instantly
            </p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-purple-900/60 flex items-center justify-center gap-1.5 text-[11px] text-purple-300/70">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interoperable with EthSwitch National QR</span>
        </div>
      </div>
    </div>
  );
};
