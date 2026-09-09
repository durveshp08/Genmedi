import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Stethoscope,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = "login" | "register";

const ROLE_OPTIONS: { value: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { value: "patient", label: "Patient", icon: User, desc: "Browse & order medicines" },
  { value: "pharmacist", label: "Pharmacist", icon: Stethoscope, desc: "Review & verify prescriptions" },
  { value: "admin", label: "Admin", icon: Package, desc: "Full operations access" },
  { value: "rider", label: "Rider", icon: Truck, desc: "Delivery & dispatch" },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, error, clearError, loading } = useAuth();

  const [tab, setTab] = useState<AuthTab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("patient");
  const [regPharmRegNo, setRegPharmRegNo] = useState("");

  if (!isOpen) return null;

  const switchTab = (t: AuthTab) => {
    setTab(t);
    clearError();
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email: loginEmail, password: loginPassword });
      setSuccess("Welcome back!");
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 800);
    } catch {
      // Error is set in context
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone || undefined,
        password: regPassword,
        role: regRole,
        pharmacistRegNo: regRole === "pharmacist" ? regPharmRegNo : undefined,
      });
      setSuccess("Account created!");
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 800);
    } catch {
      // Error is set in context
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0b1c30]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e5eeff] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#131b2e] to-[#1a2a45] px-6 py-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#006a61] to-[#86f2e4] flex items-center justify-center">
              <span className="font-mono font-bold text-white text-sm">G</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Genmedi</h2>
              <p className="text-[11px] text-white/60">Clinical Bioequivalence Platform</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-1 bg-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-white text-[#131b2e] shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === "register"
                  ? "bg-white text-[#131b2e] shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 mb-4 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 mb-4 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#45464d] mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white rounded-xl transition-all focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#45464d] mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white rounded-xl transition-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#0b1c30] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#006a61] to-[#008578] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-[11px] text-[#76777d]">
                  Demo credentials: <span className="font-mono text-[#006a61]">admin@genmedi.in</span> / <span className="font-mono text-[#006a61]">genmedi123</span>
                </p>
              </div>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#45464d] mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Rahul Verma"
                    required
                    minLength={2}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white rounded-xl transition-all focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#45464d] mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white rounded-xl transition-all focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#45464d] mb-1.5 block">
                  Phone <span className="text-[#76777d] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white rounded-xl transition-all focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#45464d] mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white rounded-xl transition-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#0b1c30] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-xs font-semibold text-[#45464d] mb-2 block">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = regRole === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRegRole(opt.value)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selected
                            ? "border-[#006a61] bg-[#eff4ff] text-[#006a61]"
                            : "border-[#e5eeff] bg-white text-[#45464d] hover:border-[#c6c6cd]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${selected ? "text-[#006a61]" : "text-[#76777d]"}`} />
                        <div>
                          <div className="text-xs font-semibold">{opt.label}</div>
                          <div className="text-[10px] text-[#76777d] leading-tight">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pharmacist Reg Number */}
              {regRole === "pharmacist" && (
                <div>
                  <label className="text-xs font-semibold text-[#45464d] mb-1.5 block">
                    Registration Number <span className="text-[#76777d] font-normal">(CDSCO)</span>
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regPharmRegNo}
                      onChange={(e) => setRegPharmRegNo(e.target.value)}
                      placeholder="KA-P-XXXX"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white rounded-xl transition-all focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#006a61] to-[#008578] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f8f9ff] border-t border-[#e5eeff] text-center">
          <p className="text-[10px] text-[#76777d]">
            By continuing, you agree to Genmedi's Terms of Service and Privacy Policy.
            <br />
            CDSCO Schedule H1 compliant • WHO-GMP verified supply chain
          </p>
        </div>
      </div>
    </div>
  );
};
