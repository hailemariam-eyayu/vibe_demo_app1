import React, { useState } from 'react';
import { Settings, Database, RefreshCw, Wifi, WifiOff, ShieldCheck, Trash2, X, Fingerprint, ScanFace, CheckCircle2 } from 'lucide-react';
import { SyncService } from '../../services/syncService';
import { MockKeycloakService } from '../../services/mockKeycloak';
import { UserAuthSession, SyncMetadata } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserAuthSession;
  onSessionUpdated: (session: UserAuthSession) => void;
  onResetActivation: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  session,
  onSessionUpdated,
  onResetActivation,
}) => {
  const [meta, setMeta] = useState<SyncMetadata>(SyncService.getSyncMetadata());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await SyncService.checkVersionAndSync(true);
    setMeta(SyncService.getSyncMetadata());
    setIsSyncing(false);
    setSyncFeedback(res.message);
  };

  const handleToggleOnline = () => {
    SyncService.setOnlineStatus(!meta.isOnline);
    setMeta(SyncService.getSyncMetadata());
  };

  const handleToggleBiometrics = () => {
    const updated = { ...session, biometricsEnabled: !session.biometricsEnabled };
    MockKeycloakService.saveSession(updated);
    onSessionUpdated(updated);
  };

  const handleToggleFaceId = () => {
    const updated = { ...session, faceIdEnabled: !session.faceIdEnabled };
    MockKeycloakService.saveSession(updated);
    onSessionUpdated(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#180A29] border border-purple-800/80 w-full max-w-md rounded-3xl p-5 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Security & Cache Settings
              </h3>
              <p className="text-[11px] text-purple-300/70">
                Enat Mobile Banking Configuration
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

        <div className="space-y-4 my-4">
          {/* Version and Cache Policy */}
          <div className="bg-[#10051E] border border-purple-900/60 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Versioned Catalog Cache Policy</span>
              </span>
              <span className="text-[10px] font-mono bg-purple-950 text-purple-200 border border-purple-800/60 px-2 py-0.5 rounded">
                v3.2.0
              </span>
            </div>
            <p className="text-[11px] text-purple-300/70 leading-relaxed mb-3">
              On login, the app checks the version against the remote banking service. If identical, downloads are skipped and cached data is served instantly.
            </p>

            {syncFeedback && (
              <div className="mb-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{syncFeedback}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleForceSync}
              disabled={isSyncing}
              className="w-full bg-purple-950/70 hover:bg-purple-900 border border-purple-800/60 text-purple-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing with Server...' : 'Force Redownload Catalogs (Test Version Sync)'}</span>
            </button>
          </div>

          {/* Offline / Online Network Simulator */}
          <div className="bg-[#10051E] border border-purple-900/60 rounded-2xl p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {meta.isOnline ? (
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span>Network Simulation State</span>
                </span>
                <p className="text-[11px] text-purple-300/70 mt-1">
                  Test optimistic balance updates & offline queuing
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleOnline}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  meta.isOnline
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {meta.isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
          </div>

          {/* Biometrics Management */}
          <div className="bg-[#10051E] border border-purple-900/60 rounded-2xl p-3.5 space-y-3">
            <span className="text-xs font-bold text-white block">
              Multi-Factor Authentication (MFA)
            </span>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-purple-200">
                <Fingerprint className="w-4 h-4 text-purple-400" />
                <span>Biometric Touch ID</span>
              </div>
              <input
                type="checkbox"
                checked={session.biometricsEnabled}
                onChange={handleToggleBiometrics}
                className="accent-purple-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-purple-200">
                <ScanFace className="w-4 h-4 text-purple-400" />
                <span>Face ID Recognition</span>
              </div>
              <input
                type="checkbox"
                checked={session.faceIdEnabled}
                onChange={handleToggleFaceId}
                className="accent-purple-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Reset Entire Activation Flow */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-3.5">
            <span className="text-xs font-bold text-rose-300 block mb-1">
              Reset Activation Flow
            </span>
            <p className="text-[11px] text-purple-300/70 mb-3">
              Clear saved credentials and restart the full Keycloak activation code → password verification → force PIN setup workflow.
            </p>
            <button
              type="button"
              onClick={() => {
                MockKeycloakService.resetActivation();
                SyncService.resetToDefaults();
                onResetActivation();
                onClose();
              }}
              className="w-full bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset & Test Activation Onboarding</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
