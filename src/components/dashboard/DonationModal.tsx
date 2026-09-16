import React, { useState } from 'react';
import { Heart, CheckCircle2, ShieldCheck, ArrowRight, X, AlertCircle, Sparkles } from 'lucide-react';
import { BankAccount, DonationItem, BankTransaction } from '../../types';
import { SyncService } from '../../services/syncService';
import { BiometricModal } from '../common/BiometricModal';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
  onDonationSuccess: (tx: BankTransaction) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  account,
  onDonationSuccess,
}) => {
  const donations = SyncService.getDonations();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem>(donations[0]);
  const [amount, setAmount] = useState<string>('500');
  const [donorNote, setDonorNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [showBiometric, setShowBiometric] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen) return null;

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }
    if (num > account.balance) {
      setError(`Insufficient balance. Current balance: ETB ${account.balance.toLocaleString()}`);
      return;
    }
    setShowBiometric(true);
  };

  const handleBiometricAuthorized = async () => {
    setShowBiometric(false);
    setIsExecuting(true);

    const num = parseFloat(amount);
    const result = await SyncService.executeOptimisticTransaction({
      title: `Donation: ${selectedDonation.name}`,
      subtitle: `Verified Charity • Acc: ${selectedDonation.accountNumber}`,
      amount: num,
      category: 'DONATION',
      recipientName: selectedDonation.name,
      recipientAccount: selectedDonation.accountNumber,
      notes: donorNote || 'Charitable contribution via Enat Bank App',
    });

    setIsExecuting(false);
    if (result.success) {
      onDonationSuccess(result.transaction);
      onClose();
    } else {
      setError(result.error || 'Donation failed');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#180A29] border border-purple-800/80 w-full max-w-md rounded-3xl p-5 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-600/25 border border-pink-500/40 flex items-center justify-center text-pink-300">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Enat Charity & Giving Hub
                </h3>
                <p className="text-[11px] text-purple-300/70">
                  {donations.length} Verified Philanthropic Partners (Cached)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-purple-300/70 hover:text-white p-1 rounded-xl hover:bg-purple-900/40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleInitiate} className="space-y-4 my-3">
            {/* Charity selector list */}
            <div>
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2">
                Choose Philanthropic Organization
              </label>
              <div className="space-y-2">
                {donations.map((item) => {
                  const isSelected = selectedDonation.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDonation(item)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-900/40 border-pink-500/70 shadow-md ring-1 ring-pink-500/30'
                          : 'bg-[#120521]/60 border-purple-900/50 hover:border-purple-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {item.name}
                            </h4>
                            {item.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-pink-300 font-medium">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-purple-300/70 font-mono">
                          #{item.accountNumber.slice(-4)}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-300/70 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donation Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
                  Donation Amount (ETB)
                </label>
                <span className="text-[11px] text-purple-300/80">
                  Balance: <span className="text-purple-200 font-mono font-bold">ETB {account.balance.toLocaleString()}</span>
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400 font-mono font-bold text-xs">
                  ETB
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              {/* Quick Amount Suggestion Chips */}
              <div className="flex items-center gap-1.5 mt-2">
                {selectedDonation.suggestedAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                      amount === val.toString()
                        ? 'bg-pink-600 text-white shadow'
                        : 'bg-purple-950/70 text-purple-200 hover:bg-purple-900 border border-purple-800/60'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Blessing Note */}
            <div>
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                Dedication / Note (Optional)
              </label>
              <input
                type="text"
                value={donorNote}
                onChange={(e) => setDonorNote(e.target.value)}
                placeholder="e.g. In loving memory of family, annual tithe"
                className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
              />
            </div>

            {error && (
              <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isExecuting || !amount}
              className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
            >
              <span>Authorize Donation with Biometrics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <BiometricModal
        isOpen={showBiometric}
        onClose={() => setShowBiometric(false)}
        onSuccess={handleBiometricAuthorized}
        title="Authorize Charitable Giving"
        subtitle={`Donating to ${selectedDonation.name}`}
        amountText={`ETB ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        defaultMode="FINGERPRINT"
      />
    </>
  );
};
