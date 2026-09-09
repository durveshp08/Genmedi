import React, { useState } from "react";
import { Camera, X, CheckCircle2, Sparkles, RefreshCw, Upload, ShieldCheck } from "lucide-react";

interface MobileRxScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteScan: () => void;
}

export const MobileRxScannerModal: React.FC<MobileRxScannerModalProps> = ({
  isOpen,
  onClose,
  onCompleteScan,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scannedDone, setScannedDone] = useState(false);

  if (!isOpen) return null;

  const handleTriggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedDone(true);
    }, 1800);
  };

  const handleApplyAndClose = () => {
    onCompleteScan();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end select-none animate-in fade-in">
      <div className="bg-white rounded-t-3xl max-w-lg mx-auto w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eff4ff] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#eff4ff] text-[#006a61]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Mobile Rx Scanner</h3>
              <p className="text-[11px] text-[#45464d]">CDSCO AI Optical Molecule Parser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#76777d] hover:bg-[#eff4ff] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative bg-slate-950 rounded-2xl h-64 overflow-hidden border-2 border-dashed border-[#86f2e4]/50 flex items-center justify-center text-center p-4">
          {/* Simulated scan line */}
          {scanning && (
            <div className="absolute inset-x-0 h-1 bg-[#86f2e4] shadow-[0_0_15px_#86f2e4] animate-bounce top-1/4" />
          )}

          {!scannedDone ? (
            <div className="space-y-3 z-10">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#86f2e4] flex items-center justify-center text-[#86f2e4]">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs text-white/80">
                Hold your camera steady over doctor&apos;s written prescription
              </p>
              <button
                type="button"
                onClick={handleTriggerScan}
                disabled={scanning}
                className="px-5 py-2.5 rounded-xl bg-[#86f2e4] text-[#00201d] font-bold text-xs hover:bg-[#72decf] transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>OCR Parsing Molecules...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Capture &amp; OCR Scan</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3 z-10 text-white animate-in zoom-in-95">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">3 Bioequivalent Molecules Detected!</h4>
                <p className="text-[11px] text-white/70 mt-1">
                  Augmentin 625 ➔ Amoxyclav 625 (Save 68%)<br />
                  Pan-D ➔ Pantoprazole + Domp (Save 75%)
                </p>
              </div>
            </div>
          )}

          {/* Corner frame indicators */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#86f2e4]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#86f2e4]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#86f2e4]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#86f2e4]" />
        </div>

        {/* Footer Actions */}
        {scannedDone ? (
          <button
            type="button"
            onClick={handleApplyAndClose}
            className="w-full py-3.5 rounded-xl bg-[#006a61] text-white font-bold text-xs hover:bg-[#005049] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Bioequivalent Substitutions to Cart</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-[11px] text-[#76777d]">
            <ShieldCheck className="w-4 h-4 text-[#006a61] shrink-0" />
            <span>Encrypted transmission to CDSCO licensed registered pharmacist.</span>
          </div>
        )}
      </div>
    </div>
  );
};
