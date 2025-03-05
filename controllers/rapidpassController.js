import RapidPass from "../db/schemas/rapidpassSchema.js";

export const rapidpass = async (req, res) => {
  try {
    const data = req.body;
    // Check if all required fields are provided
    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "gender",
      "contactInfo",
      "address",
      "emergencyContact",
      "nationalID",
      "donatedBefore",
      "deferredBefore",
      "chronicIllnesses",
      "hasCancerOrHeartDisease",
      "hasSeizures",
      "hasBloodInfections",
      "recentSurgeries",
      "receivedTransfusionOrTransplant",
      "hasBloodDisorder",
      "exposedToInfections",
      "feelsWellToday",
      "hadRecentFever",
      "receivedVaccination",
      "hadRecentDentalWork",
      "unexplainedWeightLoss",
      "usedInjectableDrugs",
      "hadUnprotectedSex",
      "diagnosedWithSTI",
      "hadTattooOrPiercing",
      "traveledOutsideCountry",
      "exposedToContagiousDisease",
      "highRiskJob",
      "hasAllergies",
      "reactionToBloodDonation",
      "consentsToTesting",
      "understandsDonationIsVoluntary",
      "understandsBloodSeparation",
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }

    // Screening Logic (determine eligibility)
    const ineligibleConditions = [
      data.deferredBefore,
      data.chronicIllnesses,
      data.hasCancerOrHeartDisease,
      data.hasSeizures,
      data.hasBloodInfections,
      data.recentSurgeries,
      data.receivedTransfusionOrTransplant,
      data.hasBloodDisorder,
      data.exposedToInfections,
      data.hadRecentFever,
      data.unexplainedWeightLoss,
      data.usedInjectableDrugs,
      data.hadUnprotectedSex,
      data.diagnosedWithSTI,
      data.hadTattooOrPiercing,
      data.traveledOutsideCountry,
      data.exposedToContagiousDisease,
      data.highRiskJob,
      data.reactionToBloodDonation,
    ];

    // Women’s health screening (only applies to female donors)
    if (data.gender === "Female") {
      ineligibleConditions.push(
        data.isPregnant,
        data.pregnantInLast6Months,
        data.pregnancyComplications,
        data.recentMiscarriage
      );
    }

    const isEligible = !ineligibleConditions.includes(true);

    // Save Rapid Pass
    const rapidPass = new RapidPass({
      ...data,
      eligibilityStatus: isEligible ? "Eligible" : "Not Eligible",
    });

    await rapidPass.save();
    res.status(201).json({ message: "Rapid Pass created", rapidPass });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
