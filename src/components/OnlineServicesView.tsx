import { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  AppFeatureId,
  DISTANCE_FARE_BANDS,
  ScreenId,
} from '../data/simplygoData';

interface OnlineServicesViewProps {
  onNavigate: (screen: ScreenId, appFeature?: AppFeatureId) => void;
}

type CommuterCategory = 'adult' | 'student' | 'seniorPwd' | 'wtcs';

const STATUS_RECORDS: Record<
  string,
  {
    applicant: string;
    cardType: string;
    status: string;
    detail: string;
  }
> = {
  'SG-2026-88412': {
    applicant: 'Chua Jia Yu',
    cardType: 'SimplyGo Adult Monthly Travel Card',
    status: 'Approved & Dispatched',
    detail: 'Mailed via SingPost registered post · Expected delivery in 2 working days.',
  },
  'SG-2026-51209': {
    applicant: 'Tan Wei Ming',
    cardType: 'Undergraduate Student Concession Card',
    status: 'Ready for Collection',
    detail: 'Available at Somerset SimplyGo Ticketing Service Centre.',
  },
};

export function OnlineServicesView({ onNavigate }: OnlineServicesViewProps) {
  const [distanceKm, setDistanceKm] = useState<number>(8.0);
  const [commuterType, setCommuterType] = useState<CommuterCategory>('adult');
  const [pre745am, setPre745am] = useState<boolean>(false);

  const [refInput, setRefInput] = useState<string>('SG-2026-88412');
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<
    (typeof STATUS_RECORDS)[string] | null
  >(STATUS_RECORDS['SG-2026-88412']);

  const matchedBand =
    DISTANCE_FARE_BANDS.find((b) => distanceKm <= b.maxKm) ??
    DISTANCE_FARE_BANDS[DISTANCE_FARE_BANDS.length - 1];

  const baseFare = matchedBand[commuterType];
  const discount = pre745am ? Math.min(0.5, baseFare - 0.1) : 0;
  const finalFare = Math.max(0.1, baseFare - discount);

  const handleStatusCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const key = refInput.trim().toUpperCase();
    if (!key) {
      setStatusError('Please enter an application reference number.');
      setStatusResult(null);
      return;
    }
    const found = STATUS_RECORDS[key];
    if (found) {
      setStatusError(null);
      setStatusResult(found);
    } else {
      setStatusError(
        `No record found for "${key}". Try SG-2026-88412 or SG-2026-51209.`
      );
      setStatusResult(null);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#3f84c5]">
            SimplyGo Digital e-Services
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#142333] mt-1">
            Fare Calculator & Online Card Services
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Estimate distance-based bus and MRT fares, verify concession application progress, or launch self-service card tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Distance-Based Fare Calculator */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#142333]">
                Distance-Based Transit Fare Calculator
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Applies across basic bus services and MRT/LRT lines within a single journey (up to 5 transfers).
              </p>
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'adult', label: 'Adult Card' },
                { id: 'student', label: 'Student' },
                { id: 'seniorPwd', label: 'Senior / PWD' },
                { id: 'wtcs', label: 'Workfare (WTCS)' },
              ].map((cat) => {
                const isSelected = commuterType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCommuterType(cat.id as CommuterCategory)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#316aa1] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-[#ebf2f9] hover:text-[#316aa1]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Distance Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-[#142333]">Total Journey Distance</span>
                <span className="text-[#316aa1] tabular-nums">
                  {distanceKm.toFixed(1)} km ({matchedBand.label})
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-[#316aa1] cursor-pointer"
                aria-label="Total journey distance in kilometers"
              />
            </div>

            {/* Morning Pre-Peak Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#ebf2f9]/60 border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-[#142333]">
                  Morning Pre-Peak Rail Discount (Tap in before 7:45 AM)
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Up to $0.50 off rail fares on weekdays (excluding public holidays).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPre745am((prev) => !prev)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  pre745am
                    ? 'bg-[#316aa1] text-white'
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                {pre745am ? 'Applied' : 'Apply'}
              </button>
            </div>

            {/* Result Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Standard Fare</span>
                <span className="text-lg font-bold text-[#142333] tabular-nums">
                  ${baseFare.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Pre-Peak Rebate</span>
                <span className="text-lg font-bold text-emerald-700 tabular-nums">
                  -${discount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Estimated Total</span>
                <span className="text-2xl font-bold text-[#316aa1] tabular-nums">
                  ${finalFare.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Application Status Checker + Quick Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#142333]">
                  Check Concession Application Status
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your reference ID (sample:{' '}
                  <span className="font-mono text-[#316aa1]">SG-2026-88412</span>{' '}
                  or{' '}
                  <span className="font-mono text-[#316aa1]">SG-2026-51209</span>).
                </p>
              </div>

              <form onSubmit={handleStatusCheck} className="flex gap-2">
                <input
                  type="text"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder="SG-2026-88412"
                  className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-[#316aa1]"
                  aria-label="Application reference number"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#316aa1] hover:bg-[#255582] text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Check</span>
                </button>
              </form>

              {statusError && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm text-amber-900">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{statusError}</span>
                </div>
              )}

              {statusResult && (
                <div className="p-4 rounded-xl bg-[#ebf2f9]/70 border border-[#316aa1]/25 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#316aa1]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{statusResult.status}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#142333]">
                    {statusResult.cardType} · {statusResult.applicant}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {statusResult.detail}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-[#142333]">
                Self-Service e-Services
              </h3>
              {[
                {
                  label: 'Submit a Commuter Travel Claim',
                  feature: 'claims' as AppFeatureId,
                },
                {
                  label: 'Renew Monthly Concession Pass',
                  feature: 'concession' as AppFeatureId,
                },
                {
                  label: 'Verify Identity via Singpass MyInfo',
                  feature: 'myinfo' as AppFeatureId,
                },
              ].map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => onNavigate('app', link.feature)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-[#316aa1] hover:bg-[#ebf2f9]/40 text-sm font-semibold text-[#142333] transition-colors cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#316aa1]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
