import { useState } from 'react';
import { MapPin, Clock, Phone, Send, CheckCircle2 } from 'lucide-react';
import {
  ASSISTANCE_TILES,
  AssistanceCategory,
  SERVICE_LOCATIONS,
} from '../data/simplygoData';

interface LocationsViewProps {
  initialCategory: AssistanceCategory;
}

const CATEGORY_FILTERS: { id: AssistanceCategory; label: string }[] = [
  { id: 'all', label: 'All Locations' },
  { id: 'ticket-office', label: 'Ticket Offices' },
  { id: 'service-centre', label: 'Service Centres' },
  { id: 'kiosk', label: 'Self-Help Kiosks' },
  { id: 'contact', label: 'Contact Centre' },
];

export function LocationsView({ initialCategory }: LocationsViewProps) {
  const [category, setCategory] = useState<AssistanceCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const visibleLocations = SERVICE_LOCATIONS.filter((loc) => {
    const matchesCat =
      category === 'all' || category === 'contact' || loc.category === category;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.station.toLowerCase().includes(q) ||
      loc.region.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName.trim() || !enquiryEmail.trim() || !enquiryMessage.trim()) {
      return;
    }
    setEnquirySubmitted(true);
  };

  return (
    <section className="py-12 lg:py-16 bg-white min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#3f84c5]">
              Islandwide Commuter Support
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#142333] mt-1">
              Locations & Assistance Centres
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Locate SimplyGo Ticket Offices, Ticketing Service Centres, and Self-Help Ticketing Machines across Singapore.
            </p>
          </div>

          <div className="w-full lg:w-80">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MRT station or region..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#316aa1]"
              aria-label="Search MRT station or region"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#ebf2f9]/70 p-2 rounded-xl border border-slate-200/80">
          {CATEGORY_FILTERS.map((tab) => {
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#316aa1] text-white'
                    : 'text-slate-700 hover:bg-white hover:text-[#316aa1]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {category === 'contact' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-[#ebf2f9] rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-2xl font-bold text-[#142333]">
                SimplyGo Contact Centre
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our commuter care specialists assist with card replacements, fare adjustments, Auto Top-Up enquiries, and concession card eligibility.
              </p>
              <div className="space-y-3 pt-2 text-sm text-[#142333]">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#316aa1] shrink-0" />
                  <span className="font-semibold tabular-nums">
                    1800-2255-663 (Toll-free in Singapore)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#316aa1] shrink-0" />
                  <span>Daily · 8:00 AM – 6:00 PM (Except Public Holidays)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-6 sm:p-8">
              {enquirySubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Enquiry Received</span>
                  </div>
                  <p className="text-sm text-emerald-900">
                    Thank you, {enquiryName}. A SimplyGo support officer will respond to {enquiryEmail} within 3 working days.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEnquirySubmitted(false);
                      setEnquiryMessage('');
                    }}
                    className="px-4 py-2 bg-white border border-emerald-300 text-emerald-900 text-sm font-semibold rounded-lg cursor-pointer"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#142333]">
                    Online Enquiry Form
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#142333] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        placeholder="Chua Jia Yu"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#316aa1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#142333] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={enquiryEmail}
                        onChange={(e) => setEnquiryEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#316aa1]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#142333] mb-1">
                      How can we help?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="Describe your card enquiry or fare feedback..."
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#316aa1]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#316aa1] hover:bg-[#255582] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleLocations.length === 0 ? (
              <div className="md:col-span-2 p-10 text-center border border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-base font-semibold text-[#142333]">
                  No service locations matched "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCategory('all');
                  }}
                  className="mt-3 px-4 py-2 bg-[#316aa1] text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              visibleLocations.map((loc) => {
                const tileMeta = ASSISTANCE_TILES.find(
                  (t) => t.category === loc.category
                );
                return (
                  <div
                    key={loc.id}
                    className="border border-slate-200 rounded-2xl p-6 flex flex-col justify-between bg-white"
                  >
                    <div>
                      <p className="text-xs font-medium text-[#3f84c5]">
                        {tileMeta?.title} · {loc.region} Region
                      </p>
                      <h2 className="text-xl font-bold text-[#142333] mt-1">
                        {loc.name}
                      </h2>

                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-[#316aa1] shrink-0 mt-0.5" />
                          <span>
                            {loc.station} — {loc.address}
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-4 h-4 text-[#316aa1] shrink-0 mt-0.5" />
                          <span className="tabular-nums">{loc.hours}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-[#142333]">
                        Available Services:{' '}
                      </span>
                      {loc.services.join(' · ')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
