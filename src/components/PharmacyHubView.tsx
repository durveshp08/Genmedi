import React, { useState } from "react";
import { 
  Building2, 
  Clock, 
  Barcode, 
  Thermometer, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  Key, 
  Coins, 
  Zap,
  ArrowRight
} from "lucide-react";

export const PharmacyHubView: React.FC = () => {
  const [handoverOtpInput, setHandoverOtpInput] = useState("");
  const [isHandoverVerified, setIsHandoverVerified] = useState(false);
  const [tamperBarcode, setTamperBarcode] = useState("TS-IND-4491-X");

  const activeOrders = [
    {
      id: "GM-88212",
      items: "Amoxyclav 625 + Pantop-D",
      status: "Ready for Pickup",
      slaTime: "04m:18s",
      urgency: "urgent",
      rider: "Ramesh Kumar (Ather 450X)",
    },
    {
      id: "GM-88215",
      items: "Atorvastatin 20mg x 3 strips",
      status: "Packing in Progress",
      slaTime: "12m:40s",
      urgency: "normal",
      rider: "Assigning courier...",
    },
    {
      id: "GM-88218",
      items: "Metformin 500 ER x 2 strips",
      status: "Rx Verification Queue",
      slaTime: "18m:10s",
      urgency: "normal",
      rider: "Unassigned",
    },
  ];

  const handleVerifyHandover = () => {
    if (handoverOtpInput === "4892" || handoverOtpInput.length === 4) {
      setIsHandoverVerified(true);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hub Top Bar */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-[#86f2e4] uppercase tracking-wider">
              HUB #048 DISPENSING ENGINE
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1">Apollo Pharmacy Super Hub #048</h2>
          <p className="text-xs text-white/70">
            100 Feet Rd, Indiranagar • Registered Pharmacist In-Charge: R.Ph. Ananya Sharma (#KA-P-8821)
          </p>
        </div>

        {/* Live Thermal Pod & SLA */}
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Thermometer className="w-4 h-4" /> 3.8°C Cold Pod
          </div>
          <span className="text-white/30">|</span>
          <div>
            <span className="text-white/70">Hub Packing Avg: </span>
            <strong className="text-white">4m 18s</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active 45-Min Orders Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#0b1c30]">Active 45-Min Fast Dispatch Triage</h3>
            <span className="text-xs font-mono font-bold text-[#006a61] bg-[#eff4ff] px-2 py-0.5 rounded">
              3 Active Orders
            </span>
          </div>

          <div className="divide-y divide-[#eff4ff] text-xs">
            {activeOrders.map((ord) => (
              <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0b1c30]">{ord.id}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      ord.urgency === "urgent" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d]">{ord.items}</p>
                  <span className="text-[11px] text-[#76777d]">Courier: {ord.rider}</span>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <span className="font-mono text-xs font-bold text-[#ba1a1a] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ord.slaTime}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#006a61] text-xs font-bold hover:bg-[#dce9ff]">
                    Print Batch Seal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Courier Bay Handover & Settlement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Courier Bay Rider OTP Verification */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#006a61]" /> Courier Bay OTP Handshake
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                BAY 02 READY
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#76777d]">Arrived Rider:</span>
                <span className="font-bold text-[#0b1c30]">Ramesh Kumar (KA-03-HM-9411)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Assigned Order:</span>
                <span className="font-mono font-bold text-[#006a61]">#GM-88212</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76777d]">Tamper Barcode:</span>
                <span className="font-mono text-[#0b1c30]">{tamperBarcode}</span>
              </div>
            </div>

            {isHandoverVerified ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Handshake Verified. Order released to rider for 45-min transit.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[11px] text-[#76777d] block">
                  Enter 4-Digit Rider Handover Code (Sample: 4892):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={handoverOtpInput}
                    onChange={(e) => setHandoverOtpInput(e.target.value)}
                    placeholder="4892"
                    className="flex-1 px-3 py-2 text-sm font-mono tracking-widest bg-white border border-[#dce9ff] rounded-xl text-center font-bold focus:border-[#006a61] focus:outline-hidden"
                  />
                  <button
                    onClick={handleVerifyHandover}
                    className="px-4 py-2 rounded-xl bg-[#006a61] text-white text-xs font-bold hover:bg-[#005049] transition-all"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Daily Settlement & Payout Metric */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#006a61]" /> Daily Hub Settlement Ledger
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1">
                <span className="text-[#76777d] text-[10px]">Today's Payout Margin</span>
                <div className="text-lg font-bold font-mono text-[#006a61]">₹18,420</div>
              </div>
              <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1">
                <span className="text-[#76777d] text-[10px]">Fulfilled Orders</span>
                <div className="text-lg font-bold font-mono text-[#0b1c30]">142</div>
              </div>
            </div>
            <p className="text-[10px] text-[#76777d] pt-1">
              Automated NEFT batch settlement processed nightly at 23:59 IST via ICICI Corporate Banking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
