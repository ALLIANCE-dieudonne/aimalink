import mongoose from "mongoose";

const RapidPassSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Personal Information
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  address: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  nationalID: { type: String, required: true },
  bloodType: { type: String },
  occupation: { type: String },

  // Medical History
  donatedBefore: { type: Boolean, required: true },
  lastDonationDate: { type: Date },
  deferredBefore: { type: Boolean, required: true },
  deferredReason: { type: String },
  medications: { type: String },
  chronicIllnesses: { type: Boolean, required: true },
  hasCancerOrHeartDisease: { type: Boolean, required: true },
  hasSeizures: { type: Boolean, required: true },
  hasBloodInfections: { type: Boolean, required: true },
  recentSurgeries: { type: Boolean, required: true },
  receivedTransfusionOrTransplant: { type: Boolean, required: true },
  hasBloodDisorder: { type: Boolean, required: true },
  exposedToInfections: { type: Boolean, required: true },

  // Recent Health Status
  feelsWellToday: { type: Boolean, required: true },
  hadRecentFever: { type: Boolean, required: true },
  receivedVaccination: { type: Boolean, required: true },
  hadRecentDentalWork: { type: Boolean, required: true },
  unexplainedWeightLoss: { type: Boolean, required: true },

  // Lifestyle & Risk Factors
  usedInjectableDrugs: { type: Boolean, required: true },
  hadUnprotectedSex: { type: Boolean, required: true },
  diagnosedWithSTI: { type: Boolean, required: true },
  hadTattooOrPiercing: { type: Boolean, required: true },
  traveledOutsideCountry: { type: Boolean, required: true },
  exposedToContagiousDisease: { type: Boolean, required: true },
  highRiskJob: { type: Boolean, required: true },

  // Women's Health (For Female Donors)
  isPregnant: { type: Boolean },
  pregnantInLast6Months: { type: Boolean },
  pregnancyComplications: { type: Boolean },
  recentMiscarriage: { type: Boolean },

  // Allergies & Sensitivities
  hasAllergies: { type: Boolean, required: true },
  reactionToBloodDonation: { type: Boolean, required: true },

  // Consent & Final Check
  consentsToTesting: { type: Boolean, required: true },
  understandsDonationIsVoluntary: { type: Boolean, required: true },
  understandsBloodSeparation: { type: Boolean, required: true },

  // Eligibility Status
  eligibilityStatus: { type: String, enum: ["Eligible", "Not Eligible"], required: true },
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("RapidPass", RapidPassSchema);
