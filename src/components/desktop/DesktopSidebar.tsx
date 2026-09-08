import React from "react";
import { 
  Zap, 
  Clock, 
  MapPin, 
  Thermometer, 
  ShieldCheck, 
  TrendingDown, 
  Bot, 
  ArrowRight, 
  Phone, 
  CheckCircle2,
  Stethoscope,
  Sparkles
} from "lucide-react";
import { OrderTracking, CartItem } from "../../types";

interface DesktopSidebarProps {
  tracking: OrderTracking;
  cart: CartItem[];
  onNavigateTracking: () => void;
  onNavigateCheckout: () => void;
  onConsultAi: (prompt?: string) => void;
  onCallRider: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  tracking,
  cart = [],
  onNavigateTracking,
  onNavigateCheckout,
  onConsultAi,
  onCallRider,
}) => {
  const totalBrand = cart.reduce((acc, i) => acc + (i.medicine?.brandPrice || 0) * (i.quantity || 1), 0);
  const totalGeneric = cart.reduce(
    (acc, i) => acc + (i.isGeneric ? (i.medicine?.genericPrice || 0) : (i.medicine?.brandPrice || 0)) * (i.quantity || 1),
    0
  );
  const netSavings = totalBrand - totalGeneric;

  return (
    <div className="space-y-5 select-none">
      {/* 1. Live 45-Min Fast Dispatch Telemetry Widget */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </span>
            <span className="text-xs font-bold text-[#0b1c30]">Active Courier Telemetry</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Live 45m SLA
          </span>
        </div>

        {/* Mini Radar Map Box */}
        <div 
          onClick={onNavigateTracking}
          className="relative bg-[#131b2e] rounded-xl p-3 text-white overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#006a61] transition-all group"
        >
          <div className="flex justify-between items-start text-xs relative z-10">
            <div>
              <span className="text-[10px] text-[#86f2e4] font-mono uppercase tracking-wider">EV Dispatch en route</span>
              <div className="text-xl font-bold text-white mt-0.5">
                {tracking.etaMinutes} mins <span className="text-xs font-normal text-white/70">to doorstep</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/60">Handover OTP</span>
              <div className="text-base font-mono font-bold text-[#86f2e4]">{tracking.handoverOtp}</div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80 relative z-10">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-[#86f2e4]" />
              <span>Box: <strong className="text-white font-mono">{tracking.boxTemperatureCelsius}°C</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[#86f2e4] font-medium group-hover:underline">
              <span>View Full GPS Radar</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Courier Info */}
        <div className="flex items-center justify-between text-xs bg-[#f8f9ff] p-2.5 rounded-xl border border-[#eff4ff]">
          <div>
            <div className="font-bold text-[#0b1c30]">{tracking.riderName}</div>
            <div className="text-[10px] text-[#45464d]">{tracking.vehicle} • ★ {tracking.riderRating}</div>
          </div>
          <button
            type="button"
            onClick={onCallRider}
            className="p-2 rounded-lg bg-white border border-[#dce9ff] text-[#006a61] hover:bg-[#eff4ff] transition-colors cursor-pointer"
            title="Call Courier"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Clinical Arbitrage Savings Calculator */}
      <div className="bg-gradient-to-br from-[#131b2e] to-[#006a61] text-white rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#86f2e4] tracking-wider">
              Generic Cost Arbitrage
            </span>
            <div className="text-lg font-bold text-white mt-0.5">
              Save ₹{netSavings.toFixed(2)}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#86f2e4] text-[#00201d]">
            {totalBrand > 0 ? Math.round((netSavings / totalBrand) * 100) : 0}% Less
          </span>
        </div>

        <div className="space-y-1 text-xs text-white/80 border-t border-white/10 pt-2 font-mono">
          <div className="flex justify-between">
            <span className="text-white/60">Brand Innovator Cost:</span>
            <span className="line-through">₹{totalBrand.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-bold">
            <span className="text-[#86f2e4]">Bioequivalent Cost:</span>
            <span>₹{totalGeneric.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateCheckout}
          className="w-full py-2.5 rounded-xl bg-white text-[#00201d] text-xs font-bold hover:bg-[#eff4ff] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Proceed to 45m Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. On-Duty CDSCO Clinical Pharmacist Card */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0b1c30] flex items-center gap-1">
              <span>Dr. Ananya Iyer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[10px] text-[#45464d]">Reg #KA-PH-4921 • Apollo Hub #048</div>
          </div>
        </div>

        <p className="text-[11px] text-[#45464d] leading-relaxed">
          Available now to verify in-vitro bioequivalence, drug interactions, or doctor script clarifications.
        </p>

        <button
          type="button"
          onClick={() => onConsultAi("Can you verify the bioequivalence parity between innovator and generic for my prescription?")}
          className="w-full py-2 rounded-lg border border-[#006a61] text-[#006a61] hover:bg-[#eff4ff] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI &amp; Pharmacist</span>
        </button>
      </div>

      {/* 4. Compliance & Verification Seals */}
      <div className="bg-[#f8f9ff] rounded-xl p-3 border border-[#e5eeff] text-[11px] space-y-2 text-[#45464d]">
        <div className="font-bold text-[#0b1c30] flex items-center gap-1 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006a61]" /> CDSCO &amp; Jan Aushadhi Standards
        </div>
        <ul className="space-y-1 text-[10px] text-[#76777d]">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Schedule H1 &amp; Rule 65 Compliant</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>NABL ISO 17025 Batch Audited</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>2–8°C Thermal Sealed Pouch</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
