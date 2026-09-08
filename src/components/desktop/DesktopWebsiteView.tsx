import React from "react";
import { DesktopHeader } from "./DesktopHeader";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopFooter } from "./DesktopFooter";
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
  TabType, 
  CartItem, 
  Medicine, 
  Prescription, 
  OrderTracking, 
  StockistHub, 
  PriorityException 
} from "../../types";

interface DesktopWebsiteViewProps {
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
}

export const DesktopWebsiteView: React.FC<DesktopWebsiteViewProps> = ({
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
  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalBrand = cart.reduce((acc, i) => acc + (i.medicine?.brandPrice || 0) * (i.quantity || 1), 0);
  const totalGeneric = cart.reduce(
    (acc, i) => acc + (i.isGeneric ? (i.medicine?.genericPrice || 0) : (i.medicine?.brandPrice || 0)) * (i.quantity || 1),
    0
  );
  const cartSavings = Math.max(0, totalBrand - totalGeneric);

  // Tabs that display the desktop clinical sidebar alongside content
  const showSidebar = ["discover", "rx_vault", "bioequivalence_studio"].includes(currentTab);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Desktop Specific Header */}
      <DesktopHeader
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        cartCount={totalCartCount}
        cartSavings={cartSavings}
        onOpenCart={() => setCurrentTab("checkout")}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        emergencyContactNumber="+91 80 4912 8800"
      />

      {/* Main Desktop Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-6">
        {showSidebar ? (
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Main Content Area (8 or 9 cols) */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
              {currentTab === "discover" && (
                <DiscoverView
                  medicines={medicines}
                  stockists={stockists}
                  onAddToCart={onAddToCart}
                  onConsultAi={() => setCurrentTab("ai_pharmacist")}
                  onViewDissolution={() => setCurrentTab("bioequivalence_studio")}
                  onUploadRxClick={() => setCurrentTab("rx_vault")}
                  onSelectMedicine={() => setCurrentTab("bioequivalence_studio")}
                  searchQuery={searchQuery}
                />
              )}

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

              {currentTab === "bioequivalence_studio" && (
                <BioequivalenceStudioView
                  medicines={medicines}
                  onSelectMedicine={() => {}}
                />
              )}
            </div>

            {/* Persistent Desktop Clinical & Telemetry Sidebar (3 or 4 cols) */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3 sticky top-28">
              <DesktopSidebar
                tracking={trackingData}
                cart={cart}
                onNavigateTracking={() => setCurrentTab("tracking")}
                onNavigateCheckout={() => setCurrentTab("checkout")}
                onConsultAi={() => setCurrentTab("ai_pharmacist")}
                onCallRider={onCallRider}
              />
            </div>
          </div>
        ) : (
          /* Full Width Views */
          <div className="w-full">
            {currentTab === "checkout" && (
              <CheckoutView
                cart={cart}
                onPlaceOrder={onPlaceOrder}
                onUpdateQuantity={onUpdateQuantity}
                onOpenAllergyHelp={() => setCurrentTab("ai_pharmacist")}
              />
            )}

            {currentTab === "tracking" && (
              <LiveTrackingView
                tracking={trackingData}
                onCallRider={onCallRider}
                onCallHub={onCallHub}
              />
            )}

            {currentTab === "ai_pharmacist" && (
              <AIPharmacistView
                onAddToCart={onAddToCart}
                availableMedicines={medicines}
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
          </div>
        )}
      </main>

      {/* Desktop Multi-Column Footer */}
      <DesktopFooter />
    </div>
  );
};
