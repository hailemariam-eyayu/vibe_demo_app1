import React, { useState } from 'react';
import { Fingerprint, ScanFace, KeyRound, ArrowRight, UserCheck, ShieldCheck, RefreshCw } from 'lucide-react';
import { EnatLogo } from '../common/EnatLogo';
import { BiometricModal } from '../common/BiometricModal';
import { MockKeycloakService } from '../../services/mockKeycloak';

interface QuickLoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToActivation: () => void;
}

export const QuickLoginScreen: React.FC<QuickLoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToActivation,
}) => {
  const session = MockKeycloakService.getSavedSession();
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [biometricModalOpen, setBiometricModalOpen] = useState(false);
  const [biometricInitialMode, setBiometricInitialMode] = useState<'FINGERPRINT' | 'FACE_ID'>('FINGERPRINT');

  const handlePinPress = (digit: string) => {
    if (pinDigits.length < 4) {
      const next = [...pinDigits, digit];
      setPinDigits(next);
      setError(null);

      if (next.length === 4) {
        const entered = next.join('');
        if (entered === session.pinCode || entered === '7492' || entered === '1234') {
          onLoginSuccess();
        } else {
          setError('Incorrect PIN. Try default demo PIN 7492 or use Biometrics.');
          setTimeout(() => setPinDigits([]), 1000);
        }
      }
    }
  };

  const handleOpenBiometric = (mode: 'FINGERPRINT' | 'FACE_ID') => {
    setBiometricInitialMode(mode);
    setBiometricModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 text-slate-100 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-700/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <EnatLogo size="md" showTagline={true} />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/60 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            <span>FIDO2 Active</span>
          </span>
        </div>

        {/* User Card */}
        <div className="bg-gradient-to-r from-[#200D39] via-[#2A104A] to-[#200D39] border border-purple-600/40 rounded-3xl p-4 my-3 shadow-lg shadow-purple-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-200 font-bold text-lg">
              {session.fullName.charAt(0)}
            </div>
            <div>
              <p className="text-[11px] text-purple-300 font-medium">Welcome back</p>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug">
                {session.fullName}
              </h2>
              <p className="text-[11px] text-purple-300/70 font-mono">{session.phoneNumber}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Biometric Quick Trigger Buttons */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <button
            type="button"
            onClick={() => handleOpenBiometric('FACE_ID')}
            className="p-3.5 bg-[#160A29] hover:bg-[#200D3B] border border-purple-800/60 hover:border-purple-500/60 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/25 group-hover:bg-purple-600/40 flex items-center justify-center text-purple-300 transition-colors">
              <ScanFace className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Face Login</span>
            <span className="text-[10px] text-purple-300/60">3D Facial Match</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenBiometric('FINGERPRINT')}
            className="p-3.5 bg-[#160A29] hover:bg-[#200D3B] border border-purple-800/60 hover:border-purple-500/60 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/25 group-hover:bg-purple-600/40 flex items-center justify-center text-purple-300 transition-colors">
              <Fingerprint className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Fingerprint</span>
            <span className="text-[10px] text-purple-300/60">Biometric Sensor</span>
          </button>
        </div>

        {/* PIN Entry Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-purple-900/50" />
          <span className="text-[11px] font-medium text-purple-300/70">Or Enter 4-Digit PIN</span>
          <div className="flex-1 h-px bg-purple-900/50" />
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-3 my-3">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pinDigits.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all ${
                  filled
                    ? 'bg-purple-400 border-purple-300 scale-110 shadow-md shadow-purple-400/50'
                    : 'border-purple-800/80 bg-[#0E0518]'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-rose-400 text-xs text-center my-1 font-medium">{error}</p>
        )}
      </div>

      {/* Keypad */}
      <div>
        <div className="grid grid-cols-3 gap-2 w-full max-w-[270px] mx-auto my-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((item, idx) => {
            if (item === '') return <div key={idx} />;
            if (item === '⌫') {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPinDigits(pinDigits.slice(0, -1))}
                  className="h-11 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 text-purple-200 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                >
                  Delete
                </button>
              );
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePinPress(item)}
                className="h-11 rounded-xl bg-[#160A29] border border-purple-800/60 hover:border-purple-400/60 hover:bg-[#200E3A] text-white font-bold text-base transition-colors cursor-pointer"
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Activation Link */}
        <div className="pt-3 border-t border-purple-900/40 text-center">
          <button
            type="button"
            onClick={onNavigateToActivation}
            className="text-xs font-medium text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            Activate New Account / Re-enter Keycloak Code →
          </button>
        </div>
      </div>

      {/* Biometric Verification Modal */}
      <BiometricModal
        isOpen={biometricModalOpen}
        onClose={() => setBiometricModalOpen(false)}
        onSuccess={() => {
          setBiometricModalOpen(false);
          onLoginSuccess();
        }}
        title={`Authenticate as ${session.fullName}`}
        subtitle="Confirm biometric identity to access your Enat accounts"
        defaultMode={biometricInitialMode}
        userPin={session.pinCode}
      />
    </div>
  );
};
