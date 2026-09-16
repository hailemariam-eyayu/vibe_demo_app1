import React, { useState } from 'react';
import { Send, Building2, User, AlertCircle, CheckCircle2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { BankAccount, BankItem, BankTransaction } from '../../types';
import { SyncService } from '../../services/syncService';
import { BiometricModal } from '../common/BiometricModal';

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
  onTransactionSuccess: (tx: BankTransaction) => void;
}

export const BankTransferModal: React.FC<BankTransferModalProps> = ({
  isOpen,
  onClose,
  account,
  onTransactionSuccess,
}) => {
  const banks = SyncService.getBanks();
  const [selectedBank, setSelectedBank] = useState<BankItem>(banks[0] || null);
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Biometric authorization state
  const [showBiometric, setShowBiometric] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen) return null;

  const handleAccountChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setBeneficiaryAccount(cleaned);
    // Simulate beneficiary lookup
    if (cleaned.length >= 8) {
      const sampleNames = [
        'Abebe Bikila Desta',
        'Tirunesh Dibaba Cheru',
        'Almaz Ayana Tadesse',
        'Haile Gebrselassie B.',
        'Mulugeta Tesfaye K.',
      ];
      const charSum = cleaned.split('').reduce((acc, c) => acc + parseInt(c), 0);
      setBeneficiaryName(sampleNames[charSum % sampleNames.length]);
    } else {
      setBeneficiaryName('');
    }
  };

  const handleInitiateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (numAmount > account.balance) {
      setError(`Insufficient balance. Maximum available: ETB ${account.balance.toLocaleString()}`);
      return;
    }

    if (!beneficiaryAccount || beneficiaryAccount.length < 8) {
      setError('Please enter a valid 8+ digit beneficiary account number.');
      return;
    }

    // Trigger MFA / Biometric approval
    setShowBiometric(true);
  };

  const handleBiometricAuthorized = async () => {
    setShowBiometric(false);
    setIsExecuting(true);

    const numAmount = parseFloat(amount);
    const recipient = beneficiaryName || 'Beneficiary Account';

    // Execute optimistic update: balance is deducted locally immediately!
    const result = await SyncService.executeOptimisticTransaction({
      title: `Transfer to ${recipient}`,
      subtitle: `${selectedBank.shortName} • Acc ...${beneficiaryAccount.slice(-4)}`,
      amount: numAmount,
      category: 'TRANSFER',
      recipientBank: selectedBank.shortName,
      recipientAccount: beneficiaryAccount,
      recipientName: recipient,
      notes: remark || 'Mobile interbank transfer',
    });

    setIsExecuting(false);
    if (result.success) {
      onTransactionSuccess(result.transaction);
      onClose();
    } else {
      setError(result.error || 'Transfer failed');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#180A29] border border-purple-800/80 w-full max-w-md rounded-3xl p-5 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Transfer Money
                </h3>
                <p className="text-[11px] text-purple-300/70">
                  Instant Enat & Ethiopian Interbank Clearing
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

          <form onSubmit={handleInitiateTransfer} className="space-y-4 my-4">
            {/* Select Destination Bank */}
            <div>
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                Destination Bank ({banks.length} Synced)
              </label>
              <div className="relative">
                <select
                  value={selectedBank?.id}
                  onChange={(e) => {
                    const found = banks.find((b) => b.id === e.target.value);
                    if (found) setSelectedBank(found);
                  }}
                  className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 appearance-none font-medium cursor-pointer"
                >
                  {banks.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#180A29] text-white">
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-purple-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                Beneficiary Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={beneficiaryAccount}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  placeholder="e.g. 100029384910"
                  className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              {/* Beneficiary Auto Inquiry Result */}
              {beneficiaryName && (
                <div className="mt-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-medium">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{beneficiaryName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
                  Amount (ETB)
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
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex items-center gap-1.5 mt-2">
                {[500, 1000, 2500, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900 text-[10px] font-mono font-semibold text-purple-200 border border-purple-800/60 cursor-pointer"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Remark */}
            <div>
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                Payment Remark (Optional)
              </label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="e.g. Invoice payment, personal gift"
                className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {error && (
              <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Optimistic Explanation Note */}
            <div className="bg-[#10051E]/80 border border-purple-900/60 rounded-2xl p-2.5 text-[11px] text-purple-300/80 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-purple-200">Optimistic Execution:</strong> Your local balance updates instantly. Core banking host confirmation then validates the transaction in background.
              </p>
            </div>

            <button
              type="submit"
              disabled={isExecuting || !amount || !beneficiaryAccount}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
            >
              <span>Continue to Biometric Approval</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Biometric Multi-Factor Authentication Modal */}
      <BiometricModal
        isOpen={showBiometric}
        onClose={() => setShowBiometric(false)}
        onSuccess={handleBiometricAuthorized}
        title="Authorize Interbank Transfer"
        subtitle={`Sending to ${beneficiaryName || beneficiaryAccount} at ${selectedBank.shortName}`}
        amountText={`ETB ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        defaultMode="FINGERPRINT"
      />
    </>
  );
};
