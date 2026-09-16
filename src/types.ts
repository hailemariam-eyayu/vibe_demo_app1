export type AuthScreen =
  | 'QUICK_LOGIN'
  | 'ACTIVATION'
  | 'PASSWORD_VERIFY'
  | 'FORCE_PIN_CHANGE'
  | 'BIOMETRIC_ENROLL'
  | 'DASHBOARD';

export type TransactionStatus =
  | 'OPTIMISTIC_PENDING'
  | 'SETTLED_SUCCESS'
  | 'OFFLINE_QUEUED'
  | 'FAILED';

export interface BankAccount {
  accountNumber: string;
  accountType: 'Enat Women Special Savings' | 'Standard Savings' | 'Current Account' | 'Diaspora Foreign Currency';
  balance: number;
  currency: 'ETB' | 'USD';
  holderName: string;
  branchName: string;
  isPrimary: boolean;
}

export interface BankTransaction {
  id: string;
  referenceNo: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: 'TRANSFER' | 'MINI_APP' | 'DONATION' | 'BILL_PAY' | 'AIRTIME' | 'SALARY';
  recipientBank?: string;
  recipientAccount?: string;
  recipientName?: string;
  timestamp: string;
  status: TransactionStatus;
  hostConfirmationTime?: string;
  notes?: string;
  miniAppId?: string;
}

export interface BankItem {
  id: string;
  name: string;
  shortName: string;
  code: string;
  color: string;
  logoLetter: string;
  isPopular?: boolean;
}

export interface DonationItem {
  id: string;
  name: string;
  category: string;
  accountNumber: string;
  description: string;
  verified: boolean;
  imageIcon: string;
  suggestedAmounts: number[];
}

export interface MiniAppItem {
  id: string;
  name: string;
  category: 'Mobility' | 'Telecom' | 'Travel' | 'Government' | 'Lifestyle' | 'Utilities';
  description: string;
  iconName: string;
  themeColor: string;
  provider: string;
  badge?: string;
  version: string;
}

export interface SyncMetadata {
  cachedVersion: string;
  serverVersion: string;
  lastSyncedAt: string;
  isOnline: boolean;
  isSyncing: boolean;
  pendingQueueCount: number;
  syncLog: string[];
}

export interface UserAuthSession {
  userId: string;
  phoneNumber: string;
  fullName: string;
  email: string;
  isActivated: boolean;
  hasChangedPin: boolean;
  pinCode: string;
  biometricsEnabled: boolean;
  faceIdEnabled: boolean;
  token?: string;
  tokenExpiresAt?: string;
}
