export const scheduleDonationValidation = {
    dateTime: {
      notEmpty: {
        errorMessage: "Donation date and time are required",
      },
      isISO8601: {
        errorMessage: "Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
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
    driveLocation: {
      notEmpty: {
        errorMessage: "Drive location is required",
      },
      isString: {
        errorMessage: "Drive location must be a valid string",
      },
    },
    rapidPass: {
      optional: true,
      isBoolean: {
        errorMessage: "RapidPass must be a boolean value",
      },
    },
  };
  