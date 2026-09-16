import React, { useState } from 'react';
import { Smartphone, Monitor, Shield, Wifi, Battery, Signal } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#0A0412] text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none relative overflow-x-hidden">
      {/* Ambient Enat Purple Glow in background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      {/* Top Floating Control Toolbar (Desktop / Tablet) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-2 text-xs text-purple-200/70 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          <span className="font-semibold text-purple-100">Enat Mobile Banking • እናት ባንክ</span>
        </div>

        <div className="flex items-center gap-1 bg-[#180A26] border border-purple-800/40 p-1 rounded-xl shadow-md">
          <button
            type="button"
            onClick={() => setIsDeviceFrame(true)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
              isDeviceFrame ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile APK</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeviceFrame(false)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
              !isDeviceFrame ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Responsive</span>
          </button>
        </div>
      </div>

      {/* Main Device Shell */}
      <div
        className={`w-full transition-all duration-300 relative z-10 ${
          isDeviceFrame
            ? 'max-w-[420px] h-[890px] max-h-[96vh] rounded-[48px] border-[10px] border-[#1C0D2E] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_30px_rgba(147,51,234,0.2)] overflow-hidden flex flex-col bg-[#0F0619] ring-1 ring-purple-700/40'
            : 'max-w-xl min-h-screen sm:min-h-[850px] sm:rounded-3xl border border-purple-800/40 shadow-2xl bg-[#0F0619] flex flex-col'
        }`}
      >
        {/* Dynamic Island / Hardware Status Bar on Device Frame */}
        <div className="h-10 bg-[#0C0414] px-6 flex items-center justify-between text-xs text-purple-200/70 shrink-0 z-30 select-none border-b border-purple-900/30">
          <span className="font-semibold text-white tracking-tight">{currentTime}</span>

          {/* Dynamic Island Notch */}
          {isDeviceFrame && (
            <div className="w-24 h-4 bg-[#180A26] rounded-full flex items-center justify-center gap-1.5 border border-purple-800/40">
              <div className="w-2 h-2 rounded-full bg-[#0C0414] border border-purple-900/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-purple-200">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        {/* Inner Scrollable Screen */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0F0619] scrollbar-none">
          {children}
        </div>

        {/* Android / iOS Home Indicator Bar */}
        {isDeviceFrame && (
          <div className="h-6 bg-[#0C0414] flex items-center justify-center shrink-0 z-30">
            <div className="w-32 h-1 bg-purple-400/40 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
