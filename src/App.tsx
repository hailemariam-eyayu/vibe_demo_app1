/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthScreen, BankAccount, BankTransaction, UserAuthSession } from './types';
import { MockKeycloakService } from './services/mockKeycloak';
import { SyncService } from './services/syncService';
import { MobileShell } from './components/common/MobileShell';
import { KeycloakSimulatorToast } from './components/common/KeycloakSimulatorToast';
import { ActivationScreen } from './components/auth/ActivationScreen';
import { PasswordVerificationScreen } from './components/auth/PasswordVerificationScreen';
import { ForcePinChangeScreen } from './components/auth/ForcePinChangeScreen';
import { QuickLoginScreen } from './components/auth/QuickLoginScreen';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { BalanceCard } from './components/dashboard/BalanceCard';
import { RecentTransactions } from './components/dashboard/RecentTransactions';
import { MiniAppHub } from './components/dashboard/MiniAppHub';
import { BankTransferModal } from './components/dashboard/BankTransferModal';
import { DonationModal } from './components/dashboard/DonationModal';
import { SettingsModal } from './components/dashboard/SettingsModal';
import { QrModal } from './components/dashboard/QrModal';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserAuthSession>(MockKeycloakService.getSavedSession());
  const [screen, setScreen] = useState<AuthScreen>(() => {
    const s = MockKeycloakService.getSavedSession();
    // Default to ACTIVATION to showcase user's requested onboarding flow first,
    // or quick login if already configured
    return s.isActivated && s.hasChangedPin ? 'QUICK_LOGIN' : 'ACTIVATION';
  });

  const [tempPasswordDispatched, setTempPasswordDispatched] = useState<string>('');
  const [account, setAccount] = useState<BankAccount>(SyncService.getAccount());
  const [transactions, setTransactions] = useState<BankTransaction[]>(SyncService.getTransactions());

  // Modals
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [toastFillCode, setToastFillCode] = useState<string | null>(null);
  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);

  // Sync initial catalogs & version check on mount
  useEffect(() => {
    SyncService.checkVersionAndSync(false);

    const unsubData = SyncService.subscribeData(() => {
      setAccount({ ...SyncService.getAccount() });
      setTransactions([...SyncService.getTransactions()]);
    });

    return () => {
      unsubData();
    };
  }, []);

  // Handlers for Onboarding Flow
  const handleActivationSuccess = (tempPass?: string) => {
    if (tempPass) setTempPasswordDispatched(tempPass);
    setScreen('PASSWORD_VERIFY');
  };

  const handlePasswordSuccess = () => {
    setScreen('FORCE_PIN_CHANGE');
  };

  const handlePinChangeComplete = () => {
    const updated = MockKeycloakService.getSavedSession();
    setSession(updated);
    setWelcomeBanner('🎉 Activation Complete! Welcome to Enat Mobile Banking.');
    setTimeout(() => setWelcomeBanner(null), 5000);
    setScreen('DASHBOARD');
  };

  const handleLogout = () => {
    setScreen('QUICK_LOGIN');
  };

  const handleResetActivation = () => {
    const resetSession = MockKeycloakService.getSavedSession();
    setSession(resetSession);
    setScreen('ACTIVATION');
  };

  const handleTransactionSuccess = (tx: BankTransaction) => {
    // Refresh ledger & account
    setAccount({ ...SyncService.getAccount() });
    setTransactions([...SyncService.getTransactions()]);
  };

  return (
    <MobileShell>
      {/* Real-time Keycloak Notification SMS simulator banner */}
      <KeycloakSimulatorToast onAutoFill={(code) => setToastFillCode(code)} />

      {/* Screen Router */}
      {screen === 'ACTIVATION' && (
        <ActivationScreen
          onActivationSuccess={handleActivationSuccess}
          onSwitchToLogin={() => setScreen('QUICK_LOGIN')}
          externalCode={toastFillCode}
        />
      )}

      {screen === 'PASSWORD_VERIFY' && (
        <PasswordVerificationScreen
          initialTempPassword={tempPasswordDispatched}
          onPasswordSuccess={handlePasswordSuccess}
          onBackToActivation={() => setScreen('ACTIVATION')}
        />
      )}

      {screen === 'FORCE_PIN_CHANGE' && (
        <ForcePinChangeScreen onPinChangeComplete={handlePinChangeComplete} />
      )}

      {screen === 'QUICK_LOGIN' && (
        <QuickLoginScreen
          onLoginSuccess={() => setScreen('DASHBOARD')}
          onNavigateToActivation={() => setScreen('ACTIVATION')}
        />
      )}

      {screen === 'DASHBOARD' && (
        <div className="p-4 space-y-4 text-slate-100 min-h-full pb-10">
          {/* Welcome Alert Banner upon activation */}
          {welcomeBanner && (
            <div className="bg-gradient-to-r from-purple-600/25 via-fuchsia-600/20 to-purple-600/25 border border-purple-500/50 rounded-2xl p-3 text-xs text-purple-200 flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300">
              <Sparkles className="w-4 h-4 text-purple-300 shrink-0" />
              <span>{welcomeBanner}</span>
            </div>
          )}

          {/* Header */}
          <DashboardHeader
            session={session}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onLogout={handleLogout}
          />

          {/* Balance Card & Primary Actions */}
          <BalanceCard
            account={account}
            onOpenTransfer={() => setIsTransferOpen(true)}
            onOpenDonations={() => setIsDonationOpen(true)}
            onOpenMiniApps={() => {
              const el = document.getElementById('mini-app-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenQr={() => setIsQrOpen(true)}
          />

          {/* Mini App Integration Ecosystem */}
          <div id="mini-app-section">
            <MiniAppHub account={account} onTransactionSuccess={handleTransactionSuccess} />
          </div>

          {/* Real-time Ledger & Optimistic Transactions */}
          <RecentTransactions transactions={transactions} />

          {/* Interbank & Enat Transfer Modal */}
          <BankTransferModal
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
            account={account}
            onTransactionSuccess={handleTransactionSuccess}
          />

          {/* Donation Modal */}
          <DonationModal
            isOpen={isDonationOpen}
            onClose={() => setIsDonationOpen(false)}
            account={account}
            onDonationSuccess={handleTransactionSuccess}
          />

          {/* QR Pay Modal */}
          <QrModal
            isOpen={isQrOpen}
            onClose={() => setIsQrOpen(false)}
            account={account}
          />

          {/* Settings & Cache Inspector Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            session={session}
            onSessionUpdated={setSession}
            onResetActivation={handleResetActivation}
          />
        </div>
      )}
    </MobileShell>
  );
}
