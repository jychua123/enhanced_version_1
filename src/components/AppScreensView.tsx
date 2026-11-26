import { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Car,
  CreditCard,
  RefreshCw,
  FileText,
} from 'lucide-react';
import {
  APP_FEATURES,
  AppFeatureId,
  MOTORING_CHARGES,
  SAMPLE_TRANSACTIONS,
  TransitCardAccount,
} from '../data/simplygoData';
import { ResilientImage } from './ResilientImage';

interface AppScreensViewProps {
  selectedFeature: AppFeatureId;
  onSelectFeature: (id: AppFeatureId) => void;
  accounts: TransitCardAccount[];
  onUpdateAutoTopUp: (
    cardId: string,
    enabled: boolean,
    threshold: number,
    amount: number
  ) => void;
  onTopUpCard: (cardId: string, amount: number) => void;
}

export function AppScreensView({
  selectedFeature,
  onSelectFeature,
  accounts,
  onUpdateAutoTopUp,
  onTopUpCard,
}: AppScreensViewProps) {
  const [selectedCardId, setSelectedCardId] = useState<string>(
    accounts[0]?.id ?? 'card-1'
  );
  const [claimRoute, setClaimRoute] = useState('Paya Lebar → Raffles Place');
  const [claimReason, setClaimReason] = useState('Missed Tap-Out');
  const [claimSubmittedId, setClaimSubmittedId] = useState<string | null>(null);
  const [myInfoVerified, setMyInfoVerified] = useState(false);
  const [passRenewed, setPassRenewed] = useState(false);

  const activeFeature =
    APP_FEATURES.find((f) => f.id === selectedFeature) ?? APP_FEATURES[0];
  const activeCard =
    accounts.find((c) => c.id === selectedCardId) ?? accounts[0];
  const filteredTransactions = SAMPLE_TRANSACTIONS.filter(
    (tx) => tx.cardId === activeCard.id
  );

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimRoute.trim()) return;
    setClaimSubmittedId('CLM-2026-49182');
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <p className="text-sm font-semibold text-[#3f84c5]">
            SimplyGo Mobile Experience
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#142333] mt-1">
            Interactive SimplyGo App Screens
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Switch between the six core SimplyGo mobile screens to inspect official app layouts and test real commuter workflows.
          </p>
        </div>

        {/* Segmented Screen Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl mb-8">
          {APP_FEATURES.map((feature) => {
            const isActive = feature.id === selectedFeature;
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => onSelectFeature(feature.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#316aa1] text-white'
                    : 'text-slate-700 hover:bg-[#ebf2f9] hover:text-[#316aa1]'
                }`}
              >
                <ResilientImage
                  src={feature.icon}
                  alt={feature.shortTitle}
                  className="w-5 h-5 object-contain rounded"
                />
                <span>{feature.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Screen Split: Official App Screen + Interactive Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Official SimplyGo App Screen */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Official App Screen Preview
                </p>
                <h2 className="text-xl font-bold text-[#142333]">
                  {activeFeature.title}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebf2f9] p-1.5 flex items-center justify-center">
                <ResilientImage
                  src={activeFeature.icon}
                  alt={activeFeature.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="bg-[#ebf2f9]/65 border border-slate-200/70 rounded-2xl p-6 flex items-center justify-center">
              <ResilientImage
                src={activeFeature.screenImage}
                alt={`${activeFeature.title} official screen`}
                fallbackLabel={activeFeature.title}
                className="w-full max-w-[280px] h-auto max-h-[440px] object-contain"
              />
            </div>

            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              {activeFeature.description}
            </p>
          </div>

          {/* Right: Interactive Screen Workspace */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            {selectedFeature === 'transactions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#142333]">
                      Card Balance & Journey Ledger
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Select a linked transit card to inspect fares and instant top-up options.
                    </p>
                  </div>
                  {activeCard.cardType !== 'Bank Contactless' && (
                    <button
                      type="button"
                      onClick={() => onTopUpCard(activeCard.id, 10)}
                      className="px-4 py-2 bg-[#316aa1] hover:bg-[#255582] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Quick Top-Up +$10.00
                    </button>
                  )}
                </div>

                {/* Card Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {accounts.map((card) => {
                    const isSelected = card.id === activeCard.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCardId(card.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#ebf2f9] border-[#316aa1]'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{card.cardType}</span>
                          <CreditCard className="w-4 h-4 text-[#316aa1]" />
                        </div>
                        <p className="font-bold text-sm text-[#142333] mt-1 truncate">
                          {card.nickname}
                        </p>
                        <p className="font-mono text-xs text-slate-500 mt-1 tabular-nums">
                          {card.maskedNumber}
                        </p>
                        <p className="mt-3 text-lg font-bold text-[#316aa1] tabular-nums">
                          {card.cardType === 'Bank Contactless'
                            ? 'Post-Paid'
                            : `$${card.balance.toFixed(2)}`}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Journey / Entry</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 whitespace-nowrap text-slate-600 tabular-nums">
                            <div>{tx.date}</div>
                            <div className="text-xs text-slate-400">{tx.time}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-[#142333]">
                              {tx.route}
                            </div>
                            <div className="text-xs text-slate-500">{tx.detail}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {tx.mode}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-semibold whitespace-nowrap tabular-nums ${
                              tx.amount > 0
                                ? 'text-emerald-700'
                                : 'text-[#142333]'
                            }`}
                          >
                            {tx.amount > 0
                              ? `+$${tx.amount.toFixed(2)}`
                              : tx.amount === 0
                              ? '$0.00'
                              : `-$${Math.abs(tx.amount).toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedFeature === 'autotopup' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-xl font-bold text-[#142333]">
                    Auto Top-Up Configuration
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Adjust your trigger threshold and top-up amount for SimplyGo EZ-Link or Concession cards.
                  </p>
                </div>

                {accounts
                  .filter((a) => a.cardType !== 'Bank Contactless')
                  .map((card) => (
                    <div
                      key={card.id}
                      className="p-5 border border-slate-200 rounded-xl space-y-4 bg-slate-50/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-[#142333]">
                            {card.nickname}
                          </h4>
                          <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                            {card.cardType} · {card.maskedNumber} · Balance: $
                            {card.balance.toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateAutoTopUp(
                              card.id,
                              !card.autoTopUpEnabled,
                              card.autoTopUpThreshold || 15,
                              card.autoTopUpAmount || 30
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                            card.autoTopUpEnabled
                              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {card.autoTopUpEnabled
                            ? 'Auto Top-Up Enabled'
                            : 'Enable Auto Top-Up'}
                        </button>
                      </div>

                      {card.autoTopUpEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                              Trigger When Balance Falls Below
                            </label>
                            <div className="flex gap-2">
                              {[10, 15, 20].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() =>
                                    onUpdateAutoTopUp(
                                      card.id,
                                      true,
                                      val,
                                      card.autoTopUpAmount || 30
                                    )
                                  }
                                  className={`flex-1 py-2 rounded-lg text-sm font-semibold tabular-nums border cursor-pointer ${
                                    card.autoTopUpThreshold === val
                                      ? 'bg-[#316aa1] text-white border-[#316aa1]'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#316aa1]'
                                  }`}
                                >
                                  ${val}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                              Top-Up Value
                            </label>
                            <div className="flex gap-2">
                              {[20, 30, 50].map((amt) => (
                                <button
                                  key={amt}
                                  type="button"
                                  onClick={() =>
                                    onUpdateAutoTopUp(
                                      card.id,
                                      true,
                                      card.autoTopUpThreshold || 15,
                                      amt
                                    )
                                  }
                                  className={`flex-1 py-2 rounded-lg text-sm font-semibold tabular-nums border cursor-pointer ${
                                    card.autoTopUpAmount === amt
                                      ? 'bg-[#316aa1] text-white border-[#316aa1]'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#316aa1]'
                                  }`}
                                >
                                  ${amt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {selectedFeature === 'motoring' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#142333]">
                      EZ-Link Motoring & EV Charging Ledger
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Vehicle Plate: SNG 4812 K · IU: 1094827103 · Post-Paid Billing Active
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#316aa1]">
                    <Car className="w-4 h-4" />
                    <span className="tabular-nums">Month-to-date: $23.27</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {MOTORING_CHARGES.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="text-xs text-slate-500 tabular-nums">
                          {item.type} · {item.date} at {item.time}
                        </div>
                        <div className="font-semibold text-[#142333] mt-0.5">
                          {item.location}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.durationOrGantry}
                        </div>
                      </div>
                      <div className="text-base font-bold text-[#142333] tabular-nums shrink-0">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFeature === 'concession' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-xl font-bold text-[#142333]">
                    Concession Pass Management
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Manage Monthly Concession Passes and check card validity.
                  </p>
                </div>

                <div className="p-5 bg-[#ebf2f9]/65 border border-[#316aa1]/25 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#316aa1]">
                      Adult Monthly Travel Card · 1009 5510 3829 6140
                    </p>
                    <h4 className="text-lg font-bold text-[#142333] mt-1">
                      Hybrid Bus + MRT/LRT Monthly Pass
                    </h4>
                    <p className="text-sm text-slate-600 mt-1 tabular-nums">
                      {passRenewed
                        ? 'Extended validity through 30 Dec 2026'
                        : 'Current validity through 30 Nov 2026'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPassRenewed(true)}
                    disabled={passRenewed}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                      passRenewed
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#316aa1] hover:bg-[#255582] text-white'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {passRenewed ? 'Renewed ($128.00)' : 'Renew Pass ($128.00)'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-xl">
                    <h5 className="font-bold text-sm text-[#142333]">
                      Lost Card Replacement
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Immediately deactivate a misplaced concession card and transfer remaining stored value and pass days to your replacement card.
                    </p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl">
                    <h5 className="font-bold text-sm text-[#142333]">
                      Card Conversion
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Upgrade legacy CEPAS concession cards to SimplyGo at any Self-Help Ticketing Machine to view real-time mobile trip history.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedFeature === 'claims' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-xl font-bold text-[#142333]">
                    Submit a Commuter Travel Claim
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Request a fare adjustment for incomplete tap-outs or duplicate deductions.
                  </p>
                </div>

                {claimSubmittedId ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Claim Submitted Successfully</span>
                    </div>
                    <p className="text-sm text-emerald-900">
                      Reference ID:{' '}
                      <span className="font-mono font-semibold">
                        {claimSubmittedId}
                      </span>{' '}
                      · Journey: {claimRoute} ({claimReason}). Approved fare refunds are credited directly to your card within 3 working days.
                    </p>
                    <button
                      type="button"
                      onClick={() => setClaimSubmittedId(null)}
                      className="px-4 py-2 bg-white border border-emerald-300 text-emerald-900 text-sm font-semibold rounded-lg hover:bg-emerald-100 cursor-pointer"
                    >
                      Submit Another Claim
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitClaim} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#142333] mb-1.5">
                        Affected Journey
                      </label>
                      <input
                        type="text"
                        required
                        value={claimRoute}
                        onChange={(e) => setClaimRoute(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#316aa1]"
                        placeholder="e.g. Tampines → Raffles Place"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#142333] mb-1.5">
                        Claim Category
                      </label>
                      <select
                        value={claimReason}
                        onChange={(e) => setClaimReason(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#316aa1] bg-white"
                      >
                        <option>Missed Tap-Out</option>
                        <option>Duplicate Fare Deduction</option>
                        <option>Failed Auto Top-Up Deduction</option>
                        <option>Concession Fare Discrepancy</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#316aa1] hover:bg-[#255582] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      Submit Travel Claim
                    </button>
                  </form>
                )}
              </div>
            )}

            {selectedFeature === 'myinfo' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-xl font-bold text-[#142333]">
                    Singpass MyInfo Identity Verification
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Required for concession applications, balance refunds, and rightful card ownership checks.
                  </p>
                </div>

                <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/70 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#316aa1] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#142333]">
                        {myInfoVerified
                          ? 'Identity Verified via Singpass MyInfo'
                          : 'Verify Ownership via Singpass MyInfo'}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {myInfoVerified
                          ? 'Verified profile: Chua Jia Yu · NRIC ending •••• 482J · Eligible for Adult & SimplyGo card management.'
                          : 'Authorise SimplyGo to retrieve your verified name, NRIC/FIN, and mailing address from Singpass.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMyInfoVerified((prev) => !prev)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                      myInfoVerified
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-[#cf0b15] hover:bg-[#b00912] text-white'
                    }`}
                  >
                    {myInfoVerified
                      ? 'Verified · Reset Demo State'
                      : 'Simulate Singpass MyInfo Verify'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
