import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Play,
  X,
  CreditCard,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';
import {
  APP_FEATURES,
  ASSISTANCE_TILES,
  AppFeatureId,
  AssistanceCategory,
  CARD_CHARM_DESIGNS,
  CardCharmDesign,
  HERO_SLIDES,
  PLATFORM_CARDS,
  QUICK_SEARCH_ITEMS,
  SIMPLYGO_ASSETS,
  ScreenId,
} from '../data/simplygoData';
import { ResilientImage } from './ResilientImage';

interface HomeScreenProps {
  onNavigate: (
    screen: ScreenId,
    options?: {
      appFeature?: AppFeatureId;
      cardTab?: 'ezlink' | 'charms' | 'concession' | 'motoring';
      assistanceCategory?: AssistanceCategory;
    }
  ) => void;
}

const SHORT_FEATURE_SUMMARIES: Record<AppFeatureId, string> = {
  transactions: 'Real-time card balance & trip logs',
  autotopup: 'Automatic top-ups below threshold',
  motoring: 'Cardless ERP, carparks & EV charging',
  concession: 'Renew monthly passes & replace cards',
  claims: 'Submit missed tap-out fare claims',
  myinfo: 'Singpass MyInfo account security',
};

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [activeFeatureId, setActiveFeatureId] =
    useState<AppFeatureId>('transactions');
  const [advisoryVisible, setAdvisoryVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [designFilter, setDesignFilter] = useState<
    'all' | 'ezlink' | 'charm' | 'concession'
  >('all');
  const [selectedDesign, setSelectedDesign] =
    useState<CardCharmDesign | null>(null);

  useEffect(() => {
    if (carouselPaused) return;
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [carouselPaused]);

  const currentSlide = HERO_SLIDES[slideIndex];
  const activeFeature =
    APP_FEATURES.find((f) => f.id === activeFeatureId) ?? APP_FEATURES[0];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? QUICK_SEARCH_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(normalizedQuery) ||
          item.keywords.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery)
      ).slice(0, 5)
    : [];

  const ezlinkDesigns = CARD_CHARM_DESIGNS.filter(
    (d) => d.category === 'ezlink'
  );
  const charmDesigns = CARD_CHARM_DESIGNS.filter((d) => d.category === 'charm');
  const concessionDesigns = CARD_CHARM_DESIGNS.filter(
    (d) => d.category === 'concession'
  );

  const handlePlatformClick = (card: (typeof PLATFORM_CARDS)[number]) => {
    if (
      card.targetScreen === 'cards' &&
      (card.subTab === 'ezlink' || card.subTab === 'concession')
    ) {
      onNavigate('cards', { cardTab: card.subTab });
    } else if (card.targetScreen === 'app' && card.subTab === 'motoring') {
      onNavigate('app', { appFeature: 'motoring' });
    } else {
      onNavigate(card.targetScreen);
    }
  };

  const renderDesignCard = (
    item: CardCharmDesign,
    accentClass: string,
    categoryLabel: string
  ) => (
    <button
      key={item.id}
      type="button"
      onClick={() => setSelectedDesign(item)}
      className="group text-left bg-white border border-slate-200 hover:border-[#3f84c5] rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div
          className={`relative h-36 rounded-xl flex items-center justify-center p-3 overflow-hidden mb-3 ${accentClass}`}
        >
          <ResilientImage
            src={item.image}
            alt={item.name}
            fallbackLabel={item.name}
            className="max-h-30 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          {item.videoUrl && (
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-[#0c1a27]/85 text-white text-[11px] font-semibold px-2 py-1 rounded-md">
              <Play className="w-3 h-3" />
              <span>Video</span>
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-[#3f84c5]">{categoryLabel}</p>
        <h4 className="text-base font-bold text-[#142333] group-hover:text-[#316aa1] transition-colors mt-0.5 line-clamp-2">
          {item.name}
        </h4>
        <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-[#142333] tabular-nums truncate pr-2">
          {item.priceOrFee}
        </span>
        <span className="font-semibold text-[#316aa1] shrink-0 inline-flex items-center gap-1">
          Details
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );

  return (
    <div>
      {/* Slim Dismissible Service Notice */}
      {advisoryVisible && (
        <div className="bg-[#316aa1] text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
            <p className="truncate">
              <span className="font-semibold">Service Notice:</span> Scheduled maintenance 27 Nov, 12 AM – 6 AM. E-services and kiosks may experience brief interruptions.
            </p>
            <button
              type="button"
              onClick={() => setAdvisoryVisible(false)}
              className="p-0.5 rounded hover:bg-white/15 transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss service notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Compact Split Hero: Quick Search + Compact Announcement Banner */}
      <section className="bg-gradient-to-b from-[#ebf2f9] to-white border-b border-slate-200/80 py-7 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            <div className="lg:col-span-6 space-y-3.5">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#142333]">
                  Find your SimplyGo card, charm, or fare service
                </h1>
                <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                  Compare EZ-Link cards, wearable charms, and concession cards—or jump straight to the tool you need.
                </p>
              </div>

              {/* Instant Search Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search EZ-Link charms, concession cards, fares, MRT stations..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 focus:border-[#316aa1] rounded-xl text-sm text-[#142333] shadow-xs focus:outline-none"
                    aria-label="Search SimplyGo functions and cards"
                  />
                </div>

                {normalizedQuery && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    {searchResults.length === 0 ? (
                      <div className="p-3.5 text-sm text-slate-500">
                        No direct match for "{searchQuery}". Try "charm", "fare", "top-up", or "concession".
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {searchResults.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery('');
                                onNavigate(item.screen, {
                                  appFeature: item.appFeature,
                                  cardTab: item.cardTab,
                                  assistanceCategory: item.assistanceCategory,
                                });
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-[#ebf2f9]/65 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                            >
                              <div>
                                <span className="text-xs font-medium text-[#3f84c5] block">
                                  {item.category}
                                </span>
                                <span className="text-sm font-semibold text-[#142333]">
                                  {item.label}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-[#316aa1] shrink-0" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <a
                  href="#latest-cards-charms"
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#316aa1] rounded-lg text-xs font-semibold text-[#316aa1] transition-colors whitespace-nowrap"
                >
                  Cards vs Charms vs Concession
                </a>
                <a
                  href="#simplygo-app-hub"
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#316aa1] rounded-lg text-xs font-semibold text-[#316aa1] transition-colors whitespace-nowrap"
                >
                  SimplyGo App
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#316aa1] rounded-lg text-xs font-semibold text-[#316aa1] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Fare Calculator
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('locations')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#316aa1] rounded-lg text-xs font-semibold text-[#316aa1] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Locations
                </button>
              </div>
            </div>

            {/* Right: Compact Announcement Banner */}
            <div
              className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0c1a27] shadow-sm"
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              aria-label="Featured SimplyGo Highlights"
            >
              <div className="relative aspect-[16/7] w-full overflow-hidden">
                <ResilientImage
                  src={currentSlide.desktopImage}
                  alt={currentSlide.title}
                  fallbackLabel={currentSlide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c1a27]/95 via-[#0c1a27]/55 to-transparent px-4 sm:px-5 pt-10 pb-3.5 flex items-end justify-between gap-3">
                  <div className="text-white min-w-0">
                    <p className="text-xs font-medium text-[#9ec7f0]">
                      {currentSlide.accentNote} · {slideIndex + 1}/{HERO_SLIDES.length}
                    </p>
                    <h2 className="text-sm sm:text-base font-bold text-white truncate">
                      {currentSlide.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(currentSlide.targetScreen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3f84c5] hover:bg-[#316aa1] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{currentSlide.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSlideIndex(
                      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                    )
                  }
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#0c1a27] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#0c1a27] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#0c1a27] py-2 flex items-center justify-center gap-1.5">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    aria-label={`View slide ${idx + 1}: ${slide.title}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === slideIndex
                        ? 'w-6 bg-[#3f84c5]'
                        : 'w-1.5 bg-slate-500 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Clear Distinction: EZ-Link Cards vs EZ-Link Charms vs Concession Cards */}
      <section id="latest-cards-charms" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header + Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#3f84c5]">
                Clear Card & Charm Guide
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#142333] mt-0.5">
                EZ-Link Cards, Charms & Concession Cards
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Each product serves a different commuter need—compare them clearly before choosing yours.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
              {[
                { id: 'all', label: 'Show All 3 Types' },
                { id: 'ezlink', label: 'EZ-Link Cards' },
                { id: 'charm', label: 'EZ-Link Charms' },
                { id: 'concession', label: 'Concession Cards' },
              ].map((tab) => {
                const isActive = designFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setDesignFilter(
                        tab.id as 'all' | 'ezlink' | 'charm' | 'concession'
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#316aa1] shadow-xs'
                        : 'text-slate-600 hover:text-[#142333]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Distinction Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-2xl p-5 bg-[#ebf2f9]/55">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#316aa1]">
                  01 · Everyday Stored-Value Cards
                </span>
                <CreditCard className="w-4 h-4 text-[#316aa1]" />
              </div>
              <h3 className="text-base font-bold text-[#142333]">
                EZ-Link & SimplyGo EZ-Link Cards
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Standard wallet cards for all commuters. No application needed—buy off the shelf ($10 incl. $5 value) and pay standard Adult fares.
              </p>
            </div>

            <div className="border border-amber-200/90 rounded-2xl p-5 bg-amber-50/55">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800">
                  02 · Wearable Tap-and-Go Collectibles
                </span>
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-[#142333]">
                EZ-Link Charms
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Keychain and LED charms with built-in EZ-Link chips. Sold empty (top up before riding) at Shopee, Lazada, TikTok & selected Ticket Offices.
              </p>
            </div>

            <div className="border border-emerald-200/90 rounded-2xl p-5 bg-emerald-50/55">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800">
                  03 · Eligibility-Based Subsidised Cards
                </span>
                <BadgeCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="text-base font-bold text-[#142333]">
                Concession & Monthly Travel Cards
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Personalised photo cards for Students, Seniors, Children, PWD & Adult Monthly Pass holders. Requires Singpass MyInfo eligibility check.
              </p>
            </div>
          </div>

          {/* Separated Product Sections */}
          <div className="space-y-9">
            {(designFilter === 'all' || designFilter === 'ezlink') && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#142333]">
                      EZ-Link & SimplyGo EZ-Link Cards
                    </h3>
                    <p className="text-xs text-slate-500">
                      Open to everyone · Standard Adult card fares · Sold at Ticket Offices & convenience stores
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('cards', { cardTab: 'ezlink' })}
                    className="text-xs font-semibold text-[#316aa1] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Compare EZ-Link Cards →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {ezlinkDesigns.map((item) =>
                    renderDesignCard(item, 'bg-[#ebf2f9]/70', 'EZ-Link Card')
                  )}
                </div>
              </div>
            )}

            {(designFilter === 'all' || designFilter === 'charm') && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#142333]">
                      Latest EZ-Link Charms (Wearables)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Limited-edition keychain accessories · No stored value pre-loaded · Tap & ride everywhere
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('cards', { cardTab: 'charms' })}
                    className="text-xs font-semibold text-[#316aa1] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    View Charms Stockists →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {charmDesigns.map((item) =>
                    renderDesignCard(item, 'bg-amber-50/80', 'Wearable Charm')
                  )}
                </div>
              </div>
            )}

            {(designFilter === 'all' || designFilter === 'concession') && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#142333]">
                      Concession & Monthly Travel Cards
                    </h3>
                    <p className="text-xs text-slate-500">
                      Eligibility required · Subsidised fares & unlimited Monthly Passes · Apply via Singpass MyInfo
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate('cards', { cardTab: 'concession' })
                    }
                    className="text-xs font-semibold text-[#316aa1] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Check Concession Eligibility →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {concessionDesigns.map((item) =>
                    renderDesignCard(
                      item,
                      'bg-emerald-50/75',
                      'Concession Card'
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Streamlined 4-Card Core Services Hub */}
          <div className="pt-4 border-t border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLATFORM_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handlePlatformClick(card)}
                  className="group text-left bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-[#3f84c5] rounded-xl p-4 transition-all flex items-center gap-3.5 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#ebf2f9] flex items-center justify-center p-2 shrink-0">
                    <ResilientImage
                      src={card.image}
                      alt={card.title}
                      fallbackLabel={card.title}
                      className="max-h-10 w-auto object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#142333] group-hover:text-[#316aa1] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      Explore service →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Summarised SimplyGo App Section (Compact Features + Direct Download) */}
      <section
        id="simplygo-app-hub"
        className="py-10 lg:py-12 bg-[#ebf2f9] border-y border-slate-200/70"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Concise Summary + 2x3 Compact Feature Tiles */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#3f84c5]">
                  SimplyGo Mobile App
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#142333] mt-0.5">
                  One app for transit, motoring & passes
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 max-w-xl">
                  Link bank cards, EZ-Link cards, and concession cards to track trips, automate top-ups, and pay ERP or EV charging.
                </p>
              </div>

              {/* Compact 2x3 Feature Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {APP_FEATURES.map((feature) => {
                  const isSelected = feature.id === activeFeatureId;
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => setActiveFeatureId(feature.id)}
                      className={`text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#316aa1] shadow-xs'
                          : 'bg-white/70 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#ebf2f9] flex items-center justify-center shrink-0 p-1.5">
                        <ResilientImage
                          src={feature.icon}
                          alt={feature.title}
                          fallbackLabel={feature.shortTitle}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`text-sm font-bold truncate ${
                            isSelected ? 'text-[#316aa1]' : 'text-[#142333]'
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {SHORT_FEATURE_SUMMARIES[feature.id]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Direct Download + Interactive CTA Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('app', { appFeature: activeFeature.id })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#316aa1] hover:bg-[#255582] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>Try {activeFeature.shortTitle} Screen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://play.google.com/store/apps/details?id=sg.com.transitlink.tlapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <ResilientImage
                    src={SIMPLYGO_ASSETS.playStore}
                    alt="Download SimplyGo on Google Play"
                    className="h-10 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://apps.apple.com/sg/app/simplygo/id1460864759"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <ResilientImage
                    src={SIMPLYGO_ASSETS.appStore}
                    alt="Download SimplyGo on the App Store"
                    className="h-10 w-auto object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Right: Compact Phone Preview */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5">
              <div className="bg-[#f4f8fc] border border-slate-200/80 rounded-xl p-2.5 w-40 sm:w-44 shrink-0 flex items-center justify-center">
                <ResilientImage
                  src={activeFeature.screenImage}
                  alt={`${activeFeature.title} app screen`}
                  fallbackLabel={activeFeature.title}
                  className="w-full h-auto max-h-[250px] object-contain"
                />
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold text-[#3f84c5]">
                  App Screen Preview
                </p>
                <h3 className="text-lg font-bold text-[#142333]">
                  {activeFeature.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeFeature.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Compact Assistance Hub */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#142333]">
                Looking For Assistance?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Locate nearby ticketing counters, self-service kiosks, or contact commuter support.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('locations')}
              className="text-sm font-semibold text-[#316aa1] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View all MRT locations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ASSISTANCE_TILES.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() =>
                  onNavigate('locations', { assistanceCategory: tile.category })
                }
                className="group text-left bg-white border border-slate-200 hover:border-[#3f84c5] rounded-2xl p-5 transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="h-20 flex items-center justify-center bg-[#ebf2f9]/50 rounded-xl mb-3.5 p-2.5">
                    <ResilientImage
                      src={tile.image}
                      alt={tile.title}
                      fallbackLabel={tile.title}
                      className="max-h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-base font-bold text-[#142333] group-hover:text-[#316aa1] transition-colors">
                    {tile.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {tile.subtitle}
                  </p>
                </div>
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-[#316aa1]">
                  <span>Find locations</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Card & Charm Detail Modal */}
      {selectedDesign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c1a27]/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={selectedDesign.name}
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#3f84c5]">
                  {selectedDesign.badge}
                </p>
                <h3 className="text-xl font-bold text-[#142333] mt-0.5">
                  {selectedDesign.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDesign(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                aria-label="Close card design preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#ebf2f9]/65 rounded-xl p-4 flex items-center justify-center">
              {selectedDesign.videoUrl ? (
                <video
                  src={selectedDesign.videoUrl}
                  poster={selectedDesign.image}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-64 rounded-lg w-auto object-contain"
                />
              ) : (
                <ResilientImage
                  src={selectedDesign.image}
                  alt={selectedDesign.name}
                  fallbackLabel={selectedDesign.name}
                  className="max-h-56 w-auto object-contain"
                />
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedDesign.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="font-semibold text-[#142333] block mb-0.5">
                  Price / Pass Rate
                </span>
                <span className="text-[#316aa1] font-bold tabular-nums">
                  {selectedDesign.priceOrFee}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#142333] block mb-0.5">
                  Where to Purchase / Apply
                </span>
                <span className="text-slate-600">{selectedDesign.whereToBuy}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  const tab =
                    selectedDesign.category === 'concession'
                      ? 'concession'
                      : selectedDesign.category === 'charm'
                      ? 'charms'
                      : 'ezlink';
                  setSelectedDesign(null);
                  onNavigate('cards', { cardTab: tab });
                }}
                className="px-4 py-2 bg-[#316aa1] hover:bg-[#255582] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                View Full Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
