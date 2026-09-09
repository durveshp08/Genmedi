import React, { useState } from "react";
import { 
  SlidersHorizontal, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Eye, 
  FileText, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight,
  Filter,
  X
} from "lucide-react";
import { PriorityException, Prescription } from "../types";

interface AdminOperationsViewProps {
  exceptions: PriorityException[];
  onResolveException: (id: string) => void;
  samplePrescriptions: Prescription[];
}

export const AdminOperationsView: React.FC<AdminOperationsViewProps> = ({
  exceptions,
  onResolveException,
  samplePrescriptions,
}) => {
  const [selectedDrawerRx, setSelectedDrawerRx] = useState<Prescription | null>(null);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Title & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#eff4ff] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30]">Operations &amp; Admin Control Tower</h2>
          <p className="text-xs text-[#45464d]">Real-time fulfillment SLA telemetry across 3 Bangalore distribution hubs</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            ALL 3 HUBS OPERATIONAL
          </span>
        </div>
      </div>

      {/* 4 KPI Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs space-y-2">
          <span className="text-[11px] font-mono text-[#76777d] uppercase">Total Orders Today</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0b1c30] font-mono">1,842</span>
            <span className="text-xs text-emerald-700 font-bold flex items-center">
              +14.2% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-[11px] text-[#45464d]">1,280 Fast 45-Min • 562 Standard</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs space-y-2">
          <span className="text-[11px] font-mono text-[#76777d] uppercase">Critical Exceptions</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#ba1a1a] font-mono">14</span>
            <span className="text-xs text-amber-700 font-bold">11 mins avg to SLA</span>
          </div>
          <div className="text-[11px] text-[#45464d]">1 Puncture • 1 Temp • 12 Rx Checks</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs space-y-2">
          <span className="text-[11px] font-mono text-[#76777d] uppercase">Generic Parity Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#006a61] font-mono">99.1%</span>
            <span className="text-xs text-[#006a61] font-bold">NABL Audited</span>
          </div>
          <div className="text-[11px] text-[#45464d]">Zero CDSCO dissolution failures</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs space-y-2">
          <span className="text-[11px] font-mono text-[#76777d] uppercase">45-Min Fast SLA Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0b1c30] font-mono">94.6%</span>
            <span className="text-xs text-emerald-700 font-bold">Target: &gt;92%</span>
          </div>
          <div className="text-[11px] text-[#45464d]">Avg delivery: 36m 12s</div>
        </div>
      </div>

      {/* Priority Exceptions Triage Table */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#eff4ff] flex justify-between items-center bg-[#f8f9ff]">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30]">Active Priority Exceptions Queue ({exceptions.length})</h3>
            <p className="text-xs text-[#45464d]">Live incidents requiring immediate hub supervisor or pharmacist intervention</p>
          </div>
          <button className="text-xs font-mono text-[#006a61] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Critical
          </button>
        </div>

        <div className="divide-y divide-[#eff4ff] text-xs">
          {exceptions.map((exc) => (
            <div key={exc.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-[#f8f9ff] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                    exc.severity === "critical" 
                      ? "bg-red-100 text-red-800" 
                      : exc.severity === "high" 
                      ? "bg-amber-100 text-amber-900" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {exc.severity}
                  </span>
                  <span className="font-mono font-bold text-[#0b1c30]">{exc.orderId}</span>
                  <span className="text-[#76777d]">• {exc.hub}</span>
                  <span className="text-[#76777d]">({exc.timestamp})</span>
                </div>
                <p className="text-xs text-[#0b1c30] font-medium">{exc.description}</p>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <div className="text-right text-[11px] font-mono text-[#ba1a1a] font-bold">
                  SLA in {exc.slaRemainingMins}m
                </div>
                <button
                  onClick={() => onResolveException(exc.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#006a61] text-white text-xs font-bold hover:bg-[#005049] transition-all shadow-2xs"
                >
                  Resolve Incident
                </button>
                <button
                  onClick={() => setSelectedDrawerRx(samplePrescriptions[0])}
                  className="px-2.5 py-1.5 rounded-lg border border-[#c6c6cd] text-[#45464d] text-xs hover:bg-[#eff4ff]"
                >
                  View Rx
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split-Screen Live Prescription Verification Drawer Modal */}
      {selectedDrawerRx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-5 animate-in slide-in-from-right">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#006a61] uppercase">Live Rx Inspector</span>
                <h3 className="text-base font-bold text-[#0b1c30]">Prescription #{selectedDrawerRx.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedDrawerRx(null)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdfa] border border-[#c6c6cd] font-serif text-xs space-y-3">
              <div className="text-center">
                <h4 className="font-bold text-sm font-sans">{selectedDrawerRx.doctorClinic}</h4>
                <p className="text-[11px] font-sans text-gray-600">{selectedDrawerRx.doctorName}</p>
              </div>
              <div className="space-y-2 font-sans">
                <div className="font-serif italic text-base text-[#006a61] font-bold">℞</div>
                {selectedDrawerRx.items.map((i) => (
                  <div key={i.id} className="p-2 rounded bg-[#eff4ff]">
                    <strong>{i.brandName}</strong> - {i.dosage}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#0b1c30]">Supervisor Verification Checklist:</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="text-[#006a61] rounded" />
                <span>Physician registration number verified on CDSCO registry</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="text-[#006a61] rounded" />
                <span>Bioequivalent generic active ingredient matches innovator strip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="text-[#006a61] rounded" />
                <span>Cold-chain packaging sensor assigned (2–8°C limit)</span>
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setSelectedDrawerRx(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#006a61] text-white font-bold text-xs hover:bg-[#005049]"
              >
                Release for 45-Min Fulfillment
              </button>
              <button
                onClick={() => setSelectedDrawerRx(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
