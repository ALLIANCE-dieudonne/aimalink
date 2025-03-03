export const createUserSchema = {
  email: {
    isEmail: {
      errorMessage: "Invalid email address",
    },
    normalizeEmail: true,
  },
  fullNames: {
    notEmpty: {
      errorMessage: "Full names are required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Full names must be at least 3 characters",
    },
  },
  username: {
    notEmpty: {
      errorMessage: "Username is required",
    },
    isAlphanumeric: {
      errorMessage: "Username must only contain letters and numbers",
    },
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Username must be between 3 and 20 characters",
    },
  },
  location: {
    optional: true,
    isString: {
      errorMessage: "Location is invalid",
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options: /[A-Z]/,
      errorMessage: "Password must contain at least one uppercase letter",
    },
    matches: {
      options: /[a-z]/,
      errorMessage: "Password must contain at least one lowercase letter",
    },
    matches: {
      options: /[0-9]/,
      errorMessage: "Password must contain at least one number",
    },
    matches: {
      options: /[@$!%*?&#]/,
      errorMessage: "Password must contain at least one special character",
    },
  },
  confirmPassword: {
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      },
    },
  },
  phoneNumber: {
    optional: true,
    isMobilePhone: {
      errorMessage: "Invalid phone number",
    },
  },
  birthDate: {
    isDate: {
      errorMessage: "Invalid birth date",
    },
    custom: {
      options: (value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          throw new Error("You must be at least 18 years old");
        }
        return true;
      },
    },
  },
  bloodGroup: {
    notEmpty: {
      errorMessage: "Blood group is required",
    },
    isIn: {
      options: [["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]],
      errorMessage: "Invalid blood group",
    },
  },
  gender: {
    notEmpty: {
      errorMessage: "Gender is required",
    },
    isIn: {
      options: [["Male", "Female", "Other"]],
      errorMessage: "Gender must be Male, Female, or Other",
    },
  },
  rememberMe: {
    optional: true,
    isBoolean: {
      errorMessage: "Remember me must be a boolean value",
    },
  },
};
