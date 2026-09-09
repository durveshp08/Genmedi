import React, { useState } from "react";
import { 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Building2, 
  TrendingDown, 
  FlaskConical,
  Award,
  AlertCircle
} from "lucide-react";
import { Medicine, StockistHub } from "../types";

const sampleDefault: Medicine = {
  id: "med-1",
  brandName: "Augmentin 625 Duo",
  brandManufacturer: "GlaxoSmithKline",
  brandPrice: 204.0,
  genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg",
  genericManufacturer: "Cipla (WHO-GMP)",
  genericPrice: 64.2,
  dosage: "625mg",
  therapeuticClass: "Antibiotics / Beta-Lactam",
  indication: "Sinusitis, bacterial infections",
  bioIndex: 99.8,
  savingsPercent: 68,
  inStock: true,
  whoGmpCertified: true,
  nablAudited: true,
  cdscoApproved: true,
  dissolutionTimeMinutes: 14.5,
  aucRatio: 99.82,
  cmaxRatio: 1.004,
  allergenFlags: ["Penicillin", "Beta-Lactam"],
};

export interface DiscoverViewProps {
  medicines: Medicine[];
  stockists?: StockistHub[];
  onAddToCart: (medicine: Medicine, isGeneric: boolean) => void;
  onConsultAi?: (medicine: Medicine) => void;
  onViewDissolution?: (medicine: Medicine) => void;
  onUploadRxClick?: () => void;
  searchQuery?: string;
  onSelectMedicine?: (medicine: Medicine) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  medicines = [],
  stockists = [],
  onAddToCart,
  onConsultAi,
  onViewDissolution,
  onUploadRxClick,
  searchQuery = "",
  onSelectMedicine,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const defaultMed = (Array.isArray(medicines) && medicines.length > 0) ? medicines[0] : sampleDefault;
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine>(defaultMed);

  const categories = [
    "All",
    "Antibiotics",
    "Cardiovascular",
    "Antidiabetic",
    "Gastrointestinal",
    "Antihistamine",
  ];

  const query = (searchQuery || "").trim().toLowerCase();
  const safeMedicines = Array.isArray(medicines) && medicines.length > 0 ? medicines : [sampleDefault];

  const filteredMedicines = safeMedicines.filter((m) => {
    const matchesSearch = 
      !query ||
      (m.brandName && m.brandName.toLowerCase().includes(query)) ||
      (m.genericName && m.genericName.toLowerCase().includes(query)) ||
      (m.indication && m.indication.toLowerCase().includes(query)) ||
      (m.therapeuticClass && m.therapeuticClass.toLowerCase().includes(query));
    
    const matchesCategory = 
      selectedCategory === "All" || 
      (m.therapeuticClass && m.therapeuticClass.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const activeDisplayMed = selectedMedicine || safeMedicines[0] || sampleDefault;

  return (
    <div className="space-y-6 pb-20 sm:pb-16">
      {/* 45-Min Fast Dispatch Live Banner */}
      <div className="bg-gradient-to-r from-[#131b2e] via-[#1b253b] to-[#006a61] rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#86f2e4]/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#86f2e4] text-[#00201d] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" /> 45-MIN FAST DISPATCH
              </span>
              <span className="text-xs text-[#86f2e4] font-mono">Hub #048 Indiranagar (1.4 km)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Identical Molecular Bioequivalence, Guaranteed In 45 Minutes.
            </h2>
            <p className="text-xs text-white/80 leading-relaxed">
              Every generic batch is verified against innovator dissolution assays. Save up to 87% with zero clinical compromise under CDSCO licensed pharmacist sign-off.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onUploadRxClick}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white text-[#0b1c30] text-xs font-bold hover:bg-[#eff4ff] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Upload Prescription</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="hidden sm:flex flex-col text-right font-mono text-[11px] text-white/70">
              <span className="text-[#86f2e4] font-bold">14 Couriers Active</span>
              <span>Avg SLA: 38 mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#006a61] text-white shadow-xs"
                : "bg-white text-[#45464d] border border-[#dce9ff] hover:bg-[#eff4ff]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clinical Parity Matrix (Featured Side-by-Side Comparison) */}
      {activeDisplayMed && (
        <div className="bg-white rounded-2xl border border-[#dce9ff] shadow-sm overflow-hidden">
          {/* Header of Parity Matrix */}
          <div className="bg-[#eff4ff] px-4 sm:px-5 py-3.5 border-b border-[#dce9ff] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#006a61] text-white">
                <FlaskConical className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#0b1c30]">Clinical Parity &amp; Bioequivalence Matrix</h3>
                <p className="text-[11px] text-[#45464d]">CDSCO &amp; WHO-GMP In-Vitro / In-Vivo Pharmacokinetic Comparison</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#86f2e4]/30 text-[#006a61] border border-[#86f2e4]">
                Bio-Parity Index: {activeDisplayMed.bioIndex}%
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-5 sm:space-y-6">
            {/* Side-by-side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prescribed Brand */}
              <div className="rounded-xl p-4 bg-[#f8f9ff] border border-[#c6c6cd]/50 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#76777d]">Prescribed Innovator Brand</span>
                    <h4 className="text-base font-bold text-[#0b1c30]">{activeDisplayMed.brandName}</h4>
                    <p className="text-xs text-[#45464d]">{activeDisplayMed.brandManufacturer}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#0b1c30]">₹{activeDisplayMed.brandPrice.toFixed(2)}</div>
                    <span className="text-[10px] text-[#76777d]">Strip of 10</span>
                  </div>
                </div>

                <div className="text-xs text-[#45464d] space-y-1 pt-2 border-t border-[#dce9ff]">
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Active Drug (API):</span>
                    <span className="font-medium text-[#0b1c30]">{activeDisplayMed.genericName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Therapeutic Class:</span>
                    <span className="font-medium text-[#0b1c30]">{activeDisplayMed.therapeuticClass}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(activeDisplayMed, false)}
                  className="w-full py-2 rounded-lg border border-[#c6c6cd] text-xs font-semibold text-[#45464d] hover:bg-white transition-colors cursor-pointer"
                >
                  Add Brand (₹{activeDisplayMed.brandPrice.toFixed(2)})
                </button>
              </div>

              {/* Genmedi Bioequivalent Generic */}
              <div className="rounded-xl p-4 bg-[#eff4ff] border-2 border-[#006a61] space-y-3 relative shadow-xs">
                <div className="sm:absolute -top-3 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#006a61] text-white flex items-center gap-1 shadow-xs inline-flex mb-1 sm:mb-0">
                  <TrendingDown className="w-3 h-3" /> SAVE {activeDisplayMed.savingsPercent}% (₹{(activeDisplayMed.brandPrice - activeDisplayMed.genericPrice).toFixed(2)})
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a61]">Genmedi Verified Bioequivalent</span>
                    <h4 className="text-base font-bold text-[#0b1c30]">{activeDisplayMed.genericName}</h4>
                    <p className="text-xs text-[#006a61] font-medium">{activeDisplayMed.genericManufacturer}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#006a61]">₹{activeDisplayMed.genericPrice.toFixed(2)}</div>
                    <span className="text-[10px] text-[#45464d]">Strip of 10</span>
                  </div>
                </div>

                {/* Parity Bar */}
                <div className="space-y-1 pt-2 border-t border-[#dce9ff]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#45464d] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#006a61]" /> Pharmacokinetic Equivalence:
                    </span>
                    <span className="font-bold text-[#006a61] font-mono">{activeDisplayMed.bioIndex}% Parity</span>
                  </div>
                  <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#006a61] rounded-full transition-all duration-500" 
                      style={{ width: `${activeDisplayMed.bioIndex}%` }}
                    />
                  </div>
                </div>

                {/* In Stock & Fast delivery tag */}
                <div className="flex items-center justify-between text-[11px] text-[#006a61] bg-white/70 px-2.5 py-1.5 rounded-lg">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> In Stock at Apollo Hub #048
                  </span>
                  <span className="font-mono font-bold text-[#00201d]">45-min ready</span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(activeDisplayMed, true)}
                  className="w-full py-2.5 rounded-lg bg-[#006a61] text-white text-xs font-bold hover:bg-[#005049] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Bioequivalent to Cart (₹{activeDisplayMed.genericPrice.toFixed(2)})
                </button>
              </div>
            </div>

            {/* Audit & Lab Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <div className="space-y-0.5">
                <span className="text-[#76777d] text-[11px]">AUC₀-∞ Ratio:</span>
                <p className="font-mono font-bold text-[#0b1c30]">{activeDisplayMed.aucRatio}% (std 80-125%)</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#76777d] text-[11px]">Cmax Ratio:</span>
                <p className="font-mono font-bold text-[#0b1c30]">{activeDisplayMed.cmaxRatio}x</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#76777d] text-[11px]">Dissolution (15 min):</span>
                <p className="font-mono font-bold text-[#0b1c30]">&gt;85% ({activeDisplayMed.dissolutionTimeMinutes} min assay)</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#76777d] text-[11px]">Certifications:</span>
                <p className="font-bold text-[#006a61] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> WHO-GMP / NABL
                </p>
              </div>
            </div>

            {/* Secondary Action CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#eff4ff]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewDissolution?.(activeDisplayMed)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#006a61] bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5" /> View In-Vitro Dissolution Assay
                </button>
                <button
                  type="button"
                  onClick={() => onConsultAi?.(activeDisplayMed)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#131b2e] bg-[#e5eeff] hover:bg-[#dce9ff] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#006a61]" /> Ask AI Pharmacist About This
                </button>
              </div>

              {activeDisplayMed.allergenFlags && activeDisplayMed.allergenFlags.length > 0 && (
                <div className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Allergen warning: Contains {activeDisplayMed.allergenFlags.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verified Stockists & Physical Hubs */}
      {stockists && stockists.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Verified Stockists &amp; Physical Hubs within 3km</h3>
              <p className="text-xs text-[#45464d]">Dispensing CDSCO licensed bioequivalents with live stock counter</p>
            </div>
            <span className="text-xs text-[#006a61] font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> {stockists.length} hubs connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stockists.map((stk) => (
              <div 
                key={stk.id}
                className="bg-white rounded-xl p-4 border border-[#e5eeff] hover:border-[#006a61] transition-all space-y-3 shadow-2xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30]">{stk.name}</h4>
                    <p className="text-[11px] text-[#45464d] line-clamp-1">{stk.address}</p>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#006a61] font-bold">
                    {stk.distanceKm} km
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#f0f4ff]">
                  <div className="flex items-center gap-1 text-[#0b1c30]">
                    <Clock className="w-3.5 h-3.5 text-[#006a61]" />
                    <span>{stk.fastDeliveryAvailable ? `${stk.estimatedDeliveryMins} mins (Fast)` : "90 mins"}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {stk.inStockQuantity} strips in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Generic Substitutions Arbitrage Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30]">Bioequivalent Generic Arbitrage Catalog</h3>
            <p className="text-xs text-[#45464d]">Click any medicine to load its full pharmacokinetics and comparison</p>
          </div>
          <span className="text-xs font-mono text-[#76777d]">{filteredMedicines.length} molecules available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMedicines.map((med) => {
            const isSelected = activeDisplayMed?.id === med.id;
            return (
              <div
                key={med.id}
                onClick={() => {
                  setSelectedMedicine(med);
                  onSelectMedicine?.(med);
                }}
                className={`bg-white rounded-xl p-4 border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "border-[#006a61] ring-2 ring-[#006a61]/15 shadow-sm"
                    : "border-[#e5eeff] hover:border-[#c6c6cd]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#76777d]">{med.therapeuticClass.split("/")[0]}</span>
                    <h4 className="text-sm font-bold text-[#0b1c30]">{med.brandName}</h4>
                    <p className="text-xs text-[#006a61] font-medium line-clamp-1">{med.genericName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#86f2e4] text-[#00201d]">
                    -{med.savingsPercent}%
                  </span>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-[#f0f4ff]">
                  <div>
                    <span className="text-[10px] text-[#76777d] line-through">₹{med.brandPrice.toFixed(2)}</span>
                    <div className="text-base font-bold text-[#006a61]">₹{med.genericPrice.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#45464d]">Bio-Index</span>
                    <div className="text-xs font-bold text-[#0b1c30] font-mono">{med.bioIndex}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
