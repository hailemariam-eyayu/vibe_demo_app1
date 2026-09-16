import React, { useState } from 'react';
import { BankTransaction } from '../../types';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, Search, Filter, ShieldCheck } from 'lucide-react';
import { TransactionReceiptModal } from './TransactionReceiptModal';

interface RecentTransactionsProps {
  transactions: BankTransaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const [selectedTx, setSelectedTx] = useState<BankTransaction | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'ALL' && tx.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tx.title.toLowerCase().includes(q) ||
        tx.subtitle.toLowerCase().includes(q) ||
        tx.referenceNo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="my-5">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Recent Transactions
          </h3>
          <p className="text-[11px] text-purple-300/70">
            Real-time optimistic ledger & host receipts
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#160A29] border border-purple-900/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              filterType === 'ALL' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('DEBIT')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              filterType === 'DEBIT' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            Out
          </button>
          <button
            type="button"
            onClick={() => setFilterType('CREDIT')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              filterType === 'CREDIT' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            In
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-8 bg-[#140826]/40 rounded-2xl border border-purple-900/40">
            <p className="text-xs text-purple-300/70">No transactions found</p>
          </div>
        ) : (
          filtered.map((tx) => {
            const isDebit = tx.type === 'DEBIT';
            const isOptimistic = tx.status === 'OPTIMISTIC_PENDING';
            const isSettled = tx.status === 'SETTLED_SUCCESS';
            const isOffline = tx.status === 'OFFLINE_QUEUED';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-3.5 rounded-2xl bg-[#160A29] border border-purple-900/60 hover:border-purple-500/60 transition-all cursor-pointer group flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isDebit
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isDebit ? (
                      <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 group-hover:translate-y-0.5 group-hover:-translate-x-0.5 transition-transform" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                      {tx.title}
                    </h4>
                    <p className="text-[11px] text-purple-300/70 mt-0.5">{tx.subtitle}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-purple-400/60 font-mono">{tx.timestamp}</span>

                      {/* Status Badges */}
                      {isOptimistic && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                          <Clock className="w-2.5 h-2.5 animate-spin" />
                          <span>Host Confirming...</span>
                        </span>
                      )}

                      {isSettled && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Settled</span>
                        </span>
                      )}

                      {isOffline && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Queued Offline</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-bold font-mono ${
                      isDebit ? 'text-white' : 'text-emerald-400'
                    }`}
                  >
                    {isDebit ? '-' : '+'}ETB {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[9px] text-purple-400/60 font-mono block mt-0.5">
                    {tx.referenceNo.split('-').slice(0, 2).join('-')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionReceiptModal
        transaction={selectedTx}
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
