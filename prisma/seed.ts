import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Genmedi database...\n");

  // ─── Clear existing data ────────────────────────────────
  await prisma.dissolutionData.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.priorityException.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.session.deleteMany();
  await prisma.userAllergy.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.stockistHub.deleteMany();

  // ─── Seed Users ─────────────────────────────────────────
  const passwordHash = await bcrypt.hash("genmedi123", 12);

  const patientUser = await prisma.user.create({
    data: {
      name: "Rahul Verma",
      email: "rahul@genmedi.in",
      phone: "+919876543210",
      passwordHash,
      role: "patient",
      age: 34,
      gender: "Male",
      abhaId: "ABHA-9182-7364-5500",
    },
  });

  const pharmacistUser = await prisma.user.create({
    data: {
      name: "R.Ph. Ananya Sharma",
      email: "pharmacist@genmedi.in",
      phone: "+919876543211",
      passwordHash,
      role: "pharmacist",
      age: 29,
      gender: "Female",
      pharmacistRegNo: "KA-P-8821",
      pharmacistVerified: true,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: "Dr. Vikram Patel",
      email: "admin@genmedi.in",
      phone: "+919876543212",
      passwordHash,
      role: "admin",
      age: 42,
      gender: "Male",
    },
  });

  const riderUser = await prisma.user.create({
    data: {
      name: "Ramesh Kumar",
      email: "rider@genmedi.in",
      phone: "+919876543213",
      passwordHash,
      role: "rider",
      age: 28,
      gender: "Male",
    },
  });

  console.log("✅ Created 4 users (patient, pharmacist, admin, rider)");

  // ─── Seed Patient Allergies ─────────────────────────────
  await prisma.userAllergy.createMany({
    data: [
      { userId: patientUser.id, allergen: "Penicillin", severity: "severe", notes: "Documented severe beta-lactam allergy since age 12" },
      { userId: patientUser.id, allergen: "Sulfonamides", severity: "moderate", notes: "Skin rash reported with Bactrim" },
      { userId: patientUser.id, allergen: "Ibuprofen", severity: "mild", notes: "Mild gastric irritation" },
    ],
  });

  console.log("✅ Created 3 allergies for patient");

  // ─── Seed Patient Addresses ─────────────────────────────
  await prisma.userAddress.createMany({
    data: [
      { userId: patientUser.id, label: "Home", address: "42 Brigade Road, Indiranagar", city: "Bengaluru", pincode: "560038", isDefault: true },
      { userId: patientUser.id, label: "Office", address: "WeWork Embassy, Outer Ring Road", city: "Bengaluru", pincode: "560103", isDefault: false },
    ],
  });

  console.log("✅ Created 2 addresses for patient");

  // ─── Seed Medicines ─────────────────────────────────────
  const meds = await Promise.all([
    prisma.medicine.create({
      data: {
        brandName: "Augmentin 625 Duo",
        brandManufacturer: "GlaxoSmithKline",
        brandPrice: 204.0,
        genericName: "Amoxyclav 625 (WHO-GMP)",
        genericManufacturer: "Cipla Ltd.",
        genericPrice: 64.2,
        dosage: "625mg",
        therapeuticClass: "Antibiotic",
        indication: "Bacterial infections, Upper respiratory tract infections",
        bioIndex: 99.8,
        savingsPercent: 68,
        inStock: true,
        dissolutionTimeMinutes: 45,
        aucRatio: 1.02,
        cmaxRatio: 0.98,
        allergenFlags: JSON.stringify(["Penicillin", "Beta-Lactam"]),
      },
    }),
    prisma.medicine.create({
      data: {
        brandName: "Lipitor 20mg",
        brandManufacturer: "Pfizer",
        brandPrice: 312.5,
        genericName: "Atorvastatin 20mg (WHO-GMP)",
        genericManufacturer: "Sun Pharma",
        genericPrice: 48.0,
        dosage: "20mg",
        therapeuticClass: "Statin",
        indication: "Hyperlipidemia, Cardiovascular risk reduction",
        bioIndex: 99.6,
        savingsPercent: 85,
        inStock: true,
        dissolutionTimeMinutes: 30,
        aucRatio: 1.01,
        cmaxRatio: 0.99,
      },
    }),
    prisma.medicine.create({
      data: {
        brandName: "Glucophage 500mg",
        brandManufacturer: "Merck",
        brandPrice: 186.0,
        genericName: "Metformin 500mg (WHO-GMP)",
        genericManufacturer: "USV Pvt. Ltd.",
        genericPrice: 24.5,
        dosage: "500mg",
        therapeuticClass: "Antidiabetic",
        indication: "Type 2 Diabetes Mellitus",
        bioIndex: 99.9,
        savingsPercent: 87,
        inStock: true,
        dissolutionTimeMinutes: 30,
        aucRatio: 1.0,
        cmaxRatio: 1.01,
      },
    }),
    prisma.medicine.create({
      data: {
        brandName: "Crestor 10mg",
        brandManufacturer: "AstraZeneca",
        brandPrice: 450.0,
        genericName: "Rosuvastatin 10mg (WHO-GMP)",
        genericManufacturer: "Dr. Reddy's",
        genericPrice: 62.0,
        dosage: "10mg",
        therapeuticClass: "Statin",
        indication: "Dyslipidemia, Primary prevention of cardiovascular events",
        bioIndex: 99.5,
        savingsPercent: 86,
        inStock: true,
        dissolutionTimeMinutes: 30,
        aucRatio: 0.99,
        cmaxRatio: 1.02,
      },
    }),
    prisma.medicine.create({
      data: {
        brandName: "Telma 40mg",
        brandManufacturer: "Glenmark",
        brandPrice: 230.0,
        genericName: "Telmisartan 40mg (WHO-GMP)",
        genericManufacturer: "Micro Labs",
        genericPrice: 35.0,
        dosage: "40mg",
        therapeuticClass: "ARB Antihypertensive",
        indication: "Hypertension, Cardiovascular protection",
        bioIndex: 99.7,
        savingsPercent: 85,
        inStock: true,
        dissolutionTimeMinutes: 30,
        aucRatio: 1.01,
        cmaxRatio: 0.98,
      },
    }),
    prisma.medicine.create({
      data: {
        brandName: "Pan 40mg",
        brandManufacturer: "Alkem",
        brandPrice: 155.0,
        genericName: "Pantoprazole 40mg (WHO-GMP)",
        genericManufacturer: "Mankind Pharma",
        genericPrice: 28.0,
        dosage: "40mg",
        therapeuticClass: "PPI",
        indication: "GERD, Peptic ulcer disease",
        bioIndex: 99.3,
        savingsPercent: 82,
        inStock: true,
        dissolutionTimeMinutes: 30,
        aucRatio: 1.03,
        cmaxRatio: 0.97,
      },
    }),
    prisma.medicine.create({
      data: {
        brandName: "Shelcal 500mg",
        brandManufacturer: "Torrent Pharma",
        brandPrice: 172.0,
        genericName: "Calcium + Vitamin D3 (WHO-GMP)",
        genericManufacturer: "Intas Pharma",
        genericPrice: 45.0,
        dosage: "500mg + 250IU",
        therapeuticClass: "Supplement",
        indication: "Calcium deficiency, Osteoporosis prevention",
        bioIndex: 99.4,
        savingsPercent: 74,
        inStock: false,
        dissolutionTimeMinutes: 45,
        aucRatio: 1.0,
        cmaxRatio: 1.0,
      },
    }),
    prisma.medicine.create({
      data: {
        brandName: "Ecosprin 75mg",
        brandManufacturer: "USV",
        brandPrice: 34.5,
        genericName: "Aspirin 75mg (WHO-GMP)",
        genericManufacturer: "Ipca Labs",
        genericPrice: 8.5,
        dosage: "75mg",
        therapeuticClass: "Antiplatelet",
        indication: "Cardiovascular prophylaxis, Post-MI maintenance",
        bioIndex: 99.7,
        savingsPercent: 75,
        inStock: true,
        dissolutionTimeMinutes: 30,
        aucRatio: 1.01,
        cmaxRatio: 0.99,
      },
    }),
  ]);

  console.log(`✅ Created ${meds.length} medicines`);

  // ─── Seed Stockist Hubs ─────────────────────────────────
  const hubs = await Promise.all([
    prisma.stockistHub.create({
      data: {
        name: "Apollo Hub #048 — Indiranagar",
        address: "100 Feet Road, Indiranagar, Bengaluru 560038",
        distanceKm: 1.4,
        fastDeliveryAvailable: true,
        estimatedDeliveryMins: 38,
        inStockQuantity: 1842,
        rating: 4.8,
        verifiedByCdsco: true,
        pricePerStrip: 64.2,
      },
    }),
    prisma.stockistHub.create({
      data: {
        name: "MedPlus #127 — Koramangala",
        address: "80 Feet Road, Koramangala 4th Block, Bengaluru 560034",
        distanceKm: 3.2,
        fastDeliveryAvailable: true,
        estimatedDeliveryMins: 52,
        inStockQuantity: 956,
        rating: 4.5,
        verifiedByCdsco: true,
        pricePerStrip: 66.8,
      },
    }),
    prisma.stockistHub.create({
      data: {
        name: "Netmeds Warehouse — Whitefield",
        address: "ITPL Road, Whitefield, Bengaluru 560066",
        distanceKm: 12.8,
        fastDeliveryAvailable: false,
        estimatedDeliveryMins: 180,
        inStockQuantity: 4210,
        rating: 4.2,
        verifiedByCdsco: true,
        pricePerStrip: 61.5,
      },
    }),
  ]);

  console.log(`✅ Created ${hubs.length} stockist hubs`);

  // ─── Seed Prescription ──────────────────────────────────
  const rx = await prisma.prescription.create({
    data: {
      doctorName: "Dr. S. Krishnamurthy",
      doctorRegNo: "KMC-48829",
      doctorClinic: "Fortis Hospital, Bannerghatta Road",
      patientName: "Rahul Verma",
      patientAge: 34,
      patientGender: "Male",
      patientAbhaId: "ABHA-9182-7364-5500",
      date: "14 Oct 2024",
      diagnosis: "Acute Upper Respiratory Tract Infection + Hyperlipidemia",
      status: "pending_review",
      items: {
        create: [
          {
            brandName: "Augmentin 625 Duo",
            molecule: "Amoxicillin 500mg + Clavulanic Acid 125mg",
            dosage: "1 Tab",
            frequency: "BD (Twice Daily)",
            duration: "5 days",
            brandPrice: 204.0,
            genericPrice: 64.2,
            genericSubstitute: "Amoxyclav 625 (WHO-GMP)",
            savingsPercent: 68,
            bioIndex: 99.8,
            allergyFlag: true,
          },
          {
            brandName: "Lipitor 20mg",
            molecule: "Atorvastatin 20mg",
            dosage: "1 Tab",
            frequency: "OD (Once Daily, Bedtime)",
            duration: "90 days",
            brandPrice: 312.5,
            genericPrice: 48.0,
            genericSubstitute: "Atorvastatin 20mg (WHO-GMP)",
            savingsPercent: 85,
            bioIndex: 99.6,
            allergyFlag: false,
          },
        ],
      },
    },
  });

  console.log("✅ Created 1 prescription with 2 items");

  // ─── Seed Order ─────────────────────────────────────────
  const order = await prisma.order.create({
    data: {
      status: "in_transit",
      etaMinutes: 18,
      riderName: "Ramesh Kumar",
      riderPhone: "+91 98765 43213",
      riderRating: 4.9,
      vehicle: "EV Scooter (Ather 450X)",
      currentSpeedKmh: 28.5,
      boxTemperatureCelsius: 4.2,
      handoverOtp: "7829",
      hubName: "Apollo Hub #048",
      hubAddress: "100 Feet Road, Indiranagar",
      customerAddress: "42 Brigade Road, Indiranagar, BLR 560038",
      tamperSealBarcode: "GM-SEAL-2024-48291",
      prescriptionId: rx.id,
      stages: JSON.stringify([
        { title: "Rx Verified", time: "2:14 PM", completed: true, active: false, description: "NABL-verified by R.Ph. Ananya Sharma" },
        { title: "Hub Dispensed", time: "2:22 PM", completed: true, active: false, description: "Apollo Hub #048 packed & sealed" },
        { title: "Rider Picked", time: "2:31 PM", completed: true, active: false, description: "Ramesh Kumar (EV Ather 450X)" },
        { title: "In Transit", time: "Now", completed: false, active: true, description: "28.5 km/h • Box 4.2°C • ETA 18 min" },
        { title: "Delivered", time: "ETA 2:49 PM", completed: false, active: false, description: "OTP 7829 required at handover" },
      ]),
    },
  });

  console.log("✅ Created 1 order with tracking data");

  // ─── Seed Exceptions ────────────────────────────────────
  await prisma.priorityException.createMany({
    data: [
      {
        type: "cold_chain_breach",
        severity: "critical",
        description: "Temperature spike to 12.8°C detected in insulin shipment GM-INS-2024-1847",
        slaRemainingMins: 8,
        riderName: "Suresh Babu",
        status: "active",
        timestamp: "2024-10-14T14:28:00Z",
        orderId: order.id,
      },
      {
        type: "courier_breakdown",
        severity: "high",
        description: "EV battery critical (4%) — Rider Kavitha stranded at MG Road junction",
        slaRemainingMins: 15,
        riderName: "Kavitha R.",
        status: "active",
        timestamp: "2024-10-14T14:18:00Z",
        orderId: order.id,
      },
      {
        type: "rx_illegible",
        severity: "medium",
        description: "OCR confidence 34% on Dr. Mehta's prescription — manual review required",
        slaRemainingMins: 45,
        status: "active",
        timestamp: "2024-10-14T14:05:00Z",
        orderId: order.id,
      },
    ],
  });

  console.log("✅ Created 3 priority exceptions");

  // ─── Seed Dissolution Data ──────────────────────────────
  const augmentin = meds[0];
  await prisma.dissolutionData.createMany({
    data: [
      { medicineId: augmentin.id, timeMinutes: 5, innovatorRelease: 12, genericRelease: 11, toleranceLower: 7, toleranceUpper: 17 },
      { medicineId: augmentin.id, timeMinutes: 10, innovatorRelease: 35, genericRelease: 33, toleranceLower: 25, toleranceUpper: 45 },
      { medicineId: augmentin.id, timeMinutes: 15, innovatorRelease: 58, genericRelease: 56, toleranceLower: 48, toleranceUpper: 68 },
      { medicineId: augmentin.id, timeMinutes: 30, innovatorRelease: 85, genericRelease: 83, toleranceLower: 75, toleranceUpper: 95 },
      { medicineId: augmentin.id, timeMinutes: 45, innovatorRelease: 96, genericRelease: 95, toleranceLower: 86, toleranceUpper: 100 },
      { medicineId: augmentin.id, timeMinutes: 60, innovatorRelease: 99, genericRelease: 98, toleranceLower: 89, toleranceUpper: 100 },
    ],
  });

  console.log("✅ Created 6 dissolution data points");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Seed User Credentials (all passwords: genmedi123):");
  console.log("   Patient:    rahul@genmedi.in");
  console.log("   Pharmacist: pharmacist@genmedi.in");
  console.log("   Admin:      admin@genmedi.in");
  console.log("   Rider:      rider@genmedi.in");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
