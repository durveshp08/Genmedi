import React from "react";
import { Monitor, Smartphone, Tablet, Sparkles, SlidersHorizontal } from "lucide-react";

export type DeviceMode = "auto" | "desktop" | "mobile_tab";

interface DeviceModeSwitcherProps {
  currentMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  detectedViewport: "desktop" | "tablet" | "phone";
}

export const DeviceModeSwitcher: React.FC<DeviceModeSwitcherProps> = ({
  currentMode,
  onModeChange,
  detectedViewport,
}) => {
  return (
    <aside aria-label="Device Viewport Switcher" className="bg-[#0b1329] text-white text-xs border-b border-white/10 px-3 sm:px-6 py-2 select-none relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left: Indicator of active UI Experience */}
        <div className="flex items-center gap-2 text-[11px] text-white/80">
          <span className="w-2 h-2 rounded-full bg-[#86f2e4] animate-pulse"></span>
          <span className="font-semibold text-white">Dual UI Engine:</span>
          <span className="text-white/60 hidden md:inline">Viewing optimized interface for</span>
          <span className="font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#86f2e4] font-bold">
            {currentMode === "auto"
              ? `Auto-Detected: ${detectedViewport === "desktop" ? "PC Website" : detectedViewport === "tablet" ? "Tablet App" : "Phone App"}`
              : currentMode === "desktop"
              ? "PC Website (Desktop)"
              : "Tab + Phone (Touch App)"}
          </span>
        </div>

        {/* Right: Explicit UI Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => onModeChange("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentMode === "desktop"
                ? "bg-[#006a61] text-white shadow-xs font-bold"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Switch to PC Website Experience"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>PC Website</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange("mobile_tab")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentMode === "mobile_tab"
                ? "bg-[#006a61] text-white shadow-xs font-bold"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Switch to Tab + Phone App Experience"
          >
            <div className="flex items-center -space-x-1">
              <Tablet className="w-3.5 h-3.5" />
              <Smartphone className="w-3 h-3" />
            </div>
            <span>Tab + Phone</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange("auto")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              currentMode === "auto"
                ? "bg-white/20 text-[#86f2e4] font-bold"
                : "text-white/50 hover:text-white/80"
            }`}
            title="Auto-switch based on browser window size"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
