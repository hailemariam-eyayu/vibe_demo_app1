import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, Phone, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { EnatLogo } from '../common/EnatLogo';
import { MockKeycloakService } from '../../services/mockKeycloak';

interface ActivationScreenProps {
  onActivationSuccess: (tempPassword?: string) => void;
  onSwitchToLogin: () => void;
  externalCode?: string | null;
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({
  onActivationSuccess,
  onSwitchToLogin,
  externalCode,
}) => {
  const [phoneOrAccount, setPhoneOrAccount] = useState('+251 91 148 9204');
  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeRequested, setCodeRequested] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (externalCode) {
      setActivationCode(externalCode);
    }
  }, [externalCode]);

  useEffect(() => {
    // Automatically trigger initial Keycloak SMS dispatch for seamless demo experience
    handleRequestCode();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRequestCode = () => {
    setError(null);
    setCodeRequested(true);
    setResendTimer(60);
    MockKeycloakService.requestActivationCode(phoneOrAccount);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode || activationCode.length < 4) {
      setError('Please enter the 6-digit activation code sent via Keycloak SMS.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const res = MockKeycloakService.verifyActivationCode(activationCode);
      setIsLoading(false);
      if (res.success) {
        onActivationSuccess(res.tempPassword);
      } else {
        setError(res.message);
      }
    }, 750);
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 text-slate-100 relative">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-fuchsia-700/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar / Branding */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <EnatLogo size="md" showTagline={true} />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/60">
            Activation v3.2
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Activate Account
          </h1>
          <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
            Enter the activation code dispatched by the Keycloak identity gateway to initialize your mobile banking credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          {/* Phone / Account input */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
              Registered Phone / Account No.
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={phoneOrAccount}
                onChange={(e) => setPhoneOrAccount(e.target.value)}
                className="w-full bg-[#160A29] border border-purple-800/60 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400 font-mono transition-colors"
                placeholder="+251 9X XXX XXXX"
                required
              />
            </div>
          </div>

          {/* Activation Code input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
                Keycloak Activation Code
              </label>
              {codeRequested && (
                <button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={resendTimer > 0}
                  className="text-[11px] font-medium text-purple-300 hover:text-purple-100 disabled:opacity-50 flex items-center gap-1 transition-opacity cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                  <span>{resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend SMS'}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="text"
                maxLength={6}
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#160A29] border border-purple-800/60 rounded-2xl pl-10 pr-24 py-3 text-base text-white tracking-[0.3em] font-mono focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="849201"
              />
              <button
                type="button"
                onClick={() => setActivationCode('849201')}
                className="absolute inset-y-1.5 right-1.5 px-3 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-purple-700/50"
                title="Fill default demo code"
              >
                <span>Demo (849201)</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Keycloak integration status note */}
          <div className="bg-[#140826] border border-purple-900/60 rounded-2xl p-3 text-purple-200/80 text-xs flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Keycloak IAM will verify this activation code. Once validated, a temporary password will be dispatched to authorize your device.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !activationCode}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying with Keycloak...</span>
              </>
            ) : (
              <>
                <span>Confirm Activation Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer link to switch to quick login if already set up */}
      <div className="pt-6 text-center border-t border-purple-900/40">
        <p className="text-xs text-purple-300/70 mb-2">Already have an active account & PIN?</p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
        >
          Sign In with Face ID / Biometrics
        </button>
      </div>
    </div>
  );
};
