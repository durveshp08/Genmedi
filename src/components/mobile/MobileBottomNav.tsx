import React from "react";
import { Search, FileText, Zap, Bot, ShoppingCart, Layers } from "lucide-react";
import { TabType } from "../../types";

interface MobileBottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; hasDot?: boolean }[] = [
    { id: "discover", label: "Discover", icon: Search },
    { id: "rx_vault", label: "Rx Vault", icon: FileText },
    { id: "tracking", label: "45m GPS", icon: Zap, hasDot: true },
    { id: "ai_pharmacist", label: "AI Help", icon: Bot },
    { id: "checkout", label: "Cart", icon: ShoppingCart, badge: cartCount > 0 ? `${cartCount}` : undefined },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#dce9ff] py-1.5 px-2 shadow-lg select-none pb-safe"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative cursor-pointer min-h-[48px] ${
                isActive
                  ? "text-[#006a61] font-bold"
                  : "text-[#76777d] hover:text-[#0b1c30]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"}`} />
                
                {item.hasDot && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                )}

                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#ba1a1a] text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none">{item.label}</span>
              {isActive && (
                <span className="w-4 h-0.5 rounded-full bg-[#006a61] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
