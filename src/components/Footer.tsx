import { ScreenId, SIMPLYGO_ASSETS } from '../data/simplygoData';
import { ResilientImage } from './ResilientImage';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0c1a27] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="inline-block bg-white rounded-lg px-3 py-1.5">
              <ResilientImage
                src={SIMPLYGO_ASSETS.logo}
                alt="SimplyGo"
                fallbackLabel="SimplyGo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Simplifying journeys and creating value across Singapore’s public transport ticketing, concession cards, and motoring services.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cards')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Travel & Concession Cards
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('app')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  SimplyGo App Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fare Calculator & e-Services
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Commuter Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('locations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  SimplyGo Ticket Offices
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('locations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ticketing Service Centres
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('locations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Self-Help Ticketing Machines
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('locations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Centre (1800-2255-663)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Download SimplyGo</h3>
            <p className="text-sm text-slate-400 mb-4">
              Available on iOS and Android devices with NFC card reading and Singpass MyInfo support.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=sg.com.transitlink.tlapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                <ResilientImage
                  src={SIMPLYGO_ASSETS.playStore}
                  alt="Get it on Google Play"
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
                  alt="Download on the App Store"
                  className="h-10 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SimplyGo Pte. Ltd. · Singapore Public Transport Ticketing & Motoring</p>
          <div className="flex items-center gap-3">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Use</span>
            <span aria-hidden="true">·</span>
            <span>Customer Service Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
