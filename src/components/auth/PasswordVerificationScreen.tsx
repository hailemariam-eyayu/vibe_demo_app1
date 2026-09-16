import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Key } from 'lucide-react';
import { EnatLogo } from '../common/EnatLogo';
import { MockKeycloakService } from '../../services/mockKeycloak';

interface PasswordVerificationScreenProps {
  initialTempPassword?: string;
  onPasswordSuccess: () => void;
  onBackToActivation: () => void;
}

export const PasswordVerificationScreen: React.FC<PasswordVerificationScreenProps> = ({
  initialTempPassword = '',
  onPasswordSuccess,
  onBackToActivation,
}) => {
  const [password, setPassword] = useState(initialTempPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the temporary password sent by Keycloak.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const res = MockKeycloakService.verifyTemporaryPassword(password);
      setIsLoading(false);
      if (res.success) {
        onPasswordSuccess();
      } else {
        setError(res.message);
      }
    }, 700);
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 text-slate-100 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <EnatLogo size="md" />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Code Verified</span>
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Verify Password
          </h1>
          <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
            Keycloak has verified your activation and generated a temporary security password. Enter the password received via SMS/Push to proceed.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerifyPassword} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
                Temporary Keycloak Password
              </label>
              {initialTempPassword && (
                <button
                  type="button"
                  onClick={() => setPassword(initialTempPassword)}
                  className="text-[11px] font-medium text-purple-300 hover:text-white cursor-pointer"
                >
                  Use Dispatched Password
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#160A29] border border-purple-800/60 rounded-2xl pl-10 pr-12 py-3 text-sm text-white font-mono focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enat@PassXXXX"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Compliance Info */}
          <div className="bg-[#140826] border border-purple-900/60 rounded-2xl p-3.5 text-xs text-purple-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-100 font-semibold">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Next Mandatory Step</span>
            </div>
            <p className="text-[11px] leading-relaxed text-purple-300/70">
              Upon successful password verification, you will be redirected to the <span className="text-purple-200 font-medium">Force PIN Change Page</span> to configure your permanent 4-digit banking transaction PIN.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating Password...</span>
              </>
            ) : (
              <>
                <span>Verify & Proceed to PIN Setup</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="pt-6 text-center border-t border-purple-900/40">
        <button
          type="button"
          onClick={onBackToActivation}
          className="text-xs font-medium text-purple-300/70 hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Activation Code
        </button>
      </div>
    </div>
  );
};
