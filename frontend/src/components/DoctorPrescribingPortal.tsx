import React, { useState } from "react";
import {
  FileText,
  Stethoscope,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Search,
} from "lucide-react";

export const DoctorPrescribingPortal: React.FC = () => {
  const [mciVerified, setMciVerified] = useState(false);
  const [mciNumber, setMciNumber] = useState("");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState({
    patientName: "",
    patientPhone: "",
    diagnosis: "",
    medications: [] as Array<{ name: string; dosage: string; frequency: string; duration: string }>,
  });

  const handleMciVerification = () => {
    // Simulate MCI verification
    if (mciNumber.length >= 5) {
      setMciVerified(true);
    }
  };

  const addMedication = () => {
    setCurrentPrescription({
      ...currentPrescription,
      medications: [
        ...currentPrescription.medications,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    });
  };

  const removeMedication = (index: number) => {
    setCurrentPrescription({
      ...currentPrescription,
      medications: currentPrescription.medications.filter((_, i) => i !== index),
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...currentPrescription.medications];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentPrescription({ ...currentPrescription, medications: updated });
  };

  const savePrescription = () => {
    if (!currentPrescription.patientName || currentPrescription.medications.length === 0) {
      return;
    }
    setPrescriptions([
      ...prescriptions,
      {
        ...currentPrescription,
        id: `rx-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "draft",
      },
    ]);
    setCurrentPrescription({
      patientName: "",
      patientPhone: "",
      diagnosis: "",
      medications: [],
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="w-5 h-5 text-[#86f2e4]" />
          <span className="text-xs font-mono font-bold text-[#86f2e4] uppercase tracking-wider">
            DOCTOR E-PRESCRIBING PORTAL
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">Digital Prescription System</h2>
        <p className="text-xs text-white/70 mt-1">
          MCI-verified electronic prescribing with direct pharmacy integration
        </p>
      </div>

      {/* MCI Verification */}
      {!mciVerified ? (
        <div className="bg-white rounded-2xl border border-[#dce9ff] p-6 shadow-xs">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0b1c30] mb-1">MCI Registration Verification</h3>
              <p className="text-xs text-[#45464d]">
                Enter your Medical Council of India (MCI) registration number to access the prescribing portal.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">MCI Registration Number</label>
              <input
                type="text"
                value={mciNumber}
                onChange={(e) => setMciNumber(e.target.value)}
                placeholder="e.g., 12345678"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5eeff] text-sm focus:outline-none focus:border-[#006a61]"
              />
            </div>
            <button
              onClick={handleMciVerification}
              disabled={mciNumber.length < 5}
              className="w-full py-2.5 rounded-lg bg-[#006a61] text-white text-xs font-semibold hover:bg-[#005049] transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              Verify Registration
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Doctor Info Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-emerald-900">Dr. Verified Practitioner</div>
              <div className="text-[10px] text-emerald-800">MCI Reg: {mciNumber} • Active</div>
            </div>
          </div>

          {/* New Prescription Form */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0b1c30] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#006a61]" /> New Prescription
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#45464d] mb-1">Patient Name</label>
                <input
                  type="text"
                  value={currentPrescription.patientName}
                  onChange={(e) => setCurrentPrescription({ ...currentPrescription, patientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5eeff] text-xs focus:outline-none focus:border-[#006a61]"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#45464d] mb-1">Patient Phone</label>
                <input
                  type="text"
                  value={currentPrescription.patientPhone}
                  onChange={(e) => setCurrentPrescription({ ...currentPrescription, patientPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5eeff] text-xs focus:outline-none focus:border-[#006a61]"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#45464d] mb-1">Diagnosis</label>
              <input
                type="text"
                value={currentPrescription.diagnosis}
                onChange={(e) => setCurrentPrescription({ ...currentPrescription, diagnosis: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#e5eeff] text-xs focus:outline-none focus:border-[#006a61]"
                placeholder="Enter diagnosis"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-semibold text-[#45464d]">Medications</label>
                <button
                  onClick={addMedication}
                  className="text-[10px] font-semibold text-[#006a61] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Medication
                </button>
              </div>

              {currentPrescription.medications.map((med, index) => (
                <div key={index} className="bg-[#f8f9ff] rounded-lg p-3 mb-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#76777d]">Medication #{index + 1}</span>
                    <button
                      onClick={() => removeMedication(index)}
                      className="text-[#ba1a1a] hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(index, "name", e.target.value)}
                      placeholder="Medicine name"
                      className="px-2 py-1.5 rounded border border-[#e5eeff] text-[10px] focus:outline-none focus:border-[#006a61]"
                    />
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                      placeholder="Dosage (e.g., 500mg)"
                      className="px-2 py-1.5 rounded border border-[#e5eeff] text-[10px] focus:outline-none focus:border-[#006a61]"
                    />
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                      placeholder="Frequency (e.g., twice daily)"
                      className="px-2 py-1.5 rounded border border-[#e5eeff] text-[10px] focus:outline-none focus:border-[#006a61]"
                    />
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => updateMedication(index, "duration", e.target.value)}
                      placeholder="Duration (e.g., 7 days)"
                      className="px-2 py-1.5 rounded border border-[#e5eeff] text-[10px] focus:outline-none focus:border-[#006a61]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={savePrescription}
                className="flex-1 py-2.5 rounded-lg bg-[#006a61] text-white text-xs font-semibold hover:bg-[#005049] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save as Draft
              </button>
              <button
                onClick={savePrescription}
                className="flex-1 py-2.5 rounded-lg border border-[#006a61] text-[#006a61] text-xs font-semibold hover:bg-[#eff4ff] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send to Pharmacy
              </button>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs">
            <h3 className="font-bold text-sm text-[#0b1c30] mb-4">Recent Prescriptions</h3>
            {prescriptions.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#76777d]">No prescriptions yet</div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-xs text-[#0b1c30]">{rx.patientName}</div>
                      <span className="text-[10px] text-[#76777d]">{new Date(rx.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[10px] text-[#45464d] mb-2">{rx.diagnosis}</div>
                    <div className="text-[10px] text-[#76777d]">{rx.medications.length} medication(s)</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
