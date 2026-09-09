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
  Stethoscope,
  Globe,
  Bell,
  Truck,
  DollarSign,
  BarChart3,
  FileText,
  CheckCircle2
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
          <h2 className="text-lg font-bold mt-1">Complete System Architecture Blueprint</h2>
          <p className="text-xs text-white/70">
            End-to-end topology covering all implemented phases: Auth, Operations, Intelligence, Compliance & Launch
          </p>
        </div>

        <div className="text-xs font-mono bg-white/10 px-3.5 py-2 rounded-xl text-[#86f2e4]">
          v1.0 • All Phases Complete
        </div>
      </div>

      {/* Phase 3: Auth & User System */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
          <ShieldCheck className="w-4 h-4 text-[#006a61]" />
          <span>Phase 3: Authentication & User Management System</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">JWT Authentication</div>
            <p className="text-[11px] text-[#45464d]">Access tokens (15min), refresh tokens (7 days), OTP verification</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Role-Based Access Control</div>
            <p className="text-[11px] text-[#45464d]">Patient, Pharmacist, Admin, Rider roles with tab permissions</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Patient Health Vault</div>
            <p className="text-[11px] text-[#45464d]">Allergies, medication history, addresses, ABHA ID</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Pharmacist Portal</div>
            <p className="text-[11px] text-[#45464d]">Verification, queue management, digital signature</p>
          </div>
        </div>
      </div>

      {/* Phase 4: Operations & Delivery */}
      <div className="bg-white rounded-2xl border-2 border-[#006a61] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#006a61]">
            <Activity className="w-4 h-4" />
            <span>Phase 4: Operations & Real-Time Delivery System</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#86f2e4] text-[#00201d] font-bold">
            45-MIN SLA
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Razorpay Integration
            </div>
            <p className="text-[11px] text-[#45464d]">Order creation, payment verification, refunds, pricing engine</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Real-Time Tracking
            </div>
            <p className="text-[11px] text-[#45464d]">WebSocket server, rider GPS telemetry, live map updates</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Notification Center
            </div>
            <p className="text-[11px] text-[#45464d]">In-app notifications, FCM ready, order/delivery alerts</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Rider Management
            </div>
            <p className="text-[11px] text-[#45464d]">Fleet dashboard, assignment system, status tracking</p>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1">
            <div className="font-bold text-[#006a61] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Order Lifecycle
            </div>
            <p className="text-[11px] text-[#45464d]">State machine with 17 statuses, role-based transitions</p>
          </div>
        </div>
      </div>

      {/* Phase 5: Intelligence & Scale */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
          <Bot className="w-4 h-4 text-[#006a61]" />
          <span>Phase 5: Intelligence, Scale & Analytics</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Drug-Drug Interactions</div>
            <p className="text-[11px] text-[#45464d]">Severity levels (contraindicated to minor), clinical evidence</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Multi-Language (i18n)</div>
            <p className="text-[11px] text-[#45464d]">Hindi, Kannada, Tamil translations with language switcher</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Doctor E-Prescribing</div>
            <p className="text-[11px] text-[#45464d]">MCI verification, digital prescriptions, pharmacy integration</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">PWA Support</div>
            <p className="text-[11px] text-[#45464d]">Service worker, offline support, installable app</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
            <div className="font-bold text-[#0b1c30]">Admin Analytics</div>
            <p className="text-[11px] text-[#45464d]">Real-time metrics, performance tracking, activity logs</p>
          </div>
        </div>
      </div>

      {/* Phase 6: Compliance & Launch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
            <ShieldCheck className="w-4 h-4 text-[#006a61]" />
            <span>Phase 6: Regulatory Compliance & Security</span>
          </div>
          <ul className="space-y-1.5 text-[#45464d]">
            <li>• <strong>DISHA Compliance</strong>: Healthcare data access/modification logging</li>
            <li>• <strong>CDSCO Integration</strong>: Schedule H1 drug tracking, cold-chain monitoring</li>
            <li>• <strong>ABHA Integration</strong>: Health ID linkage, consent management</li>
            <li>• <strong>Security Hardening</strong>: OWASP audit, audit logging middleware</li>
            <li>• <strong>Performance</strong>: Code splitting, caching, CDN optimization</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
            <Server className="w-4 h-4 text-[#006a61]" />
            <span>Phase 6: Infrastructure & Launch</span>
          </div>
          <ul className="space-y-1.5 text-[#45464d]">
            <li>• <strong>CI/CD Pipeline</strong>: GitHub Actions, automated testing, Docker builds</li>
            <li>• <strong>Docker Containerization</strong>: Multi-stage builds, docker-compose setup</li>
            <li>• <strong>Pre-Launch Checklist</strong>: Legal, technical, operational readiness</li>
            <li>• <strong>Beta Launch Plan</strong>: 9-week timeline with success metrics</li>
            <li>• <strong>Monitoring</strong>: Error tracking, log aggregation, health checks</li>
          </ul>
        </div>
      </div>

      {/* Technology Stack Summary */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#86f2e4]">
          <Cpu className="w-4 h-4" />
          <span>Technology Stack Summary</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="font-bold text-white mb-1">Frontend</div>
            <div className="text-white/70">React 19, Vite, TailwindCSS, Motion, Lucide Icons</div>
          </div>
          <div>
            <div className="font-bold text-white mb-1">Backend</div>
            <div className="text-white/70">Express.js, TypeScript, Prisma ORM, JWT, WebSocket</div>
          </div>
          <div>
            <div className="font-bold text-white mb-1">Database</div>
            <div className="text-white/70">PostgreSQL, SQLite (dev), Redis (cache)</div>
          </div>
          <div>
            <div className="font-bold text-white mb-1">Infrastructure</div>
            <div className="text-white/70">Docker, GitHub Actions, Cloud Run, CDN</div>
          </div>
        </div>
      </div>
    </div>
  );
};
