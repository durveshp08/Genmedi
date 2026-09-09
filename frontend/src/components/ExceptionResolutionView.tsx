import React, { useState } from "react";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Truck, 
  UserCheck, 
  CheckCircle2, 
  Phone, 
  RefreshCw, 
  Gift, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export const ExceptionResolutionView: React.FC = () => {
  const [resolved, setResolved] = useState(false);
  const [compensateCredit, setCompensateCredit] = useState(true);
  const [selectedAction, setSelectedAction] = useState<"reassign_rider" | "redispense_hub">("reassign_rider");

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-[#ba1a1a] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white text-[#ba1a1a]">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-100">
              PRIORITY SLA BREACH WAR ROOM
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1">Live Courier Breakdown Incident #EXP-104</h2>
          <p className="text-xs text-red-100">
            Hub #048 Indiranagar • Rider Sunil Varma (#DEL-908) halted on 100ft Road.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-mono text-center">
          <span className="text-red-200">SLA Breach Countdown: </span>
          <div className="text-xl font-bold text-white">09m : 42s</div>
        </div>
      </div>

      {resolved ? (
        <div className="bg-white rounded-2xl border border-emerald-300 p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0b1c30]">Incident Resolved Successfully</h3>
          <p className="text-xs text-[#45464d] max-w-md mx-auto">
            Order #GM-88194 package securely handed over to backup express rider Ramesh Kumar (#DEL-410). Customer updated with new ETA and ₹50 apology credit issued.
          </p>
          <button
            onClick={() => setResolved(false)}
            className="px-4 py-2 rounded-xl bg-[#006a61] text-white text-xs font-bold hover:bg-[#005049]"
          >
            Reset Incident Simulation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incident Telemetry (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0b1c30]">Incident Diagnostics &amp; Location</h3>

            <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#76777d]">Affected Order:</span>
                <strong className="font-mono text-[#0b1c30]">#GM-88194 (Augmentin 625 + Pan-D)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Customer:</span>
                <span className="font-medium text-[#0b1c30]">Ananya R. (Koramangala, 2.1 km away)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Breakdown Point:</span>
                <span className="font-medium text-[#ba1a1a]">100ft Road junction near Sony Signal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Package Thermal State:</span>
                <span className="font-mono text-emerald-700 font-bold">3.9°C (Normal 2–8°C limit)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold">Courier Statement (Rider Sunil):</div>
              <p className="italic text-[11px]">
                "Rear tyre punctured by metal debris near petrol pump. Tamper seal intact in thermal pod."
              </p>
            </div>
          </div>

          {/* Action Decision Box (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0b1c30]">Resolution Action Strategy</h3>

            <div className="space-y-3">
              <label 
                onClick={() => setSelectedAction("reassign_rider")}
                className={`p-3.5 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                  selectedAction === "reassign_rider" 
                    ? "border-[#006a61] bg-[#eff4ff]" 
                    : "border-[#e5eeff] hover:bg-[#f8f9ff]"
                }`}
              >
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#006a61]" /> Handover to Nearest Active Rider (Recommended)
                  </div>
                  <p className="text-[11px] text-[#45464d]">
                    Assign backup express rider Ramesh Kumar (#DEL-410). Currently 350 meters away (2 mins ETA).
                  </p>
                </div>
                <input type="radio" checked={selectedAction === "reassign_rider"} readOnly className="text-[#006a61]" />
              </label>

              <label 
                onClick={() => setSelectedAction("redispense_hub")}
                className={`p-3.5 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                  selectedAction === "redispense_hub" 
                    ? "border-[#006a61] bg-[#eff4ff]" 
                    : "border-[#e5eeff] hover:bg-[#f8f9ff]"
                }`}
              >
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#006a61]" /> Re-Dispense Directly from Hub #14 (Jayanagar)
                  </div>
                  <p className="text-[11px] text-[#45464d]">
                    Pack fresh batch at secondary hub. Estimated transit time 22 mins (May exceed guaranteed SLA).
                  </p>
                </div>
                <input type="radio" checked={selectedAction === "redispense_hub"} readOnly className="text-[#006a61]" />
              </label>
            </div>

            {/* Customer Compensation Toggle */}
            <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-xs space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#0b1c30]">
                <input
                  type="checkbox"
                  checked={compensateCredit}
                  onChange={(e) => setCompensateCredit(e.target.checked)}
                  className="rounded text-[#006a61]"
                />
                <span>Auto-issue ₹50 Genmedi Apology Credit to customer wallet</span>
              </label>
              <p className="text-[10px] text-[#76777d]">
                SMS notification will be sent immediately informing customer of rider swap with live tracking link.
              </p>
            </div>

            {/* Execute Resolution */}
            <button
              onClick={() => setResolved(true)}
              className="w-full py-3 rounded-xl bg-[#006a61] text-white font-bold text-xs hover:bg-[#005049] transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Authorize Dispatch Reallocation &amp; Complete SLA Protection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
