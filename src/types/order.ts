export type OrderStatus =
  | "pending"
  | "confirmed"
  | "payment_pending"
  | "paid"
  | "processing"
  | "pharmacist_review"
  | "verified"
  | "packing"
  | "ready_for_pickup"
  | "dispatched"
  | "out_for_delivery"
  | "near_location"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "exception";

export interface OrderTransition {
  from: OrderStatus;
  to: OrderStatus;
  allowed: boolean;
  requiresAuth?: boolean;
  requiresRole?: string[];
}

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderTransition[]> = {
  pending: [
    { from: "pending", to: "confirmed", allowed: true },
    { from: "pending", to: "cancelled", allowed: true },
  ],
  confirmed: [
    { from: "confirmed", to: "payment_pending", allowed: true },
    { from: "confirmed", to: "cancelled", allowed: true },
  ],
  payment_pending: [
    { from: "payment_pending", to: "paid", allowed: true },
    { from: "payment_pending", to: "cancelled", allowed: true },
  ],
  paid: [
    { from: "paid", to: "processing", allowed: true },
    { from: "paid", to: "refunded", allowed: true, requiresAuth: true, requiresRole: ["admin"] },
  ],
  processing: [
    { from: "processing", to: "pharmacist_review", allowed: true },
    { from: "processing", to: "exception", allowed: true },
  ],
  pharmacist_review: [
    { from: "pharmacist_review", to: "verified", allowed: true, requiresAuth: true, requiresRole: ["pharmacist", "admin"] },
    { from: "pharmacist_review", to: "cancelled", allowed: true, requiresAuth: true, requiresRole: ["pharmacist", "admin"] },
  ],
  verified: [
    { from: "verified", to: "packing", allowed: true },
  ],
  packing: [
    { from: "packing", to: "ready_for_pickup", allowed: true },
  ],
  ready_for_pickup: [
    { from: "ready_for_pickup", to: "dispatched", allowed: true },
  ],
  dispatched: [
    { from: "dispatched", to: "out_for_delivery", allowed: true },
  ],
  out_for_delivery: [
    { from: "out_for_delivery", to: "near_location", allowed: true },
    { from: "out_for_delivery", to: "delivered", allowed: true },
    { from: "out_for_delivery", to: "exception", allowed: true },
  ],
  near_location: [
    { from: "near_location", to: "delivered", allowed: true },
  ],
  delivered: [
    // Terminal state - no transitions
  ],
  cancelled: [
    // Terminal state - no transitions
  ],
  refunded: [
    // Terminal state - no transitions
  ],
  exception: [
    { from: "exception", to: "processing", allowed: true, requiresAuth: true, requiresRole: ["admin"] },
    { from: "exception", to: "cancelled", allowed: true, requiresAuth: true, requiresRole: ["admin"] },
  ],
};

export function canTransition(from: OrderStatus, to: OrderStatus, userRole?: string): boolean {
  const transitions = ORDER_TRANSITIONS[from];
  const transition = transitions.find((t) => t.to === to);
  
  if (!transition || !transition.allowed) return false;
  
  if (transition.requiresAuth && !userRole) return false;
  
  if (transition.requiresRole && userRole && !transition.requiresRole.includes(userRole)) {
    return false;
  }
  
  return true;
}

export function getNextStatuses(currentStatus: OrderStatus, userRole?: string): OrderStatus[] {
  const transitions = ORDER_TRANSITIONS[currentStatus];
  return transitions
    .filter((t) => {
      if (!t.allowed) return false;
      if (t.requiresAuth && !userRole) return false;
      if (t.requiresRole && userRole && !t.requiresRole.includes(userRole)) return false;
      return true;
    })
    .map((t) => t.to);
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    payment_pending: "Payment Pending",
    paid: "Paid",
    processing: "Processing",
    pharmacist_review: "Pharmacist Review",
    verified: "Verified",
    packing: "Packing",
    ready_for_pickup: "Ready for Pickup",
    dispatched: "Dispatched",
    out_for_delivery: "Out for Delivery",
    near_location: "Near Location",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
    exception: "Exception",
  };
  return labels[status];
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: "bg-gray-100 text-gray-700",
    confirmed: "bg-blue-100 text-blue-700",
    payment_pending: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    processing: "bg-blue-100 text-blue-700",
    pharmacist_review: "bg-purple-100 text-purple-700",
    verified: "bg-emerald-100 text-emerald-700",
    packing: "bg-blue-100 text-blue-700",
    ready_for_pickup: "bg-cyan-100 text-cyan-700",
    dispatched: "bg-indigo-100 text-indigo-700",
    out_for_delivery: "bg-violet-100 text-violet-700",
    near_location: "bg-fuchsia-100 text-fuchsia-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-orange-100 text-orange-700",
    exception: "bg-red-100 text-red-700",
  };
  return colors[status];
}
