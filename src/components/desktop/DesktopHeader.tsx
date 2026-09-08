import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Activity, 
  Bot, 
  User, 
  SlidersHorizontal,
  Layers,
  Building2,
  AlertTriangle,
  Stethoscope,
  ChevronDown,
  X,
  Thermometer,
  Clock,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { TabType } from "../../types";

export interface DesktopHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount?: number;
  cartSavings?: number;
  onOpenCart: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  emergencyContactNumber?: string;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeTab = "discover",
  onTabChange,
  cartCount = 0,
  cartSavings = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  emergencyContactNumber = "+91 80 4912 8800",
}) => {
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);

  // Keyboard shortcut ⌘K or Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("desktop-global-search");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const primaryTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "discover", label: "Discover & Compare", icon: Search },
    { id: "rx_vault", label: "Rx Vault & OCR", icon: FileText },
    { id: "bioequivalence_studio", label: "Bioequivalence Studio", icon: Layers },
    { id: "tracking", label: "Live 45-Min Dispatch", icon: Activity, badge: "Active" },
    { id: "ai_pharmacist", label: "Clinical AI Pharmacist", icon: Bot },
    { id: "checkout", label: "Checkout", icon: Zap },
    { id: "health_vault", label: "Patient Vault", icon: User },
  ];

  const enterprisePortals: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: "clinical_reviewer", label: "Clinical Reviewer Workstation", icon: Stethoscope, desc: "CDSCO licensed triage & sign-off" },
    { id: "admin_ops", label: "Operations & Admin Center", icon: SlidersHorizontal, desc: "Hub dispatch SLA & exceptions" },
    { id: "exception_resolution", label: "Courier Exception Console", icon: AlertTriangle, desc: "Real-time rerouting & breakdown" },
    { id: "pharmacy_hub", label: "Apollo Hub #048 Packing Bay", icon: Building2, desc: "RFID bag packing & rider OTP" },
    { id: "architecture", label: "Platform Architecture", icon: ShieldCheck, desc: "Zero-trust CDSCO compliance spec" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dce9ff] shadow-xs select-none">
      {/* Top Clinical & Regulatory Status Bar (Desktop Website Style) */}
      <div className="bg-[#131b2e] text-[#eff4ff] text-xs py-1.5 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#86f2e4] text-[#00201d]">
              <Zap className="w-3 h-3 mr-1 fill-current" /> 45-MIN FAST DISPATCH GUARANTEED
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#eff4ff]/80">
              <Thermometer className="w-3 h-3 text-[#86f2e4]" />
              <span>Cold Chain: <strong className="text-white font-mono">4.2°C (Optimal)</strong></span>
            </div>
            <span className="text-white/30">•</span>
            <span className="text-[11px] text-[#eff4ff]/70">
              Fulfillment via CDSCO licensed Apollo Super Hub #048 (Indiranagar, BLR)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-[#86f2e4] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> WHO-GMP &amp; CDSCO Rule 65
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/80 flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#86f2e4]" /> 24/7 Clinical Desk: {emergencyContactNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Main Desktop Header Bar */}
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo & Subtitle */}
          <button 
            type="button"
            onClick={() => onTabChange("discover")}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006a61] to-[#131b2e] text-[#86f2e4] flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-mono tracking-tighter">G</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[#0b1c30]">Genmedi</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#eff4ff] text-[#006a61] border border-[#dce9ff]">
                  Clinical Website
                </span>
              </div>
              <p className="text-[11px] text-[#45464d] leading-none mt-0.5">
                Bioequivalent Generic Discovery &amp; 45-Min Fast Dispatch
              </p>
            </div>
          </button>

          {/* Expansive Desktop Search Bar with ⌘K */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="w-4 h-4 text-[#76777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="desktop-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                placeholder="Search by brand name, generic molecule (e.g. Augmentin, Metformin, Lipitor)..."
                className="w-full pl-10 pr-20 py-2.5 text-xs bg-[#eff4ff] hover:bg-[#e5eeff]/70 focus:bg-white border border-[#dce9ff] focus:border-[#006a61] rounded-xl transition-all focus:outline-hidden text-[#0b1c30] placeholder-[#76777d] shadow-2xs"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery?.("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#76777d] hover:text-[#0b1c30] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#45464d] border border-[#c6c6cd]">
                    ⌘K
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Live Hub Telemetry Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#eff4ff] border border-[#dce9ff] hover:border-[#006a61] transition-colors text-left cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#006a61]" />
              <div>
                <div className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span>Apollo Hub #048</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-[#006a61] font-medium">Indiranagar (1.4 km) • 14 Couriers</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#76777d] ml-1" />
            </button>

            {hubDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setHubDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#dce9ff] p-3 z-40 animate-in fade-in">
                  <div className="text-xs font-bold text-[#0b1c30] mb-1">Nearby Connected CDSCO Hubs</div>
                  <div className="text-[10px] text-[#45464d] mb-2">Automated geofenced dispatch routing:</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-[#eff4ff] border border-[#006a61] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#0b1c30]">Apollo Hub #048 (Active)</div>
                        <div className="text-[10px] text-[#45464d]">Indiranagar, BLR • 1.4 km away</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#006a61]">45-min SLA</span>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-[#f8f9ff] border border-transparent flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#0b1c30]">MedPlus Hub #112</div>
                        <div className="text-[10px] text-[#76777d]">Koramangala, BLR • 2.8 km away</div>
                      </div>
                      <span className="text-[10px] font-mono text-[#76777d]">55-min SLA</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Enterprise Portals Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPortalMenu(!showPortalMenu)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#c6c6cd] hover:border-[#006a61] bg-white text-[#0b1c30] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#006a61]" />
              <span>Operations Portals</span>
              <ChevronDown className="w-3 h-3 text-[#76777d]" />
            </button>

            {showPortalMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowPortalMenu(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#dce9ff] py-2 z-40 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-[#76777d] uppercase tracking-wider border-b border-[#eff4ff]">
                    Clinical Review &amp; Operations Stations
                  </div>
                  <div className="py-1">
                    {enterprisePortals.map((op) => {
                      const Icon = op.icon;
                      const isCur = activeTab === op.id;
                      return (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => {
                            onTabChange(op.id);
                            setShowPortalMenu(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-[#eff4ff] transition-colors cursor-pointer ${
                            isCur ? "bg-[#eff4ff] text-[#006a61]" : "text-[#0b1c30]"
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isCur ? "text-[#006a61]" : "text-[#76777d]"}`} />
                          <div>
                            <div className="text-xs font-bold">{op.label}</div>
                            <div className="text-[11px] text-[#45464d]">{op.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart Button with Savings Badge */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#006a61] text-white hover:bg-[#005049] transition-all shadow-xs cursor-pointer group"
          >
            <ShoppingCart className="w-4 h-4" />
            <div className="text-left text-xs">
              <div className="font-bold flex items-center gap-1.5">
                <span>Cart ({cartCount})</span>
                {cartSavings > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#86f2e4] text-[#00201d]">
                    Save ₹{cartSavings.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Secondary Desktop Horizontal Navigation Bar */}
        <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-[#f0f4ff]">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#006a61] text-white shadow-xs"
                    : "text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? "bg-[#86f2e4] text-[#00201d]" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
