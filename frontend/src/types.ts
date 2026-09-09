export interface Medicine {
  id: string;
  brandName: string;
  brandManufacturer: string;
  brandPrice: number;
  genericName: string;
  genericManufacturer: string;
  genericPrice: number;
  dosage: string;
  therapeuticClass: string;
  indication: string;
  bioIndex: number;
  savingsPercent: number;
  inStock: boolean;
  whoGmpCertified: boolean;
  nablAudited: boolean;
  cdscoApproved: boolean;
  dissolutionTimeMinutes: number;
  aucRatio: number;
  cmaxRatio: number;
  allergenFlags?: string[];
}

export interface StockistHub {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  fastDeliveryAvailable: boolean;
  estimatedDeliveryMins: number;
  inStockQuantity: number;
  rating: number;
  verifiedByCdsco: boolean;
  pricePerStrip: number;
}

export interface PrescriptionItem {
  id: string;
  brandName: string;
  molecule: string;
  dosage: string;
  frequency: string;
  duration: string;
  brandPrice: number;
  genericPrice: number;
  genericSubstitute: string;
  savingsPercent: number;
  bioIndex: number;
  allergyFlag?: boolean;
}

export interface Prescription {
  id: string;
  doctorName: string;
  doctorRegNo: string;
  doctorClinic: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAbhaId: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  status: "verified" | "pending_review" | "rejected";
  pharmacistSignature?: {
    name: string;
    regNo: string;
    timestamp: string;
    sha256Hash: string;
  };
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  isGeneric: boolean;
}

export interface OrderTracking {
  orderId: string;
  status: "order_placed" | "rx_verified" | "hub_dispensed" | "rider_picked" | "in_transit" | "delivered";
  etaMinutes: number;
  riderName: string;
  riderPhone: string;
  riderRating: number;
  vehicle: string;
  currentSpeedKmh: number;
  boxTemperatureCelsius: number;
  handoverOtp: string;
  hubName: string;
  hubAddress: string;
  customerAddress: string;
  tamperSealBarcode: string;
  stages: {
    title: string;
    time: string;
    completed: boolean;
    active: boolean;
    description: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  moleculeCard?: {
    name: string;
    generic: string;
    bioIndex: number;
    savings: string;
    auc: string;
    dissolution: string;
  };
}

export interface PriorityException {
  id: string;
  orderId: string;
  hub: string;
  type: "cold_chain_breach" | "courier_breakdown" | "rx_illegible" | "out_of_stock";
  severity: "critical" | "high" | "medium";
  description: string;
  slaRemainingMins: number;
  riderName?: string;
  status: "active" | "resolving" | "resolved";
  timestamp: string;
}

export interface DissolutionCurveData {
  timeMinutes: number;
  innovatorRelease: number;
  genericRelease: number;
  toleranceLower: number;
  toleranceUpper: number;
}

export type TabType = 
  | "discover" 
  | "rx_vault" 
  | "checkout" 
  | "tracking" 
  | "ai_pharmacist" 
  | "health_vault"
  | "clinical_reviewer"
  | "admin_ops"
  | "bioequivalence_studio"
  | "exception_resolution"
  | "pharmacy_hub"
  | "architecture";
