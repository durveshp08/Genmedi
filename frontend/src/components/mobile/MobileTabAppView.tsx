import React, { useState } from "react";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileQuickCategories } from "./MobileQuickCategories";
import { MobileRxScannerModal } from "./MobileRxScannerModal";
import { DiscoverView } from "../DiscoverView";
import { RxVaultView } from "../RxVaultView";
import { CheckoutView } from "../CheckoutView";
import { LiveTrackingView } from "../LiveTrackingView";
import { AIPharmacistView } from "../AIPharmacistView";
import { HealthVaultView } from "../HealthVaultView";
import { ClinicalReviewerView } from "../ClinicalReviewerView";
import { AdminOperationsView } from "../AdminOperationsView";
import { BioequivalenceStudioView } from "../BioequivalenceStudioView";
import { ExceptionResolutionView } from "../ExceptionResolutionView";
import { PharmacyHubView } from "../PharmacyHubView";
import { ArchitectureView } from "../ArchitectureView";
import { 
  Camera, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  TrendingDown, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Plus
} from "lucide-react";
import { 
  TabType, 
  CartItem, 
  Medicine, 
  Prescription, 
  OrderTracking, 
  StockistHub, 
  PriorityException 
} from "../../types";

interface MobileTabAppViewProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  cart: CartItem[];
  medicines: Medicine[];
  stockists: StockistHub[];
  prescriptions: Prescription[];
  trackingData: OrderTracking;
  exceptions: PriorityException[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddToCart: (med: Medicine, isGeneric: boolean) => void;
  onUpdateQuantity: (medId: string, qty: number) => void;
  onPlaceOrder: (speed: "fast_45" | "standard") => void;
  onResolveException: (id: string) => void;
  onAddAllRxToCart: (items: any[]) => void;
  onVerifyPrescription: (id: string) => void;
  onApplySubstitution: (rxId: string, medId: string) => void;
  onCallRider: () => void;
  onCallHub: () => void;
  onOpenAuth?: () => void;
  [key: string]: any;
}

export const MobileTabAppView: React.FC<MobileTabAppViewProps> = ({
  currentTab,
  setCurrentTab,
  cart,
  medicines,
  stockists,
  prescriptions,
  trackingData,
  exceptions,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onUpdateQuantity,
  onPlaceOrder,
  onResolveException,
  onAddAllRxToCart,
  onVerifyPrescription,
  onApplySubstitution,
  onCallRider,
  onCallHub,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [rxScannerOpen, setRxScannerOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  // Filter medicines by selected category or search query
  const filteredMeds = medicines.filter((m) => {
    const matchesCat = activeCategory === "all" || m.therapeuticClass.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans pb-20">
      {/* Mobile/Tablet App Header */}
      <MobileHeader
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        cartCount={totalCartCount}
        onOpenCart={() => setCurrentTab("checkout")}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        emergencyContactNumber="+91 80 4912 8800"
      />

      {/* Main Content Area optimized for Phone & Tablet Touch */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-6 pt-3 space-y-4">
        {/* Urgent 45-Min Fast Dispatch Mobile Status Ribbon (Visible on main tabs) */}
        {["discover", "checkout"].includes(currentTab) && (
          <aside aria-label="Express Dispatch Telemetry" className="bg-[#131b2e] text-white p-3 rounded-2xl flex items-center justify-between shadow-xs select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#86f2e4] text-[#00201d] flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>45-Min Express Dispatch</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500 text-white font-mono font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="text-[10px] text-white/70">
                  Apollo Hub #048 • Rider ETA {trackingData.etaMinutes} mins
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab("tracking")}
              className="px-3 py-1.5 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Track</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </aside>
        )}

        {/* Tab 1: Discover & Touch-Optimized Cards */}
        {currentTab === "discover" && (
          <div className="space-y-4">
            {/* Quick Horizontal Molecule Categories */}
            <MobileQuickCategories
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* Quick Prescription Upload & Camera Banner */}
            <div className="bg-white rounded-2xl border border-[#dce9ff] p-4 shadow-2xs flex items-center justify-between gap-3 select-none">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#006a61] tracking-wider">
                  Doctor Written Prescription?
                </span>
                <h3 className="text-xs font-bold text-[#0b1c30]">
                  Snap or upload Rx for instant generic mapping
                </h3>
                <p className="text-[10px] text-[#45464d]">
                  Save up to 75% with CDSCO licensed clinical review
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRxScannerOpen(true)}
                className="px-3 py-2 rounded-xl bg-[#86f2e4] text-[#00201d] font-bold text-xs hover:bg-[#70dfd0] transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Rx</span>
              </button>
            </div>

            {/* Render DiscoverView with mobile responsive container */}
            <DiscoverView
              medicines={filteredMeds.length > 0 ? filteredMeds : medicines}
              stockists={stockists}
              onAddToCart={onAddToCart}
              onConsultAi={() => setCurrentTab("ai_pharmacist")}
              onViewDissolution={() => setCurrentTab("bioequivalence_studio")}
              onUploadRxClick={() => setRxScannerOpen(true)}
              onSelectMedicine={() => setCurrentTab("bioequivalence_studio")}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Tab 2: Rx Vault */}
        {currentTab === "rx_vault" && (
          <RxVaultView
            prescriptions={prescriptions}
            onVerifyPrescription={onVerifyPrescription}
            onApplySubstitution={onApplySubstitution}
            onAddAllToCart={onAddAllRxToCart}
            onNavigateToCheckout={() => setCurrentTab("checkout")}
            onConsultAi={() => setCurrentTab("ai_pharmacist")}
          />
        )}

        {/* Tab 3: Checkout */}
        {currentTab === "checkout" && (
          <CheckoutView
            cart={cart}
            onPlaceOrder={onPlaceOrder}
            onUpdateQuantity={onUpdateQuantity}
            onOpenAllergyHelp={() => setCurrentTab("ai_pharmacist")}
          />
        )}

        {/* Tab 4: Live 45m Tracking */}
        {currentTab === "tracking" && (
          <LiveTrackingView
            tracking={trackingData}
            onCallRider={onCallRider}
            onCallHub={onCallHub}
          />
        )}

        {/* Tab 5: AI Pharmacist Chat */}
        {currentTab === "ai_pharmacist" && (
          <AIPharmacistView
            onAddToCart={onAddToCart}
            availableMedicines={medicines}
          />
        )}

        {/* Other Clinical & Ops Tabs */}
        {currentTab === "bioequivalence_studio" && (
          <BioequivalenceStudioView
            medicines={medicines}
            onSelectMedicine={() => {}}
          />
        )}

        {currentTab === "health_vault" && <HealthVaultView />}

        {currentTab === "clinical_reviewer" && (
          <ClinicalReviewerView prescriptions={prescriptions} />
        )}

        {currentTab === "admin_ops" && (
          <AdminOperationsView
            exceptions={exceptions}
            onResolveException={onResolveException}
            samplePrescriptions={prescriptions}
          />
        )}

        {currentTab === "exception_resolution" && <ExceptionResolutionView />}

        {currentTab === "pharmacy_hub" && <PharmacyHubView />}

        {currentTab === "architecture" && <ArchitectureView />}
      </main>

      {/* Floating Action Button (FAB) for Instant Rx Camera Scan */}
      <aside aria-label="Camera Prescription Scan" className="fixed bottom-18 right-4 sm:right-8 z-40 select-none">
        <button
          type="button"
          onClick={() => setRxScannerOpen(true)}
          className="w-13 h-13 rounded-full bg-[#006a61] text-white shadow-xl flex items-center justify-center hover:bg-[#005049] active:scale-95 transition-all ring-4 ring-white/80 cursor-pointer group"
          title="Scan Doctor Prescription"
        >
          <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </aside>

      {/* Touch Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        cartCount={totalCartCount}
      />

      {/* Mobile Camera OCR Scanner Modal */}
      <MobileRxScannerModal
        isOpen={rxScannerOpen}
        onClose={() => setRxScannerOpen(false)}
        onCompleteScan={() => {
          onAddAllRxToCart([
            { brandName: "Augmentin", molecule: "Amoxicillin" },
            { brandName: "Pan-D", molecule: "Pantoprazole" }
          ]);
        }}
      />
    </div>
  );
};
