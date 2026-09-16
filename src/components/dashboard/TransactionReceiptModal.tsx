import React, { useState } from 'react';
import { BankTransaction } from '../../types';
import { EnatLogo } from '../common/EnatLogo';
import { CheckCircle2, Clock, Share2, Download, X, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';

interface TransactionReceiptModalProps {
  transaction: BankTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(transaction.referenceNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOptimistic = transaction.status === 'OPTIMISTIC_PENDING';
  const isSettled = transaction.status === 'SETTLED_SUCCESS';
  const isOffline = transaction.status === 'OFFLINE_QUEUED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#180A29] border border-purple-800/80 w-full max-w-sm rounded-3xl p-5 shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300/70 hover:text-white p-1 rounded-lg hover:bg-purple-900/40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="text-center pt-2 pb-4 border-b border-purple-900/60">
          <EnatLogo size="md" className="justify-center mb-2" />
          <p className="text-[10px] text-purple-300 uppercase tracking-widest font-semibold">
            Official Electronic Transaction Advice
          </p>
          <p className="text-[10px] text-purple-400/70 mt-0.5">National Payment Switch of Ethiopia</p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center my-4">
          {isSettled && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Host Confirmed & Settled</span>
            </div>
          )}
          {isOptimistic && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Optimistic • Handshaking with Host...</span>
            </div>
          )}
          {isOffline && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Offline Queued in Secure Vault</span>
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="text-center my-2">
          <span className="text-[11px] text-purple-300/70 block mb-1">Transaction Amount</span>
          <div className="text-3xl font-extrabold text-white font-mono flex items-center justify-center gap-1">
            <span className="text-purple-300 text-lg">ETB</span>
            <span>{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Receipt Breakdown Table */}
        <div className="bg-[#10051E] border border-purple-900/60 rounded-2xl p-3.5 my-4 space-y-2.5 text-xs font-mono">
          <div className="flex justify-between items-center text-purple-300/70">
            <span>Reference No:</span>
            <div className="flex items-center gap-1">
              <span className="text-purple-300 font-bold">{transaction.referenceNo}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="text-purple-400 hover:text-white p-0.5 cursor-pointer"
                title="Copy reference"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-purple-300/70">
            <span>Description:</span>
            <span className="text-white font-sans font-medium text-right max-w-[180px] truncate">
              {transaction.title}
            </span>
          </div>

          {transaction.recipientBank && (
            <div className="flex justify-between text-purple-300/70">
              <span>Beneficiary Bank:</span>
              <span className="text-purple-100">{transaction.recipientBank}</span>
            </div>
          )}

          {transaction.recipientAccount && (
            <div className="flex justify-between text-purple-300/70">
              <span>Beneficiary Acc:</span>
              <span className="text-purple-100">...{transaction.recipientAccount.slice(-6)}</span>
            </div>
          )}

          <div className="flex justify-between text-purple-300/70">
            <span>Timestamp:</span>
            <span className="text-purple-100">{transaction.timestamp}</span>
          </div>

          {transaction.hostConfirmationTime && (
            <div className="flex justify-between text-purple-300/70">
              <span>Host Clearance:</span>
              <span className="text-emerald-400 font-semibold">{transaction.hostConfirmationTime}</span>
            </div>
          )}
        </div>

        {/* Security Stamp */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-purple-300/70 pt-1 pb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Digitally Signed by Enat Bank S.C. Core Ledger</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              alert(`Receipt for ${transaction.referenceNo} saved to device.`);
            }}
            className="flex-1 bg-purple-950/70 hover:bg-purple-900 border border-purple-800/60 text-purple-200 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
