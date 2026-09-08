import React, { useState } from "react";
import { 
  Stethoscope, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Key, 
  Clock, 
  Layers, 
  Eye, 
  Check, 
  ExternalLink,
  Lock
} from "lucide-react";
import { Prescription } from "../types";

interface ClinicalReviewerViewProps {
  prescriptions: Prescription[];
}

export const ClinicalReviewerView: React.FC<ClinicalReviewerViewProps> = ({
  prescriptions,
}) => {
  const [selectedRx, setSelectedRx] = useState<Prescription>(prescriptions[0]);
  const [signedState, setSignedState] = useState<"pending" | "approved" | "rejected">(
    selectedRx.status === "verified" ? "approved" : "pending"
  );
  const [showPkiSuccess, setShowPkiSuccess] = useState(false);

  const handlePkiSign = () => {
    setShowPkiSuccess(true);
    setSignedState("approved");
    setTimeout(() => setShowPkiSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <Stethoscope className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-[#86f2e4] uppercase tracking-wider">
              CDSCO SCHEDULE H1 / REGULATION 65
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-white">Medical &amp; Clinical Reviewer Workstation</h2>
          <p className="text-xs text-white/70">
            Mandatory dual-step verification before physical fulfillment and courier dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl text-xs font-mono">
          <div>
            <span className="text-white/60">Triage Queue: </span>
            <strong className="text-[#86f2e4]">14 Pending</strong>
          </div>
          <span className="text-white/30">|</span>
          <div>
            <span className="text-white/60">Avg Sign-off: </span>
            <strong className="text-white">1m 42s</strong>
          </div>
        </div>
      </div>

      {/* PKI Sign Success Notification */}
      {showPkiSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cryptographic PKI Signature Appended (SHA-256 Hash Generated &amp; Committed to CDSCO Audit Ledger)</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-800">TX-9481-OK</span>
        </div>
      )}

      {/* Main Dual-Pane Reviewer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scanned Rx with AI Bounding Boxes (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#006a61]" /> Original Scanned Prescription
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eff4ff] text-[#006a61] font-bold">
              STAT 45-MIN QUEUE
            </span>
          </div>

          <div className="relative rounded-xl border border-[#c6c6cd] bg-[#fffdfa] p-4 text-xs font-serif text-[#131b2e] min-h-[420px] space-y-4 shadow-inner">
            <div className="text-center border-b pb-2">
              <h4 className="font-bold font-sans text-[#0b1c30]">{selectedRx.doctorClinic}</h4>
              <p className="font-sans text-[11px] text-[#45464d]">{selectedRx.doctorName} ({selectedRx.doctorRegNo})</p>
            </div>

            <div className="font-sans text-[11px] flex justify-between">
              <span>Patient: <strong>{selectedRx.patientName}</strong> (34M)</span>
              <span>Date: {selectedRx.date}</span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="font-serif italic text-lg text-[#006a61] font-bold">℞</div>
              {selectedRx.items.map((item, idx) => (
                <div key={item.id} className="p-2 rounded bg-[#86f2e4]/15 border border-[#006a61]/30">
                  <div className="font-bold text-[#0b1c30]">{item.brandName}</div>
                  <div className="text-[10px] text-[#45464d]">{item.dosage} • {item.frequency}</div>
                </div>
              ))}
            </div>

            <div className="pt-8 flex justify-between items-end font-sans">
              <div className="text-[9px] text-[#76777d]">Digital Watermark: KA-29481-VALID</div>
              <div className="text-right font-serif italic text-xs font-bold text-[#006a61]">
                Dr. S. Bannerjee
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structured Clinical Evaluation & PKI Sign-Off Console (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Automated CDSCO Rule Engine Checks */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006a61]" /> Automated Clinical Safety Checks
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Allergy Warning */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-amber-900">
                  <div className="font-bold text-xs">Patient Allergy Flag Detected (Penicillin)</div>
                  <p className="text-[11px]">
                    Prescription contains Amoxicillin. Patient has acknowledged physician clearance in checkout flow.
                  </p>
                </div>
              </div>

              {/* DDI Check */}
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between text-[#006a61]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Drug-Drug Interaction (DDI) Matrix: <strong>0 Major Conflicts</strong></span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded">PASSED</span>
              </div>

              {/* Renal Check */}
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between text-[#006a61]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Renal &amp; Hepatic Dosage Adjustment: <strong>Normal Clearance</strong></span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded">PASSED</span>
              </div>
            </div>
          </div>

          {/* PKI Hardware Token Sign-off Box */}
          <div className="bg-white rounded-2xl border-2 border-[#006a61] p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#006a61] tracking-wider">CDSCO Licensed Pharmacist Sign-Off</span>
                <h3 className="text-base font-bold text-[#0b1c30]">R.Ph. Ananya Sharma (Reg #KA-P-8821)</h3>
                <p className="text-xs text-[#45464d]">Indiranagar Apollo Hub #048 Registered In-Charge</p>
              </div>
              <span className="p-2 rounded-xl bg-[#eff4ff] text-[#006a61]">
                <Key className="w-5 h-5" />
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-xs font-mono space-y-1">
              <div className="text-[#76777d]">PKI SHA-256 DIGITAL FINGERPRINT:</div>
              <div className="text-[11px] font-bold text-[#0b1c30] truncate">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handlePkiSign}
                disabled={signedState === "approved"}
                className={`flex-1 w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                  signedState === "approved"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default"
                    : "bg-[#006a61] text-white hover:bg-[#005049]"
                }`}
              >
                {signedState === "approved" ? (
                  <>
                    <Check className="w-4 h-4" /> Prescription Signed &amp; Released to Hub
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" /> Cryptographically Sign &amp; Authorize Dispense
                  </>
                )}
              </button>

              <button
                onClick={() => setSignedState("rejected")}
                disabled={signedState === "approved"}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-[#c6c6cd] text-[#ba1a1a] text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-40"
              >
                Reject &amp; Escalate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
