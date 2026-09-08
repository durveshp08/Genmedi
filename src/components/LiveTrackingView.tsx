import React, { useState, useEffect } from "react";
import { 
  Zap, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Thermometer, 
  Activity, 
  Lock, 
  Navigation, 
  Barcode, 
  AlertCircle,
  Truck,
  RotateCcw
} from "lucide-react";
import { OrderTracking } from "../types";

interface LiveTrackingViewProps {
  tracking: OrderTracking;
  onCallRider: () => void;
  onCallHub: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  tracking,
  onCallRider,
  onCallHub,
}) => {
  const [eta, setEta] = useState(tracking.etaMinutes);
  const [speed, setSpeed] = useState(tracking.currentSpeedKmh);
  const [temp, setTemp] = useState(tracking.boxTemperatureCelsius);
  const [riderProgress, setRiderProgress] = useState(55); // 0 to 100% on route

  // Subtle real-time telemetry simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed((prev) => +(prev + (Math.random() * 2 - 1)).toFixed(1));
      setTemp((prev) => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateAdvance = () => {
    setRiderProgress((p) => Math.min(95, p + 10));
    setEta((e) => Math.max(2, e - 3));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner with ETA & Status */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#86f2e4] text-[#00201d] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" /> 45-MIN FAST DISPATCH
            </span>
            <span className="text-xs font-mono text-[#76777d]">Order #{tracking.orderId}</span>
          </div>
          <h2 className="text-xl font-bold text-[#0b1c30]">
            Arriving in <span className="text-[#006a61]">{eta} mins</span>
          </h2>
          <p className="text-xs text-[#45464d]">
            Dedicated EV Courier is en route from Apollo Hub #048 via Intermediate Ring Rd.
          </p>
        </div>

        {/* Handover OTP Box */}
        <div className="bg-[#131b2e] text-white p-4 rounded-xl text-center space-y-1 w-full md:w-auto shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#86f2e4] font-semibold">
            Delivery Handover OTP
          </span>
          <div className="text-2xl font-mono font-bold tracking-widest text-white">
            {tracking.handoverOtp}
          </div>
          <p className="text-[10px] text-white/70">Share only after inspecting tamper seal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Interactive Map & Rider Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Simulated Map Container */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-[#dce9ff] shadow-sm relative h-[380px] sm:h-[420px] select-none">
            {/* SVG Interactive Road Map Canvas */}
            <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#006a61" />
                  <stop offset="100%" stopColor="#86f2e4" />
                </linearGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Dark Map Grid Background */}
              <rect width="600" height="400" fill="#131b2e" />
              <rect width="600" height="400" fill="url(#grid)" />

              {/* City Street Outlines */}
              <path d="M 50 120 L 550 120" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <path d="M 50 280 L 550 280" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <path d="M 200 50 L 200 350" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <path d="M 400 50 L 400 350" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />

              {/* Curving Delivery Route Track */}
              <path
                d="M 120 100 C 200 100, 220 220, 320 220 C 420 220, 450 300, 500 310"
                fill="none"
                stroke="rgba(134, 242, 228, 0.3)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 120 100 C 200 100, 220 220, 320 220 C 420 220, 450 300, 500 310"
                fill="none"
                stroke="url(#roadGrad)"
                strokeWidth="4"
                strokeDasharray="6 4"
                strokeLinecap="round"
                className="animate-pulse"
              />

              {/* Hub Origin Pin */}
              <g transform="translate(120, 100)">
                <circle r="12" fill="#006a61" />
                <circle r="6" fill="#86f2e4" />
                <text x="18" y="5" fill="#eff4ff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Hub #048 (Indiranagar)
                </text>
              </g>

              {/* Destination Pin (Koramangala) */}
              <g transform="translate(500, 310)">
                <circle r="14" fill="#ba1a1a" opacity="0.3" />
                <circle r="8" fill="#ba1a1a" />
                <circle r="3" fill="#ffffff" />
                <text x="-160" y="5" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Patient: Koramangala 4th Block
                </text>
              </g>

              {/* Dynamic Rider Position on Curve */}
              {/* Interpolated position roughly based on riderProgress */}
              {(() => {
                const rx = 120 + (riderProgress / 100) * 380;
                const ry = 100 + Math.sin((riderProgress / 100) * Math.PI) * 120 + (riderProgress / 100) * 90;
                return (
                  <g transform={`translate(${rx}, ${ry})`}>
                    <circle r="22" fill="#86f2e4" opacity="0.25" className="animate-ping" />
                    <circle r="14" fill="#006a61" stroke="#86f2e4" strokeWidth="2.5" />
                    <circle r="4" fill="#ffffff" />
                    <rect x="-45" y="-34" width="90" height="18" rx="4" fill="#00201d" />
                    <text x="0" y="-21" fill="#86f2e4" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      Rider: {speed} km/h
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Map Overlay Controls */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-xl p-2.5 text-xs shadow-md space-y-1">
              <div className="font-bold text-[#0b1c30] flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-[#006a61]" /> Live GPS Telemetry
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#45464d]">
                <span>Speed: <strong className="text-[#0b1c30]">{speed} km/h</strong></span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-emerald-700">
                  <Thermometer className="w-3 h-3" /> {temp}°C Pod
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={handleSimulateAdvance}
                className="px-3 py-1.5 rounded-lg bg-white/90 text-[#0b1c30] hover:bg-white text-xs font-bold shadow-md transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Advance Simulation
              </button>
            </div>
          </div>

          {/* Dedicated Courier Profile Card */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#eff4ff] border-2 border-[#006a61] flex items-center justify-center text-[#006a61] font-bold text-base font-mono">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0b1c30]">{tracking.riderName}</h4>
                  <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                    ★ {tracking.riderRating}
                  </span>
                </div>
                <p className="text-xs text-[#45464d]">{tracking.vehicle}</p>
                <span className="text-[10px] text-emerald-700 font-medium">CDSCO Cold-Chain Certified Courier</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onCallRider}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#eff4ff] text-[#006a61] font-bold text-xs hover:bg-[#dce9ff] transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Rider
              </button>
              <button
                onClick={onCallHub}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-[#c6c6cd] text-[#45464d] font-medium text-xs hover:bg-[#f8f9ff] transition-all"
              >
                Hub Support
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Stage Chain of Custody & Tamper Seal (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tamper Seal & Barcode Card */}
          <div className="bg-[#eff4ff] rounded-2xl border border-[#dce9ff] p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#006a61]" />
                <span className="text-xs font-bold text-[#0b1c30]">Tamper-Evident Packaging Verification</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#006a61] font-bold border border-[#dce9ff]">
                IoT SEAL ACTIVE
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#c6c6cd]/60 space-y-1.5 text-center">
              <span className="text-[10px] text-[#76777d] font-mono">DIGITAL TAMPER SEAL BARCODE</span>
              <div className="font-mono text-base font-bold tracking-widest text-[#0b1c30]">
                {tracking.tamperSealBarcode}
              </div>
              <p className="text-[10px] text-[#45464d]">
                If the red tear-strip is broken upon arrival, refuse delivery and notify emergency dispatch.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-[#006a61] font-mono">
              <span>Sensor: BLE Cold-Pod #09</span>
              <span>Active Temp: {temp}°C</span>
            </div>
          </div>

          {/* 5-Stage Timeline */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0b1c30]">5-Stage Chain of Custody</h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#eff4ff]">
              {tracking.stages.map((stage, idx) => (
                <div key={idx} className="relative flex items-start gap-3 text-xs">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    stage.completed 
                      ? "bg-[#006a61] text-white shadow-xs" 
                      : stage.active 
                      ? "bg-[#86f2e4] text-[#00201d] ring-4 ring-[#86f2e4]/30" 
                      : "bg-[#eff4ff] text-[#76777d] border border-[#dce9ff]"
                  }`}>
                    {stage.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : stage.active ? (
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                    ) : (
                      <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                    )}
                  </div>

                  <div className="space-y-0.5 flex-1">
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${stage.active ? "text-[#006a61]" : "text-[#0b1c30]"}`}>
                        {stage.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#76777d]">{stage.time}</span>
                    </div>
                    <p className="text-[11px] text-[#45464d] leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
