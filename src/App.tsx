import React, { useState, useEffect } from "react";
import { DeviceModeSwitcher, DeviceMode } from "./components/DeviceModeSwitcher";
import { DesktopWebsiteView } from "./components/desktop/DesktopWebsiteView";
import { MobileTabAppView } from "./components/mobile/MobileTabAppView";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { 
  mockMedicines, 
  mockStockists, 
  mockPrescriptions, 
  mockOrderTracking, 
  mockExceptions 
} from "./data/mockData";
import { TabType, CartItem, Medicine, Prescription, OrderTracking } from "./types";
import { CheckCircle2 } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("discover");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("auto");
  const [detectedViewport, setDetectedViewport] = useState<"desktop" | "tablet" | "phone">("desktop");

  const [cart, setCart] = useState<CartItem[]>([
    {
      medicine: mockMedicines[0], // Augmentin -> Amoxyclav Generic
      quantity: 1,
      isGeneric: true,
    },
    {
      medicine: mockMedicines[1], // Pan-D Generic
      quantity: 1,
      isGeneric: true,
    },
    {
      medicine: mockMedicines[2], // Allegra Generic
      quantity: 1,
      isGeneric: true,
    },
  ]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [trackingData, setTrackingData] = useState<OrderTracking>(mockOrderTracking);
  const [exceptions, setExceptions] = useState(mockExceptions);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Responsive Viewport Detector
  useEffect(() => {
    const updateViewport = () => {
      const width = typeof window !== "undefined" ? window.innerWidth : 1200;
      if (width >= 1024) {
        setDetectedViewport("desktop");
      } else if (width >= 640) {
        setDetectedViewport("tablet");
      } else {
        setDetectedViewport("phone");
      }
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const isDesktopUI = 
    deviceMode === "desktop" || (deviceMode === "auto" && detectedViewport === "desktop");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddToCart = (med: Medicine, isGeneric: boolean) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === med.id && item.isGeneric === isGeneric);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === med.id && item.isGeneric === isGeneric
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine: med, quantity: 1, isGeneric }];
    });
    showToast(`Added ${isGeneric ? med.genericName : med.brandName} to cart`);
  };

  const handleUpdateQuantity = (medId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.medicine.id === medId ? { ...item, quantity: qty } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handlePlaceOrder = (speed: "fast_45" | "standard") => {
    showToast(`Order confirmed! 45-Min Fast Dispatch initiated from Hub #048.`);
    setCurrentTab("tracking");
  };

  const handleResolveException = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
    showToast(`Exception #${id} resolved: Courier reassignment dispatched.`);
  };

  const handleVerifyPrescription = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "verified" } : p))
    );
    showToast("Prescription verified with NABL bioequivalence mapping");
  };

  const handleApplySubstitution = (rxId: string, medId: string) => {
    showToast("Bioequivalent generic substituted with CDSCO verification");
  };

  const handleAddAllRxToCart = (items: any[]) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      const matched = mockMedicines.find(
        (m) => m.brandName.toLowerCase().includes((item.brandName || "").toLowerCase()) ||
               (item.molecule && m.genericName.toLowerCase().includes(item.molecule.toLowerCase()))
      ) || mockMedicines[0];

      if (matched) {
        handleAddToCart(matched, true);
      }
    });
    showToast("Added all bioequivalent generics from prescription to cart.");
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#86f2e4] selection:text-[#00201d]">
        {/* Device Switcher Banner: PC Website vs. Tab + Phone App */}
        <DeviceModeSwitcher
          currentMode={deviceMode}
          onModeChange={setDeviceMode}
          detectedViewport={detectedViewport}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <aside aria-label="Notification Alert" className="fixed top-20 right-4 sm:right-6 z-50 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-[#86f2e4] animate-in fade-in slide-in-from-top-3 max-w-[90vw] sm:max-w-md select-none">
            <CheckCircle2 className="w-4 h-4 text-[#86f2e4] shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </aside>
        )}

        {/* Render Distinct UI based on Device Mode / Viewport */}
        {isDesktopUI ? (
          <DesktopWebsiteView
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            cart={cart}
            medicines={mockMedicines}
            stockists={mockStockists}
            prescriptions={prescriptions}
            trackingData={trackingData}
            exceptions={exceptions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onPlaceOrder={handlePlaceOrder}
            onResolveException={handleResolveException}
            onAddAllRxToCart={handleAddAllRxToCart}
            onVerifyPrescription={handleVerifyPrescription}
            onApplySubstitution={handleApplySubstitution}
            onCallRider={() => showToast("Connecting to Express Courier Ramesh Kumar...")}
            onCallHub={() => showToast("Connecting to Apollo Hub #048 Dispatch Desk...")}
          />
        ) : (
          <MobileTabAppView
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            cart={cart}
            medicines={mockMedicines}
            stockists={mockStockists}
            prescriptions={prescriptions}
            trackingData={trackingData}
            exceptions={exceptions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onPlaceOrder={handlePlaceOrder}
            onResolveException={handleResolveException}
            onAddAllRxToCart={handleAddAllRxToCart}
            onVerifyPrescription={handleVerifyPrescription}
            onApplySubstitution={handleApplySubstitution}
            onCallRider={() => showToast("Connecting to Express Courier Ramesh Kumar...")}
            onCallHub={() => showToast("Connecting to Apollo Hub #048 Dispatch Desk...")}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

