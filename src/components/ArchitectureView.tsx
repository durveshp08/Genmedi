import React from "react";
import { 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Server, 
  Database, 
  Cpu, 
  ExternalLink, 
  Bot, 
  Activity, 
  Lock,
  Building2,
  Stethoscope
} from "lucide-react";

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-[#86f2e4] uppercase tracking-wider">
              ENTERPRISE PLATFORM SPECIFICATION
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1">High-Level System Architecture Blueprint</h2>
          <p className="text-xs text-white/70">
            End-to-end topology from consumer client channels to CDSCO regulatory audit ledgers.
          </p>
        </div>

        <div className="text-xs font-mono bg-white/10 px-3.5 py-2 rounded-xl text-[#86f2e4]">
          Cloud Run • 45-Min SLA Broker
        </div>
      </div>

      {/* Layer 1: Client Channels & User Roles */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
          <Smartphone className="w-4 h-4 text-[#006a61]" />
          <span>Layer 1: User Interfaces &amp; Edge Channels</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Consumer App</div>
            <p className="text-[11px] text-[#45464d]">Search, Parity Matrix, 45-min checkout, live GPS</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Reviewer Console</div>
            <p className="text-[11px] text-[#45464d]">Dual-pane OCR, DDI flags, PKI SHA-256 sign-off</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Hub Fulfillment</div>
            <p className="text-[11px] text-[#45464d]">Apollo Hub #048 packing, OTP courier handshake</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Rider Fleet App</div>
            <p className="text-[11px] text-[#45464d]">GPS telemetry, thermal sensor broadcast, customer OTP</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Operations Tower</div>
            <p className="text-[11px] text-[#45464d]">Incident dispatch, cold-chain alarms, SLA monitor</p>
          </div>
        </div>
      </div>

      {/* Layer 2: Edge Gateway & Security */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
          <Lock className="w-4 h-4 text-[#006a61]" />
          <span>Layer 2: Edge Routing &amp; Regulatory Gateway</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">ABHA / NDHM Token Exchange</div>
            <p className="text-[11px] text-[#45464d]">Authenticates Ayushman Bharat Health Accounts with consent artifacts</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">CDSCO Schedule H1 Firewall</div>
            <p className="text-[11px] text-[#45464d]">Validates doctor registration numbers before cart progression</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Cloud Armor &amp; Rate Limiter</div>
            <p className="text-[11px] text-[#45464d]">Protects against scraping of pharmaceutical arbitrage margins</p>
          </div>
        </div>
      </div>

      {/* Layer 3: Microservices Core */}
      <div className="bg-white rounded-2xl border-2 border-[#006a61] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#006a61]">
            <Server className="w-4 h-4" />
            <span>Layer 3: Core Microservices (Express &amp; Cloud Run Engine)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#86f2e4] text-[#00201d] font-bold">
            HIGH AVAILABILITY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Bioequivalence Engine
            </div>
            <p className="text-[11px] text-[#45464d]">
              Computes in-vitro f2 similarity curves, AUC 80–125% compliance, and price arbitrage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Gemini Clinical AI Service
            </div>
            <p className="text-[11px] text-[#45464d]">
              Provides pharmacist decision support, drug interaction checks, and allergy warnings via Gemini 3.8 Flash.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> 45-Min Fast SLA Dispatch Broker
            </div>
            <p className="text-[11px] text-[#45464d]">
              Geospatial allocation matching order location to Apollo Hub #048 with rider backup logic.
            </p>
          </div>
        </div>
      </div>

      {/* Layer 4: Storage & External Regulators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
            <Database className="w-4 h-4 text-[#006a61]" />
            <span>Layer 4: Data &amp; Persistence Storage</span>
          </div>
          <ul className="space-y-1.5 text-[#45464d]">
            <li>• <strong>PostgreSQL Catalog</strong>: 1,842 CDSCO approved bioequivalent molecules.</li>
            <li>• <strong>AES-256 Rx Vault</strong>: Encrypted medical scripts and patient health records.</li>
            <li>• <strong>Immutable Audit Ledger</strong>: PKI SHA-256 signatures for Schedule H1 drugs.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
            <Building2 className="w-4 h-4 text-[#006a61]" />
            <span>Layer 5: External Ecosystem Integrations</span>
          </div>
          <ul className="space-y-1.5 text-[#45464d]">
            <li>• <strong>ABHA / Ayushman Bharat Digital Mission (ABDM)</strong> consent gateway.</li>
            <li>• <strong>NABL Accredited Testing Laboratories</strong> automated batch CoA feed.</li>
            <li>• <strong>Logistics Telemetry</strong>: BLE cold-chain thermal sensors (2–8°C).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
