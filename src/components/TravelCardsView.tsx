import { useState } from 'react';
import { Check, ArrowRight, Calculator } from 'lucide-react';
import {
  CARD_CHARM_DESIGNS,
  CARD_PRODUCTS,
  ScreenId,
} from '../data/simplygoData';
import { ResilientImage } from './ResilientImage';

type CardTabId = 'ezlink' | 'charms' | 'concession' | 'motoring';

interface TravelCardsViewProps {
  initialTab: CardTabId;
  onNavigate: (screen: ScreenId) => void;
}

const TABS: {
  id: CardTabId;
  label: string;
  image: string;
  summary: string;
}[] = [
  {
    id: 'ezlink',
    label: 'EZ-Link & Bank Cards',
    image: 'https://simplygo.com.sg/media/rekjpvnv/ez-link-blue-card.png',
    summary:
      'Everyday stored-value cards and contactless bank cards for all commuters. Available off-the-shelf with no eligibility checks.',
  },
  {
    id: 'charms',
    label: 'EZ-Link Charms',
    image: 'https://simplygo.com.sg/media/hy0flez5/new-launches.jpg',
    summary:
      'Wearable tap-and-go accessories and limited-edition collectibles. Sold without stored value; top up before riding.',
  },
  {
    id: 'concession',
    label: 'Concession Cards',
    image:
      'https://simplygo.com.sg/media/x33lrgvq/concession-monthly_travel_cards.png',
    summary:
      'Personalised subsidised transit cards and Monthly Travel Passes for eligible Students, Seniors, Children, PWD, and Adults.',
  },
  {
    id: 'motoring',
    label: 'EZ-Link Motoring & EV',
    image: 'https://simplygo.com.sg/media/dg3phwal/ez-link-motoring.png',
    summary:
      'Post-paid cardless billing for ERP gantries, HDB/URA carparks, and public EV charging sessions.',
  },
];

export function TravelCardsView({
  initialTab,
  onNavigate,
}: TravelCardsViewProps) {
  const [activeTab, setActiveTab] = useState<CardTabId>(initialTab);
  const [tripsPerWeek, setTripsPerWeek] = useState<number>(12);
  const [avgFare, setAvgFare] = useState<number>(1.85);

  const monthlyPayAsYouGo = tripsPerWeek * 4.33 * avgFare;
  const adultPassCost = 128;
  const monthlySavings = monthlyPayAsYouGo - adultPassCost;

  const filteredProducts = CARD_PRODUCTS.filter((p) => p.category === activeTab);
  const filteredDesigns = CARD_CHARM_DESIGNS.filter((d) =>
    activeTab === 'ezlink'
      ? d.category === 'ezlink'
      : activeTab === 'charms'
      ? d.category === 'charm'
      : activeTab === 'concession'
      ? d.category === 'concession'
      : false
  );
  const activeTabInfo = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <section className="py-12 lg:py-16 bg-white min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Intro + 4 Clear Category Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#ebf2f9] rounded-2xl p-6 sm:p-10">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-sm font-semibold text-[#3f84c5]">
              Clear Transit & Motoring Guide
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#142333]">
              {activeTabInfo.label}
            </h1>
            <p className="text-base text-slate-600 max-w-2xl">
              {activeTabInfo.summary}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#316aa1] text-white'
                        : 'bg-white text-slate-700 hover:text-[#316aa1] border border-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <ResilientImage
              src={activeTabInfo.image}
              alt={activeTabInfo.label}
              className="max-h-44 w-auto object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Visual Designs for Selected Category */}
        {filteredDesigns.length > 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#142333]">
                {activeTab === 'ezlink'
                  ? 'EZ-Link & SimplyGo EZ-Link Card Designs'
                  : activeTab === 'charms'
                  ? 'Latest Wearable EZ-Link Charms'
                  : 'Official Concession Card Designs'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {activeTab === 'charms'
                  ? 'Collectible wearables sold empty (top up at Ticket Offices, Self-Help Machines, or via SimplyGo App).'
                  : activeTab === 'concession'
                  ? 'Requires Singpass MyInfo / eligibility verification for subsidised concession fares.'
                  : 'Standard stored-value cards available to everyone without application.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesigns.map((design) => (
                <div
                  key={design.id}
                  className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 rounded-xl bg-[#ebf2f9]/55 flex items-center justify-center p-3 mb-4 overflow-hidden">
                      {design.videoUrl ? (
                        <video
                          src={design.videoUrl}
                          poster={design.image}
                          controls
                          muted
                          loop
                          playsInline
                          className="max-h-40 rounded-lg w-auto object-contain"
                        />
                      ) : (
                        <ResilientImage
                          src={design.image}
                          alt={design.name}
                          fallbackLabel={design.name}
                          className="max-h-36 w-auto object-contain"
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#3f84c5]">
                      {design.badge}
                    </p>
                    <h3 className="text-lg font-bold text-[#142333] mt-0.5">
                      {design.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {design.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                    <p className="font-bold text-[#316aa1] tabular-nums">
                      {design.priceOrFee}
                    </p>
                    <p className="text-slate-500">
                      Available at: {design.whereToBuy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Details */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-white"
              >
                <div>
                  <p className="text-xs font-medium text-[#3f84c5]">
                    {product.eligibility}
                  </p>
                  <h2 className="text-2xl font-bold text-[#142333] mt-1.5">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {product.tagline}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {product.keyBenefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <Check className="w-4 h-4 text-[#316aa1] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      {product.monthlyPassPrice ? 'Monthly Pass' : 'Typical Fare'}
                    </span>
                    <span className="text-sm font-bold text-[#316aa1] tabular-nums">
                      {product.monthlyPassPrice || product.fareExample}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('services')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ebf2f9] hover:bg-[#dce8f5] text-[#316aa1] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Check Fares</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Adult Monthly Travel Pass Break-Even Estimator */}
        {activeTab === 'concession' && (
          <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2 text-[#316aa1] font-semibold text-sm">
                  <Calculator className="w-4 h-4" />
                  <span>Monthly Travel Pass Break-Even Estimator</span>
                </div>
                <h2 className="text-2xl font-bold text-[#142333]">
                  Should you buy the $128.00 Adult Monthly Travel Card?
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-sm font-semibold text-[#142333] mb-2">
                      <span>Trips per Week</span>
                      <span className="tabular-nums text-[#316aa1]">
                        {tripsPerWeek} trips
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={28}
                      step={1}
                      value={tripsPerWeek}
                      onChange={(e) => setTripsPerWeek(Number(e.target.value))}
                      className="w-full accent-[#316aa1] cursor-pointer"
                      aria-label="Trips per week"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold text-[#142333] mb-2">
                      <span>Average Fare per Trip</span>
                      <span className="tabular-nums text-[#316aa1]">
                        ${avgFare.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1.19}
                      max={2.38}
                      step={0.05}
                      value={avgFare}
                      onChange={(e) => setAvgFare(Number(e.target.value))}
                      className="w-full accent-[#316aa1] cursor-pointer"
                      aria-label="Average fare per trip"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Estimated Pay-As-You-Go</span>
                  <span className="font-bold text-[#142333] tabular-nums">
                    ${monthlyPayAsYouGo.toFixed(2)} / mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Adult Monthly Travel Card</span>
                  <span className="font-bold text-[#142333] tabular-nums">
                    $128.00 / mo
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#142333]">
                    Recommendation
                  </span>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      monthlySavings > 0 ? 'text-emerald-700' : 'text-[#316aa1]'
                    }`}
                  >
                    {monthlySavings > 0
                      ? `Monthly Pass saves $${monthlySavings.toFixed(2)}/mo`
                      : `Pay-As-You-Go saves $${Math.abs(monthlySavings).toFixed(2)}/mo`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
