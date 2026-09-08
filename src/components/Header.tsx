import React, { useState } from "react";
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
  X
} from "lucide-react";
import { TabType } from "../types";

export interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount?: number;
  onOpenCart: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  emergencyContactNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = "discover",
  onTabChange,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  emergencyContactNumber = "+91 80 4912 8800",
}) => {
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const consumerTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "discover", label: "Discover & Compare", icon: Search },
    { id: "rx_vault", label: "Rx Vault & OCR", icon: FileText },
    { id: "checkout", label: "Checkout", icon: Zap },
    { id: "tracking", label: "Live 45-Min GPS", icon: Activity, badge: "18 min" },
    { id: "ai_pharmacist", label: "AI Pharmacist", icon: Bot },
    { id: "health_vault", label: "Health Vault", icon: User },
  ];

  const operationsTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: "clinical_reviewer", label: "Clinical Reviewer Workstation", icon: Stethoscope, desc: "Triage & PKI sign-off" },
    { id: "admin_ops", label: "Operations & Admin", icon: SlidersHorizontal, desc: "1,842 orders & SLA metrics" },
    { id: "bioequivalence_studio", label: "Bioequivalence Studio", icon: Layers, desc: "In-vitro dissolution assays" },
    { id: "exception_resolution", label: "Order Exceptions Console", icon: AlertTriangle, desc: "Live dispatch breakdown triage" },
    { id: "pharmacy_hub", label: "Apollo Hub #048 Bay", icon: Building2, desc: "Live packing & rider OTP" },
    { id: "architecture", label: "System Architecture", icon: ShieldCheck, desc: "Enterprise infrastructure" },
  ];

  const isOpsActive = operationsTabs.some((t) => t.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5eeff] shadow-xs">
      {/* Top Banner */}
      <div className="bg-[#131b2e] text-[#eff4ff] text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#86f2e4] text-[#00201d]">
              <Zap className="w-3 h-3 mr-1 fill-current" /> 45-MIN GUARANTEED
            </span>
            <span className="text-[#eff4ff]/90 text-[11px] sm:text-xs truncate max-w-[280px] sm:max-w-none">
              Live Apollo Hub #048 Dispatch active • CDSCO &amp; WHO-GMP Verified
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-[#86f2e4] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> CDSCO Schedule H1
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/80">Support: {emergencyContactNumber}</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
          {/* Logo */}
          <button 
            type="button"
            onClick={() => onTabChange("discover")}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-hidden shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#006a61] to-[#131b2e] text-[#86f2e4] flex items-center justify-center font-bold text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-mono tracking-tighter">G</span>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-[#0b1c30]">Genmedi</span>
                <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold uppercase rounded bg-[#eff4ff] text-[#006a61] border border-[#dce9ff]">
                  Clinical
                </span>
              </div>
              <p className="text-[10px] text-[#45464d] leading-none hidden sm:block">Bioequivalent Generic Discovery</p>
            </div>
          </button>

          {/* Search Bar - Desktop & Tablet */}
          <div className="hidden sm:block flex-1 max-w-lg relative">
            <div className="relative">
              <Search className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                placeholder="Search brand, molecule (e.g. Augmentin 625, Metformin, Lipitor)..."
                className="w-full pl-9 pr-14 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#eff4ff] hover:bg-[#e5eeff]/70 focus:bg-white border border-transparent focus:border-[#006a61] rounded-xl transition-all focus:outline-hidden text-[#0b1c30] placeholder-[#76777d]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery?.("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#76777d] hover:text-[#0b1c30]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#45464d] border border-[#c6c6cd] hidden lg:inline">
                  ⌘K
                </span>
              )}
            </div>
          </div>

          {/* Location & Speed Tag - Tablet & Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-xs shrink-0">
            <MapPin className="w-4 h-4 text-[#006a61]" />
            <div>
              <div className="font-medium text-[#0b1c30] flex items-center gap-1">
                <span>Indiranagar, BLR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] text-[#006a61] font-medium">45-min Hub #048 (1.4 km)</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 text-[#45464d] hover:bg-[#eff4ff] rounded-xl border border-transparent"
              title="Search medicines"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Enterprise Portal Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPortalMenu(!showPortalMenu)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  isOpsActive
                    ? "bg-[#131b2e] text-[#86f2e4] border-[#131b2e]"
                    : "bg-white text-[#45464d] border-[#c6c6cd] hover:border-[#006a61]"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Portals</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showPortalMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowPortalMenu(false)} 
                  />
                  <div 
                    className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-[#e5eeff] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#76777d] uppercase tracking-wider border-b border-[#eff4ff]">
                      Clinical &amp; Operations Workstations
                    </div>
                    <div className="py-1 max-h-[70vh] overflow-y-auto">
                      {operationsTabs.map((op) => {
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
                            className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-[#eff4ff] transition-colors cursor-pointer ${
                              isCur ? "bg-[#eff4ff] text-[#006a61]" : "text-[#0b1c30]"
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isCur ? "text-[#006a61]" : "text-[#76777d]"}`} />
                            <div>
                              <div className="text-xs font-semibold">{op.label}</div>
                              <div className="text-[10px] text-[#45464d]">{op.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl border border-transparent hover:border-[#dce9ff] transition-all cursor-pointer"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#006a61]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#006a61] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-[#f0f4ff]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                placeholder="Search brand, molecule (e.g. Augmentin)..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-[#eff4ff] border border-transparent focus:border-[#006a61] rounded-xl text-[#0b1c30]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery?.("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#76777d]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-1 mt-2 sm:mt-3 overflow-x-auto pb-1 scrollbar-none border-t border-[#f0f4ff] pt-2">
          {consumerTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#006a61] text-white shadow-xs"
                    : "text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
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

      {/* Mobile Bottom Fixed Nav Bar for Seamless Mobile Experience */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#dce9ff] px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => onTabChange("discover")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === "discover" ? "text-[#006a61] font-bold" : "text-[#76777d]"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Discover</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange("rx_vault")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === "rx_vault" ? "text-[#006a61] font-bold" : "text-[#76777d]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Rx Vault</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange("tracking")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium relative transition-colors ${
            activeTab === "tracking" ? "text-[#006a61] font-bold" : "text-[#76777d]"
          }`}
        >
          <div className="relative">
            <Activity className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span>45m GPS</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange("ai_pharmacist")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === "ai_pharmacist" ? "text-[#006a61] font-bold" : "text-[#76777d]"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Help</span>
        </button>
        <button
          type="button"
          onClick={onOpenCart}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium relative transition-colors ${
            activeTab === "checkout" ? "text-[#006a61] font-bold" : "text-[#76777d]"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-[#006a61] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </div>
    </header>
  );
};
