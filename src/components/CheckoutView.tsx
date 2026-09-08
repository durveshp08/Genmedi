import React, { useState } from "react";
import { 
  Zap, 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  TrendingDown, 
  MapPin, 
  User,
  Plus,
  Minus,
  Trash2
} from "lucide-react";
import { CartItem } from "../types";

const defaultFallbackItems: CartItem[] = [
  {
    medicine: {
      id: "med-1",
      brandName: "Augmentin 625 Duo",
      brandManufacturer: "GlaxoSmithKline",
      brandPrice: 204.0,
      genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg",
      genericManufacturer: "Cipla (WHO-GMP)",
      genericPrice: 64.2,
      dosage: "625mg (500mg + 125mg)",
      therapeuticClass: "Antibiotics / Beta-Lactam",
      indication: "Sinusitis",
      bioIndex: 99.8,
      savingsPercent: 68,
      inStock: true,
      whoGmpCertified: true,
      nablAudited: true,
      cdscoApproved: true,
      dissolutionTimeMinutes: 14.5,
      aucRatio: 99.82,
      cmaxRatio: 1.004,
      allergenFlags: ["Penicillin"],
    },
    quantity: 1,
    isGeneric: true,
  },
  {
    medicine: {
      id: "med-2",
      brandName: "Pan-D Capsule",
      brandManufacturer: "Alkem Laboratories",
      brandPrice: 168.0,
      genericName: "Pantoprazole 40mg + Domperidone 30mg SR",
      genericManufacturer: "Mankind Pharma",
      genericPrice: 42.5,
      dosage: "40mg + 30mg SR",
      therapeuticClass: "Gastrointestinal",
      indication: "GERD",
      bioIndex: 99.4,
      savingsPercent: 75,
      inStock: true,
      whoGmpCertified: true,
      nablAudited: true,
      cdscoApproved: true,
      dissolutionTimeMinutes: 18.0,
      aucRatio: 99.35,
      cmaxRatio: 0.998,
    },
    quantity: 1,
    isGeneric: true,
  },
  {
    medicine: {
      id: "med-3",
      brandName: "Allegra 120mg",
      brandManufacturer: "Sanofi India",
      brandPrice: 198.5,
      genericName: "Fexofenadine Hydrochloride 120mg",
      genericManufacturer: "Sun Pharma",
      genericPrice: 58.0,
      dosage: "120mg",
      therapeuticClass: "Antihistamine",
      indication: "Allergic rhinitis",
      bioIndex: 99.6,
      savingsPercent: 71,
      inStock: true,
      whoGmpCertified: true,
      nablAudited: true,
      cdscoApproved: true,
      dissolutionTimeMinutes: 12.0,
      aucRatio: 99.64,
      cmaxRatio: 1.002,
    },
    quantity: 1,
    isGeneric: true,
  },
];

export interface CheckoutViewProps {
  cart?: CartItem[];
  onPlaceOrder?: (speed: "fast_45" | "standard") => void;
  onUpdateQuantity?: (medId: string, qty: number) => void;
  onOpenAllergyHelp?: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart = [],
  onPlaceOrder,
  onUpdateQuantity,
  onOpenAllergyHelp,
}) => {
  const [deliverySpeed, setDeliverySpeed] = useState<"fast_45" | "standard">("fast_45");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [allergyAcknowledged, setAllergyAcknowledged] = useState(false);

  // If cart is empty, provide default Rx items so user can experience checkout immediately
  const items = Array.isArray(cart) && cart.length > 0 ? cart : defaultFallbackItems;

  const totalBrand = items.reduce((acc, i) => acc + (i.medicine?.brandPrice || 0) * (i.quantity || 1), 0);
  const totalGeneric = items.reduce(
    (acc, i) => acc + (i.isGeneric ? (i.medicine?.genericPrice || 0) : (i.medicine?.brandPrice || 0)) * (i.quantity || 1), 
    0
  );
  const netSavings = totalBrand - totalGeneric;
  const deliveryFee = deliverySpeed === "fast_45" ? 39.0 : 0.0;
  const grandTotal = totalGeneric + deliveryFee;

  const hasPenicillin = items.some(
    (i) => i.medicine?.allergenFlags?.includes("Penicillin") || (i.medicine?.brandName || "").includes("Augmentin")
  );

  return (
    <div className="space-y-6 pb-24 sm:pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#eff4ff] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30]">Clinical Checkout &amp; Dispatch Speed</h2>
          <p className="text-xs text-[#45464d]">Fulfillment via Apollo Super Hub #048 • Indiranagar, Bengaluru</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-[#006a61] bg-[#eff4ff] px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5" /> CDSCO Schedule H1 Validated
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Speed selection, Item review, Patient allergy check */}
        <div className="lg:col-span-7 space-y-5">
          {/* Dispatch Speed Selector */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#006a61]" /> Select Delivery Speed
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 45-Min Fast Dispatch Option */}
              <div
                onClick={() => setDeliverySpeed("fast_45")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 relative ${
                  deliverySpeed === "fast_45"
                    ? "border-[#006a61] bg-[#eff4ff] shadow-xs"
                    : "border-[#e5eeff] hover:border-[#c6c6cd]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-md bg-[#006a61] text-white">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </span>
                    <span className="font-bold text-xs text-[#0b1c30]">45-Minute Fast Dispatch</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#006a61]">₹39.00</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Dedicated electric vehicle courier, 2–8°C thermal pod, tamper-evident barcoded pouch.
                </p>
                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold inline-block">
                  Guaranteed SLA: 45 Mins
                </div>
              </div>

              {/* Standard Delivery Option */}
              <div
                onClick={() => setDeliverySpeed("standard")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 relative ${
                  deliverySpeed === "standard"
                    ? "border-[#006a61] bg-[#eff4ff] shadow-xs"
                    : "border-[#e5eeff] hover:border-[#c6c6cd]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-md bg-slate-700 text-white">
                      <Truck className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-bold text-xs text-[#0b1c30]">Standard Delivery</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700">FREE</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Dispatched within 3-4 hours via pooled pharmacy routes.
                </p>
                <div className="text-[10px] text-[#76777d] bg-slate-100 px-2 py-0.5 rounded font-mono inline-block">
                  SLA: ~4 Hours
                </div>
              </div>
            </div>
          </div>

          {/* Allergy Cross-Check Alert Banner */}
          {hasPenicillin && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    Active Clinical Warning: Patient Penicillin Allergy Profile
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Patient <strong>Rahul Verma</strong> has a flagged history of Beta-Lactam / Penicillin hypersensitivity. 
                    Amoxyclav 625 contains Amoxicillin Trihydrate (penicillin ring).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-amber-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-amber-950 font-medium">
                  <input
                    type="checkbox"
                    checked={allergyAcknowledged}
                    onChange={(e) => setAllergyAcknowledged(e.target.checked)}
                    className="w-4 h-4 rounded text-[#006a61] focus:ring-[#006a61]"
                  />
                  <span>Physician reviewed; patient cleared for prescribed dose</span>
                </label>

                <button
                  type="button"
                  onClick={onOpenAllergyHelp}
                  className="text-xs font-bold text-[#006a61] underline cursor-pointer"
                >
                  Consult AI Pharmacist on Alternatives
                </button>
              </div>
            </div>
          )}

          {/* Itemized Order Breakdown */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0b1c30]">Prescribed &amp; Substituted Items ({items.length})</h3>
              <span className="text-xs text-[#006a61] font-mono font-bold">100% Bio-Parity</span>
            </div>

            <div className="divide-y divide-[#eff4ff]">
              {items.map((item, idx) => {
                const med = item.medicine;
                const price = item.isGeneric ? med.genericPrice : med.brandPrice;
                const origPrice = med.brandPrice;
                return (
                  <div key={med.id || idx} className="py-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0b1c30]">
                          {item.isGeneric ? med.genericName : med.brandName}
                        </span>
                        {item.isGeneric && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-[#86f2e4] text-[#00201d]">
                            GENERIC
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#45464d]">{med.dosage} • {item.isGeneric ? med.genericManufacturer : med.brandManufacturer}</p>
                      {item.isGeneric && (
                        <p className="text-[10px] text-[#76777d]">
                          Innovator: {med.brandName} (₹{origPrice.toFixed(2)})
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#dce9ff] rounded-lg bg-[#eff4ff]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity?.(med.id, Math.max(0, item.quantity - 1))}
                          className="px-2 py-1 text-xs text-[#45464d] hover:text-[#0b1c30] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#0b1c30]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity?.(med.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs text-[#45464d] hover:text-[#0b1c30] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right w-16">
                        <div className="text-xs font-bold text-[#006a61]">
                          ₹{(price * item.quantity).toFixed(2)}
                        </div>
                        {item.isGeneric && (
                          <span className="text-[10px] text-[#76777d] line-through">
                            ₹{(origPrice * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Cost Summary, Delivery Address, Payment & Final CTA */}
        <div className="lg:col-span-5 space-y-5">
          {/* Cost Arbitrage Summary Box */}
          <div className="bg-[#131b2e] text-white rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#86f2e4]">
                  Clinical Cost Arbitrage
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Order Total</h3>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#86f2e4] text-[#00201d]">
                  Save ₹{netSavings.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-white/80 border-t border-white/10 pt-3">
              <div className="flex justify-between">
                <span>Total Innovator Brand Cost:</span>
                <span className="line-through font-mono">₹{totalBrand.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-medium">
                <span>Bioequivalent Generic Cost:</span>
                <span className="font-mono text-[#86f2e4]">₹{totalGeneric.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>45-Min Fast Dispatch Pod:</span>
                <span className="font-mono">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                <span>Final Payable Amount:</span>
                <span className="font-mono text-lg text-[#86f2e4]">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[10px] text-white/60 leading-tight">
              Includes CDSCO pharmacist sign-off fee, cold-chain monitoring, and GST.
            </p>
          </div>

          {/* Delivery Address & Contact */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#006a61]" /> Delivery Destination
              </h4>
              <span className="text-[10px] text-[#006a61] font-medium">Auto-detected</span>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-xl text-xs space-y-1 border border-[#e5eeff]">
              <div className="font-bold text-[#0b1c30]">Rahul Verma (+91 98450 19283)</div>
              <p className="text-[#45464d]">Flat 402, Prestige Oasis, 4th Block Koramangala, Bengaluru 560034</p>
              <span className="text-[10px] text-[#76777d] font-mono">1.4 km from Apollo Hub #048 (Indiranagar)</span>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#0b1c30]">Payment Method</h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "upi"
                    ? "border-[#006a61] bg-[#eff4ff] text-[#006a61]"
                    : "border-[#e5eeff] text-[#45464d] hover:bg-[#f8f9ff]"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Instant UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-[#006a61] bg-[#eff4ff] text-[#006a61]"
                    : "border-[#e5eeff] text-[#45464d] hover:bg-[#f8f9ff]"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card / Net</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-[#006a61] bg-[#eff4ff] text-[#006a61]"
                    : "border-[#e5eeff] text-[#45464d] hover:bg-[#f8f9ff]"
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* Confirm & Place Order CTA */}
          <button
            type="button"
            disabled={hasPenicillin && !allergyAcknowledged}
            onClick={() => onPlaceOrder?.(deliverySpeed)}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
              hasPenicillin && !allergyAcknowledged
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-[#006a61] hover:bg-[#005049] text-white"
            }`}
          >
            <span>Confirm &amp; Dispatch in 45 Minutes (₹{grandTotal.toFixed(2)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {hasPenicillin && !allergyAcknowledged && (
            <p className="text-[10px] text-amber-700 text-center">
              Please check the allergy clearance box above to proceed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
