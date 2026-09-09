// Regulatory Compliance Service
// Handles DISHA (Digital Information Security in Healthcare Act), CDSCO, and ABHA integration

export interface ComplianceRecord {
  id: string;
  type: "disha" | "cdsco" | "abha";
  action: string;
  userId?: string;
  orderId?: string;
  timestamp: Date;
  details: Record<string, any>;
}

export class ComplianceService {
  private records: ComplianceRecord[] = [];

  /**
   * Log a compliance event
   */
  logEvent(type: "disha" | "cdsco" | "abha", action: string, details: Record<string, any> = {}) {
    const record: ComplianceRecord = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      timestamp: new Date(),
      details,
    };
    this.records.push(record);
    console.log(`[Compliance ${type.toUpperCase()}] ${action}`, details);
    return record;
  }

  /**
   * DISHA: Data access logging for healthcare data
   */
  logDataAccess(userId: string, dataType: string, purpose: string) {
    return this.logEvent("disha", "DATA_ACCESS", {
      userId,
      dataType,
      purpose,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * DISHA: Data modification logging
   */
  logDataModification(userId: string, dataType: string, changes: Record<string, any>) {
    return this.logEvent("disha", "DATA_MODIFICATION", {
      userId,
      dataType,
      changes,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * CDSCO: Schedule H1 drug logging
   */
  logScheduleH1Drug(drugName: string, prescriptionId: string, pharmacistId: string) {
    return this.logEvent("cdsco", "SCHEDULE_H1_DISPENSE", {
      drugName,
      prescriptionId,
      pharmacistId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * CDSCO: Cold chain monitoring
   */
  logColdChainReading(orderId: string, temperature: number, location: string) {
    return this.logEvent("cdsco", "COLD_CHAIN_READING", {
      orderId,
      temperature,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * ABHA: Health data linkage
   */
  logABHALinkage(abhaId: string, userId: string, consentGiven: boolean) {
    return this.logEvent("abha", "ABHA_LINKAGE", {
      abhaId,
      userId,
      consentGiven,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * ABHA: Prescription sharing
   */
  logABHAPrescriptionShare(abhaId: string, prescriptionId: string, recipient: string) {
    return this.logEvent("abha", "PRESCRIPTION_SHARE", {
      abhaId,
      prescriptionId,
      recipient,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get compliance records
   */
  getRecords(type?: "disha" | "cdsco" | "abha", limit = 100) {
    let filtered = this.records;
    if (type) {
      filtered = filtered.filter((r) => r.type === type);
    }
    return filtered.slice(-limit).reverse();
  }

  /**
   * Generate compliance report
   */
  generateReport(startDate: Date, endDate: Date) {
    const records = this.records.filter(
      (r) => r.timestamp >= startDate && r.timestamp <= endDate
    );

    return {
      period: { start: startDate, end: endDate },
      summary: {
        disha: records.filter((r) => r.type === "disha").length,
        cdsco: records.filter((r) => r.type === "cdsco").length,
        abha: records.filter((r) => r.type === "abha").length,
        total: records.length,
      },
      records,
    };
  }
}

// Singleton instance
export const complianceService = new ComplianceService();
