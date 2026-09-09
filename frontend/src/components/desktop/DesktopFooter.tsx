import React from "react";
import { ShieldCheck, PhoneCall, Building2, Award, FileCheck2, ExternalLink } from "lucide-react";

export const DesktopFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#dce9ff] bg-white text-[#45464d] text-xs pt-12 pb-8 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Regulatory */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#006a61] text-[#86f2e4] flex items-center justify-center font-bold text-sm">
                G
              </div>
              <span className="font-bold text-base text-[#0b1c30]">Genmedi Clinical</span>
            </div>
            <p className="text-[11px] text-[#76777d] leading-relaxed">
              India&apos;s pioneering bioequivalence verification and 45-minute clinical dispatch infrastructure.
              Compliant with CDSCO Rule 65 and WHO-GMP standards.
            </p>
            <div className="text-[11px] font-mono text-[#006a61] font-medium">
              CDSCO License: KA-BLR-2024-H1-94812
            </div>
          </div>

          {/* Col 2: Pharmacopoeia Standards */}
          <div className="space-y-2.5">
            <div className="font-bold text-[#0b1c30] text-xs uppercase tracking-wider">
              Bioequivalence Standards
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#76777d]">
              <li className="hover:text-[#0b1c30] cursor-pointer">In-Vitro Dissolution Profiling (USP/IP)</li>
              <li className="hover:text-[#0b1c30] cursor-pointer">AUC₀-∞ &amp; Cmax 80-125% Validation</li>
              <li className="hover:text-[#0b1c30] cursor-pointer">NABL Accredited Analytical Lab Assays</li>
              <li className="hover:text-[#0b1c30] cursor-pointer">Jan Aushadhi Scheme Molecular Parity</li>
              <li className="hover:text-[#0b1c30] cursor-pointer">Schedule H1 Triplicate Digital Record</li>
            </ul>
          </div>

          {/* Col 3: Physical Dark Hub Network */}
          <div className="space-y-2.5">
            <div className="font-bold text-[#0b1c30] text-xs uppercase tracking-wider">
              Connected Dark Hubs
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#76777d]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Hub #048: Indiranagar, BLR (Primary)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Hub #112: Koramangala 4th Block, BLR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Hub #074: HSR Sector 2, BLR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Hub #091: Whitefield EPIP (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: 24/7 Clinical Contact & Emergency */}
          <div className="space-y-2.5">
            <div className="font-bold text-[#0b1c30] text-xs uppercase tracking-wider">
              Emergency &amp; Support
            </div>
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] space-y-1">
              <div className="text-[11px] font-bold text-[#0b1c30] flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#006a61]" /> 24/7 Doctor &amp; Pharmacist Line
              </div>
              <div className="text-xs font-mono font-bold text-[#006a61]">+91 80 4912 8800</div>
              <p className="text-[10px] text-[#45464d]">Triage support for adverse interactions or courier queries.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Regulatory Notice */}
        <div className="pt-6 border-t border-[#f0f4ff] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#76777d]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#0b1c30]">© 2026 Genmedi Technologies Inc.</span>
            <span>•</span>
            <span>All rights reserved</span>
            <span>•</span>
            <span className="text-[#ba1a1a] font-medium">CDSCO Schedule H &amp; H1: Dispensed against valid Rx only</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span>ISO 9001:2015</span>
            <span>•</span>
            <span>WHO-GMP Validated</span>
            <span>•</span>
            <span>2–8°C Cold-Chain Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
