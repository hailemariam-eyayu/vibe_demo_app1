import React, { useState } from 'react';
import { MiniAppItem, BankAccount, BankTransaction } from '../../types';
import { X, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, AlertCircle, Smartphone, Plane, Car, Wifi, Zap, GraduationCap } from 'lucide-react';
import { SyncService } from '../../services/syncService';
import { BiometricModal } from '../common/BiometricModal';
import { EnatLogo } from '../common/EnatLogo';

interface MiniAppRunnerModalProps {
  app: MiniAppItem;
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
  onTransactionSuccess: (tx: BankTransaction) => void;
}

export const MiniAppRunnerModal: React.FC<MiniAppRunnerModalProps> = ({
  app,
  isOpen,
  onClose,
  account,
  onTransactionSuccess,
}) => {
  // Telebirr state
  const [telebirrPhone, setTelebirrPhone] = useState('0911234567');
  const [telebirrAmount, setTelebirrAmount] = useState('1200');

  // Ethiopian Airlines state
  const [flightRoute, setFlightRoute] = useState('Addis Ababa (ADD) → Dire Dawa (DIR)');
  const [flightDate, setFlightDate] = useState('Tomorrow, 08:30 AM');
  const [flightFare, setFlightFare] = useState('4850');

  // Ride / Feres state
  const [rideCode, setRideCode] = useState('RD-8492');
  const [rideFare, setRideFare] = useState('380');

  // Ethio Telecom state
  const [packageType, setPackageType] = useState('Unlimited 4G Night & Day (30 Days)');
  const [airtimeAmount, setAirtimeAmount] = useState('690');

  // Utility state
  const [meterNo, setMeterNo] = useState('01492049182');
  const [utilityAmount, setUtilityAmount] = useState('500');

  // General state
  const [showBiometric, setShowBiometric] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<BankTransaction | null>(null);

  if (!isOpen) return null;

  const getActiveAmount = (): number => {
    switch (app.id) {
      case 'telebirr_bridge':
        return parseFloat(telebirrAmount) || 0;
      case 'ethiopian_airlines':
        return parseFloat(flightFare) || 0;
      case 'ride_hail':
        return parseFloat(rideFare) || 0;
      case 'ethio_telecom':
        return parseFloat(airtimeAmount) || 0;
      case 'utility_pay':
        return parseFloat(utilityAmount) || 0;
      default:
        return 750;
    }
  };

  const handleCheckoutClick = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amountToPay = getActiveAmount();

    if (amountToPay <= 0) {
      setError('Please specify a valid payment amount.');
      return;
    }

    if (amountToPay > account.balance) {
      setError(`Insufficient account balance. Available: ETB ${account.balance.toLocaleString()}`);
      return;
    }

    setShowBiometric(true);
  };

  const handleBiometricAuthorized = async () => {
    setShowBiometric(false);
    setIsExecuting(true);

    const amountToPay = getActiveAmount();
    let txTitle = `${app.name} Checkout`;
    let txSubtitle = `${app.provider} Gateway`;

    if (app.id === 'telebirr_bridge') {
      txTitle = `Telebirr Transfer to ${telebirrPhone}`;
      txSubtitle = 'SuperApp Wallet Cross-Transfer';
    } else if (app.id === 'ethiopian_airlines') {
      txTitle = `ET Ticket: ${flightRoute.split('→')[1]?.trim() || 'Flight'}`;
      txSubtitle = 'Ethiopian Airlines Booking Ref: ET-789';
    } else if (app.id === 'ride_hail') {
      txTitle = `RIDE Taxi Trip #${rideCode}`;
      txSubtitle = 'Direct Driver Settlement';
    } else if (app.id === 'ethio_telecom') {
      txTitle = `Ethio Telecom: ${packageType}`;
      txSubtitle = '4G/5G Instant Airtime Recharge';
    } else if (app.id === 'utility_pay') {
      txTitle = `EEU Electricity Token (Meter ${meterNo.slice(-4)})`;
      txSubtitle = 'Prepaid Energy Clearance';
    }

    const result = await SyncService.executeOptimisticTransaction({
      title: txTitle,
      subtitle: txSubtitle,
      amount: amountToPay,
      category: 'MINI_APP',
      miniAppId: app.id,
      notes: `Third-party transaction via ${app.name} (${app.version})`,
    });

    setIsExecuting(false);
    if (result.success) {
      setOrderComplete(result.transaction);
      onTransactionSuccess(result.transaction);
    } else {
      setError(result.error || 'Payment execution failed');
    }
  };

  const renderIcon = () => {
    switch (app.iconName) {
      case 'Plane':
        return <Plane className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#180A29] border border-purple-800/80 w-full max-w-md rounded-3xl p-5 shadow-2xl text-slate-100 relative max-h-[92vh] overflow-y-auto">
          {/* Top In-App Sandbox Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: app.themeColor }}
              >
                {renderIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">{app.name}</h3>
                  <span className="text-[10px] bg-purple-950 text-purple-200 border border-purple-800/60 px-1.5 py-0.5 rounded font-mono">
                    {app.version}
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/70">
                  Sandboxed Mini App • Powered by {app.provider}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-purple-300/70 hover:text-white p-1 rounded-xl hover:bg-purple-900/40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen inside Mini App */}
          {orderComplete ? (
            <div className="py-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
              <p className="text-xs text-purple-200 mt-1 max-w-xs mx-auto">
                {orderComplete.title} confirmed by Enat Core Banking host.
              </p>

              <div className="bg-[#10051E] border border-purple-900/60 rounded-2xl p-4 my-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-purple-300/70">
                  <span>Host Ref:</span>
                  <span className="text-purple-300 font-bold">{orderComplete.referenceNo}</span>
                </div>
                <div className="flex justify-between text-purple-300/70">
                  <span>Amount Debited:</span>
                  <span className="text-white font-bold">ETB {orderComplete.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-purple-300/70">
                  <span>Updated Local Balance:</span>
                  <span className="text-emerald-400 font-bold">ETB {account.balance.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrderComplete(null)}
                  className="flex-1 bg-purple-950/70 hover:bg-purple-900 border border-purple-800/60 text-purple-200 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Make Another Request
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Sandbox Forms based on App */
            <form onSubmit={handleCheckoutClick} className="space-y-4 my-4">
              {/* Telebirr form */}
              {app.id === 'telebirr_bridge' && (
                <>
                  <div className="bg-purple-950/50 border border-purple-500/40 rounded-2xl p-3 text-xs text-purple-200">
                    ⚡ Instant Enat Bank ↔ Telebirr interoperability gateway. 0% transfer fee.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Telebirr Phone Number
                    </label>
                    <input
                      type="text"
                      value={telebirrPhone}
                      onChange={(e) => setTelebirrPhone(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                      placeholder="09XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Transfer Amount (ETB)
                    </label>
                    <input
                      type="number"
                      value={telebirrAmount}
                      onChange={(e) => setTelebirrAmount(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </>
              )}

              {/* Ethiopian Airlines Form */}
              {app.id === 'ethiopian_airlines' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Select Flight Route
                    </label>
                    <select
                      value={flightRoute}
                      onChange={(e) => setFlightRoute(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 cursor-pointer"
                    >
                      <option>Addis Ababa (ADD) → Dire Dawa (DIR)</option>
                      <option>Addis Ababa (ADD) → Hawassa (AWA)</option>
                      <option>Addis Ababa (ADD) → Bahir Dar (BJR)</option>
                      <option>Addis Ababa (ADD) → Gondar (GDQ)</option>
                      <option>Addis Ababa (ADD) → Nairobi (NBO)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                        Departure Date
                      </label>
                      <input
                        type="text"
                        value={flightDate}
                        onChange={(e) => setFlightDate(e.target.value)}
                        className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                        Ticket Fare (ETB)
                      </label>
                      <input
                        type="number"
                        value={flightFare}
                        onChange={(e) => setFlightFare(e.target.value)}
                        className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3 py-2 text-xs text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Ride Hail Form */}
              {app.id === 'ride_hail' && (
                <>
                  <div className="bg-purple-950/50 border border-purple-500/40 rounded-2xl p-3 text-xs text-purple-200">
                    🚕 Seamless contact-free taxi payment for RIDE and Feres driver trips.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Driver Passenger Code
                    </label>
                    <input
                      type="text"
                      value={rideCode}
                      onChange={(e) => setRideCode(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Trip Fare (ETB)
                    </label>
                    <input
                      type="number"
                      value={rideFare}
                      onChange={(e) => setRideFare(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-sm text-white font-mono font-bold"
                    />
                  </div>
                </>
              )}

              {/* Ethio Telecom Form */}
              {app.id === 'ethio_telecom' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Package / Airtime Bundle
                    </label>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 cursor-pointer"
                    >
                      <option>Unlimited 4G Night & Day (30 Days)</option>
                      <option>10 GB Super 4G Data + 200 Min Talk</option>
                      <option>500 ETB Standard Airtime Scratchless</option>
                      <option>Ethio Telecom Fiber 50 Mbps Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Total Cost (ETB)
                    </label>
                    <input
                      type="number"
                      value={airtimeAmount}
                      onChange={(e) => setAirtimeAmount(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-sm text-white font-mono font-bold"
                    />
                  </div>
                </>
              )}

              {/* Utility Form */}
              {app.id === 'utility_pay' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Prepaid Electric Meter / Account No
                    </label>
                    <input
                      type="text"
                      value={meterNo}
                      onChange={(e) => setMeterNo(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                      Token Recharge Amount (ETB)
                    </label>
                    <input
                      type="number"
                      value={utilityAmount}
                      onChange={(e) => setUtilityAmount(e.target.value)}
                      className="w-full bg-[#10051E] border border-purple-800/70 rounded-2xl px-3.5 py-2.5 text-sm text-white font-mono font-bold"
                    />
                  </div>
                </>
              )}

              {/* Enat Direct Checkout Payment Pill */}
              <div className="bg-[#10051E] border border-purple-800/70 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <EnatLogo size="sm" variant="icon" />
                  <div>
                    <span className="font-semibold text-white block leading-tight">
                      Enat Direct Checkout
                    </span>
                    <span className="text-[10px] text-purple-300/70 font-mono">
                      Acc ...{account.accountNumber.slice(-4)} (ETB {account.balance.toLocaleString()})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-purple-300/70 block">Total</span>
                  <span className="text-sm font-bold text-purple-300 font-mono">
                    ETB {getActiveAmount().toLocaleString()}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isExecuting}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
              >
                <span>Authorize with Enat Biometrics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <BiometricModal
        isOpen={showBiometric}
        onClose={() => setShowBiometric(false)}
        onSuccess={handleBiometricAuthorized}
        title={`Authorize ${app.name}`}
        subtitle="Confirm biometric identity to approve third-party payment"
        amountText={`ETB ${getActiveAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        defaultMode="FACE_ID"
      />
    </>
  );
};
