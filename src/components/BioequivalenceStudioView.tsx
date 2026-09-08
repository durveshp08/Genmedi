import React, { useState } from "react";
import { 
  Layers, 
  Search, 
  FlaskConical, 
  Award, 
  CheckCircle2, 
  TrendingDown, 
  FileText, 
  X, 
  Download, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Medicine, DissolutionCurveData } from "../types";
import { sampleDissolutionAssay } from "../data/mockData";

interface BioequivalenceStudioViewProps {
  medicines: Medicine[];
  onSelectMedicine: (med: Medicine) => void;
}

export const BioequivalenceStudioView: React.FC<BioequivalenceStudioViewProps> = ({
  medicines,
  onSelectMedicine,
}) => {
  const [search, setSearch] = useState("");
  const [selectedMed, setSelectedMed] = useState<Medicine>(medicines[0]);
  const [showDrawer, setShowDrawer] = useState(false);

  const filtered = medicines.filter(
    (m) =>
      m.brandName.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.therapeuticClass.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#eff4ff] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30]">Medicine Catalog &amp; Bioequivalence Mapping Studio</h2>
          <p className="text-xs text-[#45464d]">
            In-vitro dissolution profiles, f2 similarity factors, and NABL certified batch audits across 1,842 cataloged molecules.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#006a61] bg-[#eff4ff] px-3 py-1 rounded-xl">
          WHO-GMP &amp; CDSCO Audited
        </span>
      </div>

      {/* Search and Table Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by molecule, innovator brand, or drug class..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006a61] focus:outline-hidden"
          />
        </div>
        <span className="text-xs font-mono text-[#76777d]">Showing {filtered.length} molecules</span>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8f9ff] text-[#76777d] font-mono border-b border-[#eff4ff]">
            <tr>
              <th className="p-4">Innovator Brand</th>
              <th className="p-4">Active Generic Molecule</th>
              <th className="p-4">Brand MRP</th>
              <th className="p-4">Generic MRP</th>
              <th className="p-4">Arbitrage %</th>
              <th className="p-4">Bio-Index</th>
              <th className="p-4 text-right">In-Vitro Assay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff4ff]">
            {filtered.map((med) => (
              <tr 
                key={med.id} 
                className="hover:bg-[#f8f9ff] transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedMed(med);
                  setShowDrawer(true);
                }}
              >
                <td className="p-4">
                  <div className="font-bold text-[#0b1c30]">{med.brandName}</div>
                  <div className="text-[11px] text-[#76777d]">{med.brandManufacturer}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-[#006a61]">{med.genericName}</div>
                  <div className="text-[11px] text-[#45464d]">{med.dosage}</div>
                </td>
                <td className="p-4 font-mono text-[#76777d] line-through">₹{med.brandPrice.toFixed(2)}</td>
                <td className="p-4 font-mono font-bold text-[#006a61]">₹{med.genericPrice.toFixed(2)}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#86f2e4] text-[#00201d]">
                    -{med.savingsPercent}%
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-[#0b1c30]">{med.bioIndex}%</td>
                <td className="p-4 text-right">
                  <button className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#006a61] text-xs font-bold hover:bg-[#dce9ff] flex items-center gap-1 ml-auto">
                    <FlaskConical className="w-3.5 h-3.5" /> Inspect Assay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive In-Vitro Dissolution Assay Drawer Modal */}
      {showDrawer && selectedMed && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#006a61] uppercase tracking-wider">
                  NABL Laboratory Certificate of Analysis
                </span>
                <h3 className="text-lg font-bold text-[#0b1c30]">{selectedMed.genericName}</h3>
                <p className="text-xs text-[#45464d]">Compared against Innovator Brand: {selectedMed.brandName}</p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Assay Summary Metric Cards */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-center space-y-0.5">
                <span className="text-[10px] text-[#76777d] font-mono">f2 Similarity Factor</span>
                <div className="text-lg font-bold font-mono text-[#006a61]">78.4</div>
                <span className="text-[10px] text-emerald-700 font-bold">Standard &gt;50</span>
              </div>
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-center space-y-0.5">
                <span className="text-[10px] text-[#76777d] font-mono">AUC₀-∞ Ratio</span>
                <div className="text-lg font-bold font-mono text-[#006a61]">{selectedMed.aucRatio}%</div>
                <span className="text-[10px] text-emerald-700 font-bold">80–125% Window</span>
              </div>
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-center space-y-0.5">
                <span className="text-[10px] text-[#76777d] font-mono">Cmax Ratio</span>
                <div className="text-lg font-bold font-mono text-[#006a61]">{selectedMed.cmaxRatio}x</div>
                <span className="text-[10px] text-emerald-700 font-bold">Tmax 1.15 hrs</span>
              </div>
            </div>

            {/* In-Vitro Dissolution Profile Curve Chart (SVG) */}
            <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-bold text-[#0b1c30]">Comparative Dissolution Profile (pH 6.8 Buffer)</h4>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006a61]"></span> Generic
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#76777d]"></span> Innovator
                  </span>
                </div>
              </div>

              {/* SVG Curve Canvas */}
              <div className="h-56 w-full bg-[#f8f9ff] rounded-xl p-3 border border-[#e5eeff] relative select-none">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#e5eeff" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#e5eeff" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#e5eeff" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#e5eeff" strokeDasharray="3 3" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#c6c6cd" />

                  {/* Y Axis Labels */}
                  <text x="10" y="25" fontSize="9" fill="#76777d">100%</text>
                  <text x="15" y="105" fontSize="9" fill="#76777d">50%</text>
                  <text x="20" y="175" fontSize="9" fill="#76777d">0%</text>

                  {/* Innovator Line (Grey) */}
                  <path
                    d="M 50 170 Q 120 70, 200 45 T 350 25 T 470 21"
                    fill="none"
                    stroke="#76777d"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />

                  {/* Generic Line (Teal) */}
                  <path
                    d="M 50 170 Q 115 65, 200 42 T 350 24 T 470 20"
                    fill="none"
                    stroke="#006a61"
                    strokeWidth="3"
                  />

                  {/* 15 min mark vertical highlight */}
                  <line x1="200" y1="20" x2="200" y2="170" stroke="#86f2e4" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="205" y="90" fontSize="9" fill="#006a61" fontWeight="bold">
                    15 min (&gt;85% release)
                  </text>
                </svg>
              </div>
            </div>

            {/* Excipient Safety Check */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#0b1c30]">Excipient Safety &amp; Allergen Audit</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-gray-50 border">Microcrystalline Cellulose: Passed</div>
                <div className="p-2 rounded bg-gray-50 border">Magnesium Stearate (IP): Passed</div>
                <div className="p-2 rounded bg-gray-50 border">Croscarmellose Sodium: Passed</div>
                <div className="p-2 rounded bg-gray-50 border">Titanium Dioxide Coating: Safe</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl bg-[#006a61] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#005049]">
                <Download className="w-3.5 h-3.5" /> Download NABL Signed Certificate (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
