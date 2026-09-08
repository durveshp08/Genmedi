import React, { useState } from "react";
import { 
  MapPin, 
  Search, 
  Phone, 
  ShoppingCart, 
  X, 
  ChevronDown, 
  Sparkles,
  SlidersHorizontal,
  Building2,
  Stethoscope,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { TabType } from "../../types";

interface MobileHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  emergencyContactNumber?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  emergencyContactNumber = "+91 80 4912 8800",
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const portals: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "clinical_reviewer", label: "Clinical Reviewer", icon: Stethoscope },
    { id: "admin_ops", label: "Ops & Admin Hub", icon: SlidersHorizontal },
    { id: "exception_resolution", label: "Exception Triage", icon: AlertTriangle },
    { id: "pharmacy_hub", label: "Hub #048 Packing", icon: Building2 },
    { id: "architecture", label: "CDSCO Architecture", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dce9ff] shadow-2xs select-none">
      {/* Top Location & Urgent Delivery Beacon */}
      <div className="bg-[#131b2e] text-[#eff4ff] px-3.5 py-1.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-[#86f2e4] animate-ping shrink-0"></span>
          <span className="font-semibold text-white truncate">Apollo Hub #048</span>
          <span className="text-white/60">• Indiranagar (1.4 km)</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-1.5 py-0.2 rounded bg-[#006a61] text-[#86f2e4] font-mono text-[10px] font-bold">
            45m SLA
          </span>
          <a
            href={`tel:${emergencyContactNumber}`}
            className="text-white/80 hover:text-white p-1"
            title="Call Clinical Desk"
          >
            <Phone className="w-3 h-3 text-[#86f2e4]" />
          </a>
        </div>
      </div>

      {/* Main Mobile App Bar */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onTabChange("discover")}
          className="flex items-center gap-2 text-left focus:outline-hidden cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#006a61] text-[#86f2e4] flex items-center justify-center font-bold text-base shadow-xs">
            G
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-base text-[#0b1c30] tracking-tight">Genmedi</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#86f2e4] text-[#00201d]">
                App
              </span>
            </div>
            <span className="text-[10px] text-[#45464d]">Bioequivalence &amp; 45m</span>
          </div>
        </button>

        {/* Right Actions: Search Trigger, Portals Toggle, Cart */}
        <div className="flex items-center gap-1.5">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              searchOpen || searchQuery
                ? "bg-[#006a61] text-white"
                : "bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]"
            }`}
            title="Search Medicines"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Portals Sheet Trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] transition-colors cursor-pointer"
            title="Clinical & Ops Portals"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#006a61]" />
          </button>

          {/* Quick Cart Pill */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006a61] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input for Mobile/Tablet */}
      {searchOpen && (
        <div className="px-3.5 pb-3 pt-1 border-t border-[#eff4ff] bg-[#f8f9ff] animate-in fade-in slide-in-from-top-1">
          <div className="relative">
            <Search className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand or generic molecule..."
              className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-[#dce9ff] focus:border-[#006a61] rounded-xl text-[#0b1c30] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#76777d]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Portals Dropdown Drawer for Mobile */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-3 top-16 w-64 bg-white rounded-2xl shadow-2xl border border-[#dce9ff] p-3 z-50 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <span className="text-xs font-bold text-[#0b1c30]">Clinical &amp; Hub Portals</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1 text-[#76777d] hover:text-[#0b1c30]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 space-y-1">
              {portals.map((p) => {
                const Icon = p.icon;
                const isSelected = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onTabChange(p.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#006a61] text-white font-bold"
                        : "hover:bg-[#eff4ff] text-[#0b1c30]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
