import React, { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  HeartPulse, 
  Calendar, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  FileText, 
  BellRing,
  ExternalLink
} from "lucide-react";

export const HealthVaultView: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState("self");
  const [autoRefillMetformin, setAutoRefillMetformin] = useState(true);
  const [autoRefillAtorvastatin, setAutoRefillAtorvastatin] = useState(true);

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006a61] to-[#131b2e] text-[#86f2e4] flex items-center justify-center font-bold text-xl font-mono shadow-sm">
            RV
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#0b1c30]">Rahul Verma</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006a61] font-bold">
                34 Yrs • Male
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#45464d] font-mono">
              <span>ABHA ID: 91-4829-1049-2810</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> NDHM Linked
              </span>
            </div>
          </div>
        </div>

        {/* Family Switcher */}
        <div className="flex items-center gap-2 bg-[#eff4ff] p-1.5 rounded-xl border border-[#dce9ff]">
          <button
            onClick={() => setActiveProfile("self")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeProfile === "self" ? "bg-white text-[#006a61] shadow-xs" : "text-[#45464d]"
            }`}
          >
            Self (Rahul)
          </button>
          <button
            onClick={() => setActiveProfile("spouse")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeProfile === "spouse" ? "bg-white text-[#006a61] shadow-xs" : "text-[#45464d]"
            }`}
          >
            Priya (Spouse)
          </button>
          <button
            onClick={() => setActiveProfile("mother")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeProfile === "mother" ? "bg-white text-[#006a61] shadow-xs" : "text-[#45464d]"
            }`}
          >
            Sunita (Mother)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clinical Allergies & Active Conditions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Allergy & Safety Alerts */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Documented Drug Allergies
              </h3>
              <span className="text-[11px] text-[#006a61] font-bold cursor-pointer hover:underline">+ Add Allergy</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-amber-950">Penicillin &amp; Beta-Lactam Class</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold uppercase">
                  Severe Anaphylaxis
                </span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Documented urticaria and angioedema. Genmedi automated triage engine prevents accidental dispensation without clinical confirmation.
              </p>
              <div className="text-[10px] text-amber-800 font-mono pt-1">
                Reported: Manipal Hospital Bengaluru, 2021
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-xs text-[#45464d] flex justify-between items-center">
              <span>Sulfa Drugs / Sulfonamides:</span>
              <span className="font-mono text-emerald-700 font-bold">No known sensitivity</span>
            </div>
          </div>

          {/* Active Conditions */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#006a61]" /> Active Health Conditions
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border border-[#e5eeff] flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#0b1c30]">Acute Maxillary Bacterial Sinusitis</div>
                  <div className="text-[11px] text-[#45464d]">Current Episode • Prescribed on 14 Oct 2024</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold">
                  Active (Day 2/5)
                </span>
              </div>

              <div className="p-3 rounded-xl border border-[#e5eeff] flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#0b1c30]">Pre-Diabetic Glycemic Monitoring</div>
                  <div className="text-[11px] text-[#45464d]">Latest HbA1c: 5.9% • Target: &lt;5.7%</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                  Stable
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auto-Refill Subscriptions & ICE Contact (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Auto-Refill Engine */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#006a61]" /> Chronic Auto-Refill Subscriptions
                </h3>
                <p className="text-[11px] text-[#45464d]">Save additional 15% with scheduled 45-min deliveries</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#006a61] bg-[#eff4ff] px-2 py-0.5 rounded">
                2 Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Refill Item 1 */}
              <div className="p-3.5 rounded-xl border border-[#e5eeff] bg-[#f8f9ff] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#0b1c30]">Metformin Hydrochloride 500mg ER</h4>
                    <p className="text-[11px] text-[#45464d]">Bioequivalent Generic (Torrent Pharma) • 60 Tablets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefillMetformin}
                      onChange={(e) => setAutoRefillMetformin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006a61]"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#e5eeff] text-[#45464d]">
                  <span>Next Dispatch: <strong>28 Oct 2024</strong></span>
                  <span className="font-mono text-[#006a61] font-bold">₹36.00 / month (Save 80%)</span>
                </div>
              </div>

              {/* Refill Item 2 */}
              <div className="p-3.5 rounded-xl border border-[#e5eeff] bg-[#f8f9ff] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#0b1c30]">Atorvastatin Calcium 20mg</h4>
                    <p className="text-[11px] text-[#45464d]">Bioequivalent Generic (Dr. Reddy's) • 30 Tablets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefillAtorvastatin}
                      onChange={(e) => setAutoRefillAtorvastatin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006a61]"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#e5eeff] text-[#45464d]">
                  <span>Next Dispatch: <strong>02 Nov 2024</strong></span>
                  <span className="font-mono text-[#006a61] font-bold">₹48.00 / month (Save 87%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ICE Emergency Contact & Saved Address */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#006a61]" /> ICE Emergency Medical Contact
            </h3>
            <div className="text-xs text-[#45464d] flex justify-between items-center p-3 rounded-xl bg-[#eff4ff]">
              <div>
                <div className="font-bold text-[#0b1c30]">Priya Verma (Spouse)</div>
                <div className="font-mono text-[11px]">+91 98450 12345</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#006a61] border border-[#dce9ff]">
                Primary ICE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
