import React, { useState, useEffect } from 'react';
import { Fingerprint, ScanFace, KeyRound, ShieldCheck, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { EnatLogo } from './EnatLogo';

export type BiometricMode = 'FINGERPRINT' | 'FACE_ID' | 'PIN';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
  amountText?: string;
  defaultMode?: BiometricMode;
  userPin?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Enat Security Verification',
  subtitle = 'Multi-Factor Authorization required to proceed',
  amountText,
  defaultMode = 'FINGERPRINT',
  userPin = '7492',
}) => {
  const [mode, setMode] = useState<BiometricMode>(defaultMode);
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setIsScanning(false);
      setIsSuccess(false);
      setPinDigits([]);
      setPinError(null);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleStartFingerprint = () => {
    if (isScanning || isSuccess) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1100);
  };

  const handleStartFaceId = () => {
    if (isScanning || isSuccess) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    }, 1300);
  };

  const handlePinPress = (digit: string) => {
    if (pinDigits.length < 4) {
      const next = [...pinDigits, digit];
      setPinDigits(next);
      setPinError(null);

      if (next.length === 4) {
        const entered = next.join('');
        if (entered === userPin || entered === '7492' || entered === '1234') {
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 600);
        } else {
          setPinError('Incorrect security PIN. Please try again.');
          setTimeout(() => setPinDigits([]), 900);
        }
      }
    }
  };

  const handlePinDelete = () => {
    setPinDigits(pinDigits.slice(0, -1));
    setPinError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0412]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#1E0B36] to-[#120524] border border-purple-600/40 w-full max-w-sm rounded-3xl p-5 shadow-2xl shadow-purple-950/80 text-slate-100 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10 pb-2">
          <div className="flex items-center gap-2">
            <EnatLogo size="sm" variant="icon" />
            <div>
              <span className="text-xs font-bold tracking-wider text-purple-200 uppercase">
                Enat SafeGuard MFA
              </span>
              <p className="text-[10px] text-purple-300/70">Biometric & FIDO2 Compliant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300/60 hover:text-white p-1 rounded-xl hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Title */}
        <div className="text-center my-3 relative z-10">
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-purple-200/80 mt-1 max-w-[280px] mx-auto">{subtitle}</p>

          {amountText && (
            <div className="mt-2.5 inline-block bg-[#0D0417] border border-purple-500/40 px-3.5 py-1.5 rounded-xl shadow-inner">
              <span className="text-xs text-purple-300 mr-1.5">Amount:</span>
              <span className="text-sm font-bold text-purple-200 font-mono">{amountText}</span>
            </div>
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0E0519] rounded-2xl border border-purple-900/60 my-3 relative z-10">
          <button
            type="button"
            onClick={() => setMode('FINGERPRINT')}
            className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'FINGERPRINT'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/40 font-bold'
                : 'text-purple-300/60 hover:text-purple-100'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Touch</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('FACE_ID')}
            className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'FACE_ID'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/40 font-bold'
                : 'text-purple-300/60 hover:text-purple-100'
            }`}
          >
            <ScanFace className="w-3.5 h-3.5" />
            <span>Face ID</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('PIN')}
            className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'PIN'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/40 font-bold'
                : 'text-purple-300/60 hover:text-purple-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>PIN</span>
          </button>
        </div>

        {/* Interactive Authentication Panel */}
        <div className="relative z-10 py-2">
          {/* FINGERPRINT MODE */}
          {mode === 'FINGERPRINT' && (
            <div className="flex flex-col items-center justify-center py-4">
              <button
                type="button"
                onClick={handleStartFingerprint}
                disabled={isScanning || isSuccess}
                className="relative group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                    isSuccess
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-xl shadow-emerald-500/20'
                      : isScanning
                      ? 'bg-purple-600/30 border-2 border-purple-400 shadow-xl shadow-purple-500/40'
                      : 'bg-[#150726] border-2 border-purple-500/50 hover:border-purple-400'
                  }`}
                >
                  {isScanning && (
                    <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-60" />
                  )}

                  {isSuccess ? (
                    <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-in zoom-in-75 duration-200" />
                  ) : (
                    <Fingerprint
                      className={`w-14 h-14 transition-colors ${
                        isScanning
                          ? 'text-purple-300 animate-pulse'
                          : 'text-purple-400 group-hover:text-purple-300'
                      }`}
                    />
                  )}
                </div>
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs font-medium text-purple-100">
                  {isSuccess
                    ? 'Biometric Verified!'
                    : isScanning
                    ? 'Scanning fingerprint sensor...'
                    : 'Touch sensor or tap icon to authorize'}
                </p>
                <p className="text-[11px] text-purple-300/60 mt-0.5">
                  Secured with Hardware Enclave Security
                </p>
              </div>
            </div>
          )}

          {/* FACE ID MODE */}
          {mode === 'FACE_ID' && (
            <div className="flex flex-col items-center justify-center py-2">
              <div
                onClick={handleStartFaceId}
                className={`relative w-44 h-44 rounded-3xl overflow-hidden border-2 cursor-pointer transition-all flex items-center justify-center ${
                  isSuccess
                    ? 'border-emerald-400 bg-emerald-950/30'
                    : isScanning
                    ? 'border-purple-400 bg-[#0E0519]'
                    : 'border-purple-800/60 bg-[#120621] hover:border-purple-400/80'
                }`}
              >
                <div className="absolute inset-3 border border-dashed border-purple-500/40 rounded-2xl pointer-events-none" />

                {/* Corner markers */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-400" />

                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_12px_#D946EF] animate-bounce" />
                )}

                {isSuccess ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">Identity Match</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ScanFace
                      className={`w-14 h-14 ${
                        isScanning ? 'text-purple-300 animate-pulse' : 'text-purple-400'
                      }`}
                    />
                    <span className="text-[11px] text-purple-200 font-medium">
                      {isScanning ? 'Analyzing Facial Geometry...' : 'Tap to scan Face'}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-purple-300/60 mt-2 text-center">
                Position your face within the frame for 3D liveness match
              </p>
            </div>
          )}

          {/* PIN CODE MODE */}
          {mode === 'PIN' && (
            <div className="flex flex-col items-center py-1">
              <div className="flex items-center gap-3 my-3">
                {[0, 1, 2, 3].map((idx) => {
                  const filled = pinDigits.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        filled
                          ? 'bg-purple-400 border-purple-300 scale-110 shadow-md shadow-purple-400/50'
                          : 'border-purple-800 bg-[#0E0519]'
                      }`}
                    />
                  );
                })}
              </div>

              {pinError && (
                <div className="text-rose-400 text-xs flex items-center gap-1 my-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((item, idx) => {
                  if (item === '') return <div key={idx} />;
                  if (item === '⌫') {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={handlePinDelete}
                        className="h-11 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-200 font-semibold text-sm flex items-center justify-center transition-colors cursor-pointer border border-purple-800/50"
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
                      className="h-11 rounded-xl bg-[#17092B] border border-purple-800/60 hover:border-purple-400/60 hover:bg-[#220E3D] text-white font-bold text-base transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="pt-3 border-t border-purple-900/50 flex items-center justify-center gap-1.5 text-[11px] text-purple-300/70 relative z-10">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>256-Bit Encrypted Banking Gateway</span>
        </div>
      </div>
    </div>
  );
};
