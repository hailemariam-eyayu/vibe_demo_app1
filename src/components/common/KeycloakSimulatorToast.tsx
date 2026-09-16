import React, { useEffect, useState } from 'react';
import { ShieldCheck, MessageSquare, KeyRound, Copy, Check, X } from 'lucide-react';
import { MockKeycloakService, KeycloakNotification } from '../../services/mockKeycloak';

interface KeycloakSimulatorToastProps {
  onAutoFill?: (code: string) => void;
}

export const KeycloakSimulatorToast: React.FC<KeycloakSimulatorToastProps> = ({ onAutoFill }) => {
  const [notification, setNotification] = useState<KeycloakNotification | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = MockKeycloakService.subscribeNotifications((notif) => {
      setNotification(notif);
      setCopied(false);
      // Auto-hide after 12 seconds unless dismissed
      const timer = setTimeout(() => {
        setNotification((curr) => (curr?.id === notif.id ? null : curr));
      }, 12000);
      return () => clearTimeout(timer);
    });
    return unsub;
  }, []);

  if (!notification) return null;

  const handleCopy = () => {
    if (notification.code) {
      navigator.clipboard?.writeText(notification.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFill = () => {
    if (notification.code && onAutoFill) {
      onAutoFill(notification.code);
      setNotification(null);
    }
  };

  const isOtp = notification.type === 'ACTIVATION_OTP';

  return (
    <div className="fixed top-3 inset-x-3 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-[#19092B]/95 border-2 border-purple-500/80 rounded-2xl p-3.5 shadow-2xl shadow-purple-950/60 backdrop-blur-md text-white">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 shrink-0">
              {isOtp ? <MessageSquare className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-200 tracking-wide uppercase">
                  {notification.title}
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-800/60 font-mono">
                  Enat Keycloak
                </span>
              </div>
              <p className="text-[11px] text-purple-300/70 mt-0.5">{notification.timestamp}</p>
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-purple-300/60 hover:text-white p-1 rounded-lg hover:bg-purple-900/40 cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-purple-100 mt-2.5 leading-relaxed font-sans">
          {notification.message}
        </p>

        {notification.code && (
          <div className="mt-3 flex items-center justify-between gap-2 bg-[#0E0518] border border-purple-800/60 rounded-xl p-2 px-3">
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-purple-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{notification.code}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-medium bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              {onAutoFill && (
                <button
                  type="button"
                  onClick={handleFill}
                  className="text-[11px] font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-3 py-1 rounded-lg transition-all shadow-sm cursor-pointer shadow-purple-900/30"
                >
                  Auto-fill
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
