import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, ChevronDown, Database, Server, Clock, AlertTriangle, X } from 'lucide-react';
import { SyncService } from '../../services/syncService';
import { SyncMetadata } from '../../types';

export const SyncStatusPill: React.FC = () => {
  const [meta, setMeta] = useState<SyncMetadata>(SyncService.getSyncMetadata());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManuallySyncing, setIsManuallySyncing] = useState(false);

  useEffect(() => {
    const unsub = SyncService.subscribeSync((newMeta) => {
      setMeta({ ...newMeta });
    });
    return unsub;
  }, []);

  const handleForceSync = async () => {
    setIsManuallySyncing(true);
    await SyncService.checkVersionAndSync(true);
    setIsManuallySyncing(false);
  };

  const handleToggleOnline = () => {
    SyncService.setOnlineStatus(!meta.isOnline);
  };

  return (
    <>
      {/* Real-time Status Pill */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shadow-sm border backdrop-blur-md cursor-pointer group"
        style={{
          backgroundColor: !meta.isOnline
            ? 'rgba(239, 68, 68, 0.15)'
            : meta.isSyncing
            ? 'rgba(168, 85, 247, 0.2)'
            : 'rgba(147, 51, 234, 0.18)',
          borderColor: !meta.isOnline
            ? 'rgba(239, 68, 68, 0.4)'
            : meta.isSyncing
            ? 'rgba(192, 132, 252, 0.5)'
            : 'rgba(168, 85, 247, 0.4)',
          color: !meta.isOnline
            ? '#FCA5A5'
            : meta.isSyncing
            ? '#F0ABFC'
            : '#E9D5FF',
        }}
        title="View Real-time Sync & Cache Status"
      >
        <span className="relative flex h-2 w-2">
          {meta.isSyncing ? (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          ) : meta.isOnline ? (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          )}
        </span>

        {meta.isSyncing ? (
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin text-purple-300" />
            <span>Syncing Host...</span>
          </span>
        ) : !meta.isOnline ? (
          <span className="flex items-center gap-1">
            <WifiOff className="w-3 h-3 text-rose-400" />
            <span>Offline (Local Mode)</span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-purple-300" />
            <span>Synced • {meta.cachedVersion}</span>
          </span>
        )}

        <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Sync Inspector Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0412]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#140824] border border-purple-800/60 w-full max-w-md rounded-3xl p-5 shadow-2xl text-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Real-Time Synchronization Status
                  </h3>
                  <p className="text-[11px] text-purple-300/70">
                    Offline Cache & Core Banking Host State
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-purple-300/60 hover:text-white p-1 rounded-lg hover:bg-purple-900/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 my-4">
              <div className="bg-[#1C0D30] border border-purple-800/40 rounded-2xl p-3">
                <div className="flex items-center justify-between text-xs text-purple-300/70 mb-1">
                  <span>Cache Version</span>
                  <Server className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-base font-bold text-white font-mono flex items-center gap-1.5">
                  <span>{meta.cachedVersion}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-purple-300/60 mt-1">Host catalog version</p>
              </div>

              <div className="bg-[#1C0D30] border border-purple-800/40 rounded-2xl p-3">
                <div className="flex items-center justify-between text-xs text-purple-300/70 mb-1">
                  <span>Last Reconciled</span>
                  <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {meta.lastSyncedAt || 'Active'}
                </div>
                <p className="text-[10px] text-purple-300/60 mt-1">
                  {meta.isOnline ? 'Direct Host Connection' : 'Queued offline transactions'}
                </p>
              </div>
            </div>

            {/* Offline Simulator Switch */}
            <div className="bg-[#180A28] border border-purple-800/40 rounded-2xl p-3.5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-100">
                    {meta.isOnline ? (
                      <Wifi className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-rose-400" />
                    )}
                    <span>Simulate Network Connection</span>
                  </div>
                  <p className="text-[11px] text-purple-300/70 mt-0.5">
                    Test optimistic local updates and offline queues
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleOnline}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                    meta.isOnline
                      ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {meta.isOnline ? 'Online' : 'Offline'}
                </button>
              </div>
            </div>

            {/* Sync Logs */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-purple-300/80 uppercase tracking-wider">
                  Sync Audit Activity
                </span>
                <span className="text-[10px] text-purple-300/60">Live feed</span>
              </div>
              <div className="bg-[#0D0417] border border-purple-900/60 rounded-xl p-2.5 max-h-36 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                {meta.syncLog.slice(0, 6).map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-purple-200/90">
                    <span className="text-purple-400">›</span>
                    <span className="leading-snug">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleForceSync}
                disabled={isManuallySyncing || !meta.isOnline}
                className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/40 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isManuallySyncing ? 'animate-spin' : ''}`} />
                <span>{isManuallySyncing ? 'Refreshing from Host...' : 'Check & Refresh Catalogs'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 border border-purple-800/40 font-medium py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
