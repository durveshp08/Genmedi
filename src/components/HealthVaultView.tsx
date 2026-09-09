import React, { useState, useEffect } from "react";
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
  ExternalLink,
  Loader2,
  X,
  Edit2,
  Trash2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import type { UserAllergy, UserAddress } from "../types/auth";

export const HealthVaultView: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeProfile, setActiveProfile] = useState("self");
  const [autoRefillMetformin, setAutoRefillMetformin] = useState(true);
  const [autoRefillAtorvastatin, setAutoRefillAtorvastatin] = useState(true);
  
  // API-sourced data
  const [allergies, setAllergies] = useState<UserAllergy[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  // Form states
  const [newAllergy, setNewAllergy] = useState({ allergen: "", severity: "moderate" as const, notes: "" });
  const [newAddress, setNewAddress] = useState({ label: "", address: "", city: "", pincode: "", isDefault: false });

  // Load user profile data
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [allergiesData, addressesData] = await Promise.all([
          api.profile.listAllergies(),
          api.profile.listAddresses(),
        ]);
        setAllergies(allergiesData);
        setAddresses(addressesData);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [isAuthenticated, user]);

  const handleAddAllergy = async () => {
    if (!newAllergy.allergen.trim()) return;
    try {
      const added = await api.profile.addAllergy(newAllergy);
      setAllergies([...allergies, added]);
      setNewAllergy({ allergen: "", severity: "moderate", notes: "" });
      setShowAddAllergy(false);
    } catch (err) {
      console.error("Failed to add allergy:", err);
    }
  };

  const handleRemoveAllergy = async (id: string) => {
    try {
      await api.profile.removeAllergy(id);
      setAllergies(allergies.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to remove allergy:", err);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.label || !newAddress.address || !newAddress.city || !newAddress.pincode) return;
    try {
      const added = await api.profile.addAddress(newAddress);
      setAddresses([...addresses, added]);
      setNewAddress({ label: "", address: "", city: "", pincode: "", isDefault: false });
      setShowAddAddress(false);
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      await api.profile.removeAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to remove address:", err);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await api.profile.setDefaultAddress(id);
      setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#006a61]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <ShieldCheck className="w-12 h-12 mx-auto text-[#76777d] mb-4" />
        <p className="text-sm text-[#45464d]">Please sign in to access your Health Vault</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006a61] to-[#131b2e] text-[#86f2e4] flex items-center justify-center font-bold text-xl font-mono shadow-sm">
            {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#0b1c30]">{user?.name || "User"}</h2>
              {user?.age && user?.gender && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006a61] font-bold">
                  {user.age} Yrs • {user.gender}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#45464d] font-mono">
              {user?.abhaId && <span>ABHA ID: {user.abhaId}</span>}
              {user?.phone && <span>•</span>}
              {user?.phone && <span>{user.phone}</span>}
              {user?.abhaId && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" /> NDHM Linked
                  </span>
                </>
              )}
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
              <button
                onClick={() => setShowAddAllergy(true)}
                className="text-[11px] text-[#006a61] font-bold cursor-pointer hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Allergy
              </button>
            </div>

            {/* Add Allergy Form */}
            {showAddAllergy && (
              <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0b1c30]">Add New Allergy</span>
                  <button onClick={() => setShowAddAllergy(false)} className="text-[#76777d] hover:text-[#0b1c30]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Allergen (e.g., Penicillin)"
                  value={newAllergy.allergen}
                  onChange={(e) => setNewAllergy({ ...newAllergy, allergen: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#dce9ff] rounded-lg focus:border-[#006a61] focus:outline-hidden"
                />
                <select
                  value={newAllergy.severity}
                  onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#dce9ff] rounded-lg focus:border-[#006a61] focus:outline-hidden"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                <textarea
                  placeholder="Notes (optional)"
                  value={newAllergy.notes}
                  onChange={(e) => setNewAllergy({ ...newAllergy, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#dce9ff] rounded-lg focus:border-[#006a61] focus:outline-hidden resize-none"
                  rows={2}
                />
                <button
                  onClick={handleAddAllergy}
                  className="w-full py-2 bg-[#006a61] text-white text-xs font-bold rounded-lg hover:bg-[#008578] transition-colors"
                >
                  Add Allergy
                </button>
              </div>
            )}

            {/* Allergies List */}
            {allergies.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-xs text-[#76777d] text-center">
                No documented allergies
              </div>
            ) : (
              <div className="space-y-2">
                {allergies.map((allergy) => (
                  <div
                    key={allergy.id}
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      allergy.severity === "severe"
                        ? "bg-amber-50 border-amber-200"
                        : allergy.severity === "moderate"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-[#f8f9ff] border-[#e5eeff]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs">{allergy.allergen}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          allergy.severity === "severe"
                            ? "bg-amber-200 text-amber-900"
                            : allergy.severity === "moderate"
                            ? "bg-orange-200 text-orange-900"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {allergy.severity}
                        </span>
                        <button
                          onClick={() => handleRemoveAllergy(allergy.id)}
                          className="text-[#76777d] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {allergy.notes && (
                      <p className="text-[11px] leading-relaxed">{allergy.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
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

          {/* Saved Delivery Addresses */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#006a61]" /> Saved Delivery Addresses
              </h3>
              <button
                onClick={() => setShowAddAddress(true)}
                className="text-[11px] text-[#006a61] font-bold cursor-pointer hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Address
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dce9ff] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0b1c30]">Add New Address</span>
                  <button onClick={() => setShowAddAddress(false)} className="text-[#76777d] hover:text-[#0b1c30]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Label (e.g., Home, Office)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#dce9ff] rounded-lg focus:border-[#006a61] focus:outline-hidden"
                />
                <textarea
                  placeholder="Street Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#dce9ff] rounded-lg focus:border-[#006a61] focus:outline-hidden resize-none"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#dce9ff] rounded-lg focus:border-[#006a61] focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#dce9ff] rounded-lg focus:border-[#006a61] focus:outline-hidden"
                />
                <label className="flex items-center gap-2 text-xs text-[#45464d]">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="rounded border-[#dce9ff] text-[#006a61] focus:ring-[#006a61]"
                  />
                  Set as default address
                </label>
                <button
                  onClick={handleAddAddress}
                  className="w-full py-2 bg-[#006a61] text-white text-xs font-bold rounded-lg hover:bg-[#008578] transition-colors"
                >
                  Add Address
                </button>
              </div>
            )}

            {/* Addresses List */}
            {addresses.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-xs text-[#76777d] text-center">
                No saved addresses
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-3 rounded-xl border flex justify-between items-start ${
                      address.isDefault ? "bg-[#eff4ff] border-[#006a61]" : "bg-[#f8f9ff] border-[#e5eeff]"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0b1c30]">{address.label}</span>
                        {address.isDefault && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#006a61] text-white font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#45464d] mt-1">{address.address}</p>
                      <p className="text-[11px] text-[#76777d] font-mono">{address.city} • {address.pincode}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="p-1.5 text-[#76777d] hover:text-[#006a61] transition-colors"
                          title="Set as default"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveAddress(address.id)}
                        className="p-1.5 text-[#76777d] hover:text-red-600 transition-colors"
                        title="Remove address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ICE Emergency Contact */}
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
