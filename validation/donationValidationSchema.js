export const scheduleDonationValidation = {
  date: {
    notEmpty: {
      errorMessage: "Donation date is required",
    },
  },
  time: {
    notEmpty: {
      errorMessage: "Donation time is required",
    },
  },
  phone: {
    notEmpty: {
      errorMessage: "Phone number is required",
    },
    matches: {
      options: [/^\d{10}$/],
      errorMessage: "Phone number must be exactly 10 digits",
    },
  },
  age: {
    notEmpty: {
      errorMessage: "Age is required",
    },
    isInt: {
      options: { min: 18 },
      errorMessage: "Age must be at least 18",
    },
  },

  eligibilityCriteria: {
    optional: true,
    isBoolean: {
      errorMessage: "Eligibility criteria must be a boolean value",
    },
  },
  rapidPass: {
    optional: true,
    isBoolean: {
      errorMessage: "RapidPass must be a boolean value",
    },
  },
};
