import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  Plus, 
  Eye, 
  FileCheck, 
  RefreshCw 
} from "lucide-react";
import { Prescription, Medicine } from "../types";

export interface RxVaultViewProps {
  prescriptions?: Prescription[];
  onAddAllToCart?: (items: any[]) => void;
  onNavigateToCheckout?: () => void;
  onConsultAi?: (moleculeName: string) => void;
  onVerifyPrescription?: (id: string) => void;
  onApplySubstitution?: (rxId: string, medId: string) => void;
}

export const RxVaultView: React.FC<RxVaultViewProps> = ({
  prescriptions = [],
  onAddAllToCart,
  onNavigateToCheckout,
  onConsultAi,
  onVerifyPrescription,
  onApplySubstitution,
}) => {
  const [selectedRxId, setSelectedRxId] = useState<string>(prescriptions[0]?.id || "");
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  const selectedRx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (selectedRx && onVerifyPrescription) {
        onVerifyPrescription(selectedRx.id);
      }
    }, 1200);
  };

  if (!selectedRx) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#dce9ff]">
        <FileText className="w-8 h-8 text-[#76777d] mx-auto mb-2" />
        <p className="text-sm font-medium text-[#0b1c30]">No prescriptions available in vault.</p>
      </div>
    );
  }

  const items = selectedRx.items || [];
  const totalBrand = items.reduce((acc, i) => acc + (i.brandPrice || 0), 0);
  const totalGeneric = items.reduce((acc, i) => acc + (i.genericPrice || 0), 0);
  const totalSavings = totalBrand - totalGeneric;
  const savingsPct = totalBrand > 0 ? Math.round((totalSavings / totalBrand) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 sm:pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#dce9ff] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <FileCheck className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-[#0b1c30]">Rx Vault &amp; Multi-Layer OCR Verification</h2>
          </div>
          <p className="text-xs text-[#45464d] mt-1">
            Proprietary AI extraction matches handwritten doctor scripts to CDSCO-certified bioequivalent generics.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Neural OCR...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Script (PDF/JPG)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Prescription Document Viewer with OCR layer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#006a61]" /> Digitalized Rx Document
              </span>
              <button
                type="button"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className="text-[11px] text-[#006a61] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" /> {showBoundingBoxes ? "Hide OCR Boxes" : "Show OCR Boxes"}
              </button>
            </div>

            {/* Simulated Rx Canvas */}
            <div className="relative bg-[#fffdf9] border-2 border-dashed border-[#e5ddcb] rounded-xl p-4 text-xs font-serif leading-relaxed text-[#2c2621] space-y-3 shadow-inner">
              {/* Doctor Letterhead */}
              <div className="border-b border-[#2c2621]/20 pb-2 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-[#111]">{selectedRx.doctorName}</h4>
                  <p className="text-[10px] text-[#555]">{selectedRx.doctorRegNo}</p>
                  <p className="text-[10px] text-[#555]">{selectedRx.doctorClinic}</p>
                </div>
                <span className="text-[10px] font-mono text-[#777]">{selectedRx.date}</span>
              </div>

              {/* Patient Info with simulated OCR box */}
              <div className="relative p-1">
                {showBoundingBoxes && (
                  <div className="absolute inset-0 border border-emerald-500/60 bg-emerald-500/5 rounded pointer-events-none">
                    <span className="absolute -top-2 right-1 text-[8px] font-mono bg-emerald-600 text-white px-1 rounded">
                      Patient Box 99.4%
                    </span>
                  </div>
                )}
                <div className="font-sans text-[11px] space-y-0.5">
                  <div><strong>Patient:</strong> {selectedRx.patientName} ({selectedRx.patientAge}y / {selectedRx.patientGender})</div>
                  <div><strong>Dx:</strong> {selectedRx.diagnosis}</div>
                  <div className="text-[10px] font-mono text-[#006a61]"><strong>ABHA:</strong> {selectedRx.patientAbhaId}</div>
                </div>
              </div>

              {/* Medicine Prescription Body */}
              <div className="space-y-2 pt-1 font-sans">
                <div className="text-[11px] font-bold text-[#444] uppercase tracking-wider">℞ Prescribed Medicines</div>
                {items.map((item, idx) => (
                  <div key={item.id || idx} className="relative p-1.5 border border-[#eff4ff] bg-white rounded-lg">
                    {showBoundingBoxes && (
                      <div className="absolute inset-0 border border-blue-500/60 bg-blue-500/5 rounded pointer-events-none">
                        <span className="absolute -top-2 right-1 text-[8px] font-mono bg-blue-600 text-white px-1 rounded">
                          Item #{idx + 1} Conf: 99.8%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-xs text-[#0b1c30]">{item.brandName}</div>
                        <div className="text-[10px] text-[#76777d]">{item.molecule}</div>
                        <div className="text-[10px] text-[#006a61] font-mono">{item.dosage} • {item.frequency} ({item.duration})</div>
                      </div>
                      <span className="text-xs font-mono font-semibold">₹{item.brandPrice.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Doctor Stamp & Signature */}
              <div className="pt-2 border-t border-[#2c2621]/20 flex justify-between items-end">
                <div className="text-[9px] font-mono text-[#888]">
                  Verified Digital Hash: SHA256-99b4a1f...
                </div>
                <div className="text-right">
                  <div className="w-16 h-8 border-b border-[#2c2621]/40 flex items-center justify-center italic text-xs text-[#006a61]">
                    Bannerjee
                  </div>
                  <span className="text-[9px] text-[#666]">Physician Signature</span>
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#45464d]">Verification Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> NABL Bioequivalence Validated
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Extraction & Automatic Molecule Generic Substitution (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0b1c30]">Extracted Molecules &amp; Recommended Bio-Generics</h3>
                <p className="text-xs text-[#45464d]">Substitutable under CDSCO Rule 65 &amp; Jan Aushadhi Clinical parity standards</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#006a61] bg-[#eff4ff] px-2 py-1 rounded-lg">
                {items.length} Extracted
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  className="rounded-xl p-4 border border-[#e5eeff] bg-[#f8f9ff] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0b1c30]">{item.brandName}</span>
                        <span className="text-[10px] text-[#76777d] line-through font-mono">
                          ₹{item.brandPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-[#45464d]">{item.molecule}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#86f2e4] text-[#00201d]">
                        Save {item.savingsPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Generic Parity Card */}
                  <div className="bg-white p-3 rounded-xl border-2 border-[#006a61] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#006a61]" />
                        <span className="text-xs font-bold text-[#006a61]">
                          Substituted: {item.genericSubstitute}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#45464d] mt-0.5">
                        Bio-Index: <strong className="text-[#0b1c30] font-mono">{item.bioIndex}%</strong> • In Stock at Apollo Hub #048
                      </div>
                    </div>

                    <div className="text-right flex items-center justify-between sm:justify-end gap-3">
                      <div>
                        <div className="text-sm font-bold text-[#006a61] font-mono">
                          ₹{item.genericPrice.toFixed(2)}
                        </div>
                        <span className="text-[9px] text-[#76777d]">Per strip</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onApplySubstitution?.(selectedRx.id, item.id);
                          onAddAllToCart?.([item]);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#006a61] hover:bg-[#005049] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Allergy warning if flagged */}
                  {item.allergyFlag && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-900 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Penicillin allergy detected on patient profile.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onConsultAi?.(item.molecule)}
                        className="text-[10px] font-bold text-[#006a61] underline cursor-pointer"
                      >
                        Consult AI
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Net Savings Ticker & 1-Tap Add to Cart */}
            <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#131b2e] to-[#006a61] text-white space-y-4 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-[#86f2e4] font-semibold uppercase tracking-wider">Total Prescription Savings</span>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    ₹{totalGeneric.toFixed(2)} <span className="text-xs text-white/70 line-through">₹{totalBrand.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#86f2e4] text-[#00201d]">
                    Save {savingsPct}% (₹{totalSavings.toFixed(2)})
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                All bioequivalent generics are stocked at Apollo Hub #048 (1.4 km away) and qualified for immediate 45-minute dispatch.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onAddAllToCart?.(items);
                    onNavigateToCheckout?.();
                  }}
                  className="w-full py-3 rounded-xl bg-white text-[#00201d] font-bold text-xs hover:bg-[#eff4ff] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add All Bioequivalent Generics &amp; Proceed (₹{totalGeneric.toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
