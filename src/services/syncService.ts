import {
  BankAccount,
  BankItem,
  BankTransaction,
  DonationItem,
  MiniAppItem,
  SyncMetadata,
} from '../types';
import {
  CURRENT_SERVER_VERSION,
  INITIAL_ACCOUNT,
  INITIAL_BANKS,
  INITIAL_DONATIONS,
  INITIAL_MINI_APPS,
  INITIAL_TRANSACTIONS,
} from '../data/initialData';

const STORAGE_KEY_META = 'enat_sync_meta';
const STORAGE_KEY_ACCOUNT = 'enat_account_cache';
const STORAGE_KEY_TRANSACTIONS = 'enat_transactions_cache';
const STORAGE_KEY_BANKS = 'enat_banks_cache';
const STORAGE_KEY_DONATIONS = 'enat_donations_cache';
const STORAGE_KEY_MINIAPPS = 'enat_miniapps_cache';

type SyncListener = (meta: SyncMetadata) => void;
type DataListener = () => void;

export class SyncService {
  private static syncListeners: SyncListener[] = [];
  private static dataListeners: DataListener[] = [];

  public static subscribeSync(listener: SyncListener) {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== listener);
    };
  }

  public static subscribeData(listener: DataListener) {
    this.dataListeners.push(listener);
    return () => {
      this.dataListeners = this.dataListeners.filter((l) => l !== listener);
    };
  }

  private static emitSync(meta: SyncMetadata) {
    this.syncListeners.forEach((l) => l(meta));
  }

  private static emitData() {
    this.dataListeners.forEach((l) => l());
  }

  public static getSyncMetadata(): SyncMetadata {
    const raw = localStorage.getItem(STORAGE_KEY_META);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse sync meta', e);
      }
    }
    return {
      cachedVersion: CURRENT_SERVER_VERSION,
      serverVersion: CURRENT_SERVER_VERSION,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOnline: true,
      isSyncing: false,
      pendingQueueCount: 0,
      syncLog: ['Application initialized with local offline cache.'],
    };
  }

  public static saveSyncMetadata(meta: SyncMetadata) {
    localStorage.setItem(STORAGE_KEY_META, JSON.stringify(meta));
    this.emitSync(meta);
  }

  public static setOnlineStatus(isOnline: boolean) {
    const meta = this.getSyncMetadata();
    meta.isOnline = isOnline;
    meta.syncLog.unshift(isOnline ? 'Network restored: Online mode active.' : 'Switched to Offline Mode (Simulated).');
    this.saveSyncMetadata(meta);

    if (isOnline) {
      this.processOfflineQueue();
    }
  }

  /**
   * Version check on login / start:
   * Checks version from other service. If identical, skips download; else syncs updated data.
   */
  public static async checkVersionAndSync(forced = false): Promise<{ skipped: boolean; message: string }> {
    const meta = this.getSyncMetadata();
    meta.isSyncing = true;
    meta.syncLog.unshift('Checking catalog version with Core Banking service...');
    this.saveSyncMetadata(meta);

    // Simulate network handshake to check remote version
    await new Promise((r) => setTimeout(r, 650));

    const remoteVersion = CURRENT_SERVER_VERSION;
    const isSameVersion = meta.cachedVersion === remoteVersion && !forced && localStorage.getItem(STORAGE_KEY_BANKS);

    if (isSameVersion) {
      meta.isSyncing = false;
      meta.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msg = `⚡ Version matched (${remoteVersion}): Skipped network fetch. Using cached Banks, Donations, and Mini-Apps.`;
      meta.syncLog.unshift(msg);
      this.saveSyncMetadata(meta);
      return { skipped: true, message: msg };
    }

    // Version differs or forced: Sync from service
    meta.syncLog.unshift(`🔄 Syncing updated catalog data for ${remoteVersion}...`);
    this.saveSyncMetadata(meta);

    await new Promise((r) => setTimeout(r, 800));

    // Save remote catalogs to local cache
    localStorage.setItem(STORAGE_KEY_BANKS, JSON.stringify(INITIAL_BANKS));
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    localStorage.setItem(STORAGE_KEY_MINIAPPS, JSON.stringify(INITIAL_MINI_APPS));

    meta.cachedVersion = remoteVersion;
    meta.serverVersion = remoteVersion;
    meta.isSyncing = false;
    meta.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = `✓ Synced: Local cache refreshed with ${INITIAL_BANKS.length} Banks, ${INITIAL_DONATIONS.length} Charities, and ${INITIAL_MINI_APPS.length} Mini-Apps.`;
    meta.syncLog.unshift(msg);
    this.saveSyncMetadata(meta);
    this.emitData();

    return { skipped: false, message: msg };
  }

  // Account Data
  public static getAccount(): BankAccount {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNT);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse account cache', e);
      }
    }
    localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(INITIAL_ACCOUNT));
    return INITIAL_ACCOUNT;
  }

  public static saveAccount(account: BankAccount) {
    localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(account));
    this.emitData();
  }

  // Transactions
  public static getTransactions(): BankTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse transactions cache', e);
      }
    }
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }

  public static saveTransactions(txs: BankTransaction[]) {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(txs));
    this.emitData();
  }

  // Catalogs from Cache
  public static getBanks(): BankItem[] {
    const raw = localStorage.getItem(STORAGE_KEY_BANKS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEY_BANKS, JSON.stringify(INITIAL_BANKS));
    return INITIAL_BANKS;
  }

  public static getDonations(): DonationItem[] {
    const raw = localStorage.getItem(STORAGE_KEY_DONATIONS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    return INITIAL_DONATIONS;
  }

  public static getMiniApps(): MiniAppItem[] {
    const raw = localStorage.getItem(STORAGE_KEY_MINIAPPS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEY_MINIAPPS, JSON.stringify(INITIAL_MINI_APPS));
    return INITIAL_MINI_APPS;
  }

  /**
   * OPTIMISTIC TRANSACTION EXECUTION:
   * 1. Updates local balance instantly before contacting the server.
   * 2. Adds transaction to ledger marked as OPTIMISTIC_PENDING.
   * 3. Communicates with server asynchronously.
   * 4. Once server responds success, upgrades status to SETTLED_SUCCESS with official reference.
   */
  public static async executeOptimisticTransaction(
    params: {
      title: string;
      subtitle: string;
      amount: number;
      category: BankTransaction['category'];
      recipientBank?: string;
      recipientAccount?: string;
      recipientName?: string;
      notes?: string;
      miniAppId?: string;
    }
  ): Promise<{ success: boolean; transaction: BankTransaction; error?: string }> {
    const account = this.getAccount();
    if (account.balance < params.amount) {
      return {
        success: false,
        transaction: null as any,
        error: `Insufficient funds. Available balance: ETB ${account.balance.toLocaleString()}`,
      };
    }

    const txId = 'tx-' + Date.now();
    const tempRef = 'ENAT-OPT-' + Math.floor(100000 + Math.random() * 900000);

    // 1. OPTIMISTIC UPDATE: Decrement local balance immediately
    const previousBalance = account.balance;
    account.balance = Number((previousBalance - params.amount).toFixed(2));
    this.saveAccount(account);

    const optimisticTx: BankTransaction = {
      id: txId,
      referenceNo: tempRef,
      title: params.title,
      subtitle: params.subtitle,
      amount: params.amount,
      type: 'DEBIT',
      category: params.category,
      recipientBank: params.recipientBank,
      recipientAccount: params.recipientAccount,
      recipientName: params.recipientName,
      timestamp: 'Just now',
      status: 'OPTIMISTIC_PENDING',
      notes: params.notes,
      miniAppId: params.miniAppId,
    };

    const currentTxs = this.getTransactions();
    this.saveTransactions([optimisticTx, ...currentTxs]);

    // Update real-time sync status
    const meta = this.getSyncMetadata();
    meta.isSyncing = true;
    meta.syncLog.unshift(`⚡ [Optimistic] Balance updated locally (-ETB ${params.amount.toLocaleString()}). Awaiting host settlement...`);
    this.saveSyncMetadata(meta);

    // Check if user has toggled offline mode
    if (!meta.isOnline) {
      optimisticTx.status = 'OFFLINE_QUEUED';
      meta.pendingQueueCount += 1;
      meta.isSyncing = false;
      meta.syncLog.unshift(`⚠️ Offline: Transaction queued locally in secure vault. Will auto-settle when connection is restored.`);
      this.saveSyncMetadata(meta);
      this.updateTxStatus(txId, 'OFFLINE_QUEUED');
      return { success: true, transaction: optimisticTx };
    }

    // 2. Server-side handshake simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const hostRef = 'ENAT-FT-' + Math.floor(1000000 + Math.random() * 9000000);
        optimisticTx.status = 'SETTLED_SUCCESS';
        optimisticTx.referenceNo = hostRef;
        optimisticTx.hostConfirmationTime = new Date().toLocaleTimeString();

        // 3. Update server response in local storage to reflect the new state
        const updatedTxs = this.getTransactions().map((t) => (t.id === txId ? optimisticTx : t));
        this.saveTransactions(updatedTxs);

        const updatedMeta = this.getSyncMetadata();
        updatedMeta.isSyncing = false;
        updatedMeta.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        updatedMeta.syncLog.unshift(`✓ [Host Settled] Server approved Ref #${hostRef}. Final balance synced: ETB ${account.balance.toLocaleString()}`);
        this.saveSyncMetadata(updatedMeta);

        resolve({ success: true, transaction: optimisticTx });
      }, 1400);
    });
  }

  private static updateTxStatus(txId: string, status: BankTransaction['status']) {
    const txs = this.getTransactions().map((t) => (t.id === txId ? { ...t, status } : t));
    this.saveTransactions(txs);
  }

  private static async processOfflineQueue() {
    const txs = this.getTransactions();
    const offlineTxs = txs.filter((t) => t.status === 'OFFLINE_QUEUED');
    if (offlineTxs.length === 0) return;

    const meta = this.getSyncMetadata();
    meta.isSyncing = true;
    meta.syncLog.unshift(`🔄 Reconciling ${offlineTxs.length} offline queued transactions with host...`);
    this.saveSyncMetadata(meta);

    await new Promise((r) => setTimeout(r, 1200));

    const settled = txs.map((t) => {
      if (t.status === 'OFFLINE_QUEUED') {
        return {
          ...t,
          status: 'SETTLED_SUCCESS' as const,
          referenceNo: 'ENAT-HOST-' + Math.floor(1000000 + Math.random() * 9000000),
          hostConfirmationTime: new Date().toLocaleTimeString(),
        };
      }
      return t;
    });

    this.saveTransactions(settled);
    meta.isSyncing = false;
    meta.pendingQueueCount = 0;
    meta.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    meta.syncLog.unshift(`✓ All offline transactions reconciled and confirmed by Enat Host.`);
    this.saveSyncMetadata(meta);
  }

  public static resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY_META);
    localStorage.removeItem(STORAGE_KEY_ACCOUNT);
    localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEY_BANKS);
    localStorage.removeItem(STORAGE_KEY_DONATIONS);
    localStorage.removeItem(STORAGE_KEY_MINIAPPS);
    this.emitData();
  }
}
