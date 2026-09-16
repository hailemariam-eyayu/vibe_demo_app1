import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { EnatLogo } from '../common/EnatLogo';
import { MockKeycloakService } from '../../services/mockKeycloak';

interface ForcePinChangeScreenProps {
  onPinChangeComplete: () => void;
}

export const ForcePinChangeScreen: React.FC<ForcePinChangeScreenProps> = ({
  onPinChangeComplete,
}) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [activeField, setActiveField] = useState<'NEW' | 'CONFIRM'>('NEW');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyPress = (digit: string) => {
    setError(null);
    if (activeField === 'NEW') {
      if (newPin.length < 4) {
        const val = newPin + digit;
        setNewPin(val);
        if (val.length === 4) {
          setActiveField('CONFIRM');
        }
      }
    } else {
      if (confirmPin.length < 4) {
        setConfirmPin(confirmPin + digit);
      }
    }
  };

  const handleDelete = () => {
    setError(null);
    if (activeField === 'CONFIRM') {
      if (confirmPin.length > 0) {
        setConfirmPin(confirmPin.slice(0, -1));
      } else {
        setActiveField('NEW');
      }
    } else {
      setNewPin(newPin.slice(0, -1));
    }
  };

  const handleClear = () => {
    setNewPin('');
    setConfirmPin('');
    setActiveField('NEW');
    setError(null);
  };

  const handleSavePin = () => {
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      setError('Please enter and confirm all 4 digits of your security PIN.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('The confirmation PIN does not match the first PIN. Please re-enter.');
      setConfirmPin('');
      setActiveField('CONFIRM');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = MockKeycloakService.saveNewPin(newPin);
      setIsLoading(false);
      if (res.success) {
        onPinChangeComplete();
      } else {
        setError(res.message);
      }
    }, 600);
  };

  const isPredictable = ['1234', '0000', '1111', '2222', '4321', '9876'].includes(newPin);

  return (
    <div className="flex flex-col min-h-full justify-between p-6 text-slate-100 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <EnatLogo size="md" />
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/60 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-400" />
            <span>Mandatory Setup</span>
          </span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Set Transaction PIN
          </h1>
          <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
            Per national banking security directives, create a new 4-digit PIN for ATM withdrawals, money transfers, and mini-app payments.
          </p>
        </div>

        {/* PIN Inputs Visual */}
        <div className="space-y-4 my-2">
          {/* Step 1: New PIN */}
          <div
            onClick={() => setActiveField('NEW')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeField === 'NEW'
                ? 'bg-[#180A29] border-purple-500 ring-1 ring-purple-400/40 shadow-md shadow-purple-950/40'
                : 'bg-[#120521]/60 border-purple-900/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-purple-200">1. Enter New 4-Digit PIN</span>
              {newPin.length === 4 && !isPredictable && (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Valid
                </span>
              )}
            </div>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => {
                const filled = newPin.length > idx;
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
          </div>

          {/* Step 2: Confirm PIN */}
          <div
            onClick={() => {
              if (newPin.length === 4) setActiveField('CONFIRM');
            }}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeField === 'CONFIRM'
                ? 'bg-[#180A29] border-purple-500 ring-1 ring-purple-400/40 shadow-md shadow-purple-950/40'
                : 'bg-[#120521]/60 border-purple-900/50'
            } ${newPin.length < 4 ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-purple-200">2. Re-enter to Confirm PIN</span>
              {confirmPin.length === 4 && confirmPin === newPin && (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Matched
                </span>
              )}
            </div>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => {
                const filled = confirmPin.length > idx;
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
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2 my-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Security Rule Warning */}
        {isPredictable && (
          <div className="bg-purple-950/40 border border-purple-500/50 text-purple-200 p-2 rounded-xl text-[11px] flex items-center gap-2 my-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Avoid simple sequential (1234) or repeating (1111) PINs.</span>
          </div>
        )}
      </div>

      {/* Numeric Keypad & Submit */}
      <div className="mt-2">
        <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] mx-auto mb-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item, idx) => {
            if (item === 'C') {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={handleClear}
                  className="h-11 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                >
                  Clear
                </button>
              );
            }
            if (item === '⌫') {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={handleDelete}
                  className="h-11 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                >
                  Delete
                </button>
              );
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleKeyPress(item)}
                className="h-11 rounded-xl bg-[#160A29] border border-purple-800/60 hover:border-purple-400/60 hover:bg-[#200E3A] text-white font-bold text-base transition-colors cursor-pointer"
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSavePin}
          disabled={isLoading || newPin.length !== 4 || confirmPin.length !== 4}
          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
        >
          {isLoading ? (
            <span>Securing PIN...</span>
          ) : (
            <>
              <span>Complete Setup & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
