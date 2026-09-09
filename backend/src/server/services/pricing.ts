// Dynamic Pricing Engine with Surge Pricing
// Optimized for revenue maximization

export interface PricingConfig {
  baseDeliveryFee: number;
  baseServiceFee: number;
  surgeMultiplier: number;
  demandLevel: "low" | "medium" | "high" | "peak";
  timeOfDay: "off-peak" | "normal" | "peak";
  weatherFactor: number;
}

export interface OrderPricing {
  medicineCost: number;
  deliveryFee: number;
  serviceFee: number;
  surgeFee: number;
  discount: number;
  total: number;
  breakdown: {
    base: number;
    surge: number;
    discount: number;
  };
}

export class PricingEngine {
  private demandMetrics: Map<string, number> = new Map();
  private orderHistory: Array<{ timestamp: Date; amount: number }> = [];

  /**
   * Calculate dynamic pricing based on demand, time, and other factors
   */
  calculatePricing(
    medicineCost: number,
    location: string,
    distance: number
  ): OrderPricing {
    const config = this.getPricingConfig(location);
    const deliveryFee = this.calculateDeliveryFee(distance, config);
    const serviceFee = this.calculateServiceFee(medicineCost, config);
    const surgeFee = this.calculateSurgeFee(deliveryFee + serviceFee, config);
    const discount = this.calculateDiscount(medicineCost);

    const total = medicineCost + deliveryFee + serviceFee + surgeFee - discount;

    return {
      medicineCost,
      deliveryFee,
      serviceFee,
      surgeFee,
      discount,
      total: Math.max(0, total),
      breakdown: {
        base: deliveryFee + serviceFee,
        surge: surgeFee,
        discount,
      },
    };
  }

  /**
   * Get current pricing configuration based on demand and time
   */
  private getPricingConfig(location: string): PricingConfig {
    const now = new Date();
    const hour = now.getHours();
    const demandLevel = this.getDemandLevel(location);
    
    // Time-based pricing
    let timeOfDay: "off-peak" | "normal" | "peak" = "normal";
    if (hour >= 6 && hour < 10) timeOfDay = "peak"; // Morning rush
    else if (hour >= 18 && hour < 22) timeOfDay = "peak"; // Evening rush
    else if (hour >= 22 || hour < 6) timeOfDay = "off-peak"; // Night

    // Calculate surge multiplier
    let surgeMultiplier = 1.0;
    if (timeOfDay === "peak") surgeMultiplier += 0.3;
    if (demandLevel === "high") surgeMultiplier += 0.5;
    if (demandLevel === "peak") surgeMultiplier += 1.0;

    return {
      baseDeliveryFee: 49,
      baseServiceFee: 29,
      surgeMultiplier: Math.min(surgeMultiplier, 3.0), // Cap at 3x
      demandLevel,
      timeOfDay,
      weatherFactor: 1.0, // Can be enhanced with weather API
    };
  }

  /**
   * Calculate delivery fee based on distance and surge
   */
  private calculateDeliveryFee(distance: number, config: PricingConfig): number {
    const baseFee = config.baseDeliveryFee;
    const distanceFee = Math.max(0, distance - 3) * 10; // ₹10 per km after 3km
    const surge = (baseFee + distanceFee) * (config.surgeMultiplier - 1);
    
    return baseFee + distanceFee + surge;
  }

  /**
   * Calculate service fee based on order value
   */
  private calculateServiceFee(medicineCost: number, config: PricingConfig): number {
    const baseFee = config.baseServiceFee;
    const percentageFee = medicineCost * 0.05; // 5% service fee
    const surge = percentageFee * (config.surgeMultiplier - 1);
    
    return baseFee + percentageFee + surge;
  }

  /**
   * Calculate surge fee
   */
  private calculateSurgeFee(baseFee: number, config: PricingConfig): number {
    return baseFee * (config.surgeMultiplier - 1);
  }

  /**
   * Calculate discount based on user loyalty and promotions
   */
  private calculateDiscount(medicineCost: number): number {
    // First order discount
    const isFirstOrder = this.orderHistory.length === 0;
    if (isFirstOrder) {
      return Math.min(medicineCost * 0.2, 200); // 20% off, max ₹200
    }

    // Bulk order discount
    if (medicineCost > 1000) {
      return Math.min(medicineCost * 0.1, 150); // 10% off, max ₹150
    }

    return 0;
  }

  /**
   * Get demand level for a location
   */
  private getDemandLevel(location: string): "low" | "medium" | "high" | "peak" {
    const demand = this.demandMetrics.get(location) || 0;
    
    if (demand < 10) return "low";
    if (demand < 25) return "medium";
    if (demand < 50) return "high";
    return "peak";
  }

  /**
   * Record an order for demand tracking
   */
  recordOrder(location: string, amount: number) {
    const currentDemand = this.demandMetrics.get(location) || 0;
    this.demandMetrics.set(location, currentDemand + 1);
    
    // Decay demand over time (simple implementation)
    setTimeout(() => {
      const decayed = this.demandMetrics.get(location) || 0;
      this.demandMetrics.set(location, Math.max(0, decayed - 1));
    }, 30 * 60 * 1000); // Decay after 30 minutes

    this.orderHistory.push({ timestamp: new Date(), amount });
  }
}

// Singleton instance
export const pricingEngine = new PricingEngine();
