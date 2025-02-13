import { Router } from "express";
import User from "../db/schemas/userSchema.js";
import { createUserSchema } from "../validation/userValidationSchema.js";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { comparePassword, hashPassword } from "../utils/helpers.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import { Strategy as FacebookStrategy } from "passport-facebook";
import bcrypt from "bcrypt";
import UserOtp from "../db/schemas/userOTP.js";
import { Strategy as LocalStrategy } from "passport-local";
import { sendMail } from "../utils/email.js";

dotenv.config();

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`deserialized user ${id}`);

  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
// Set up Google OAuth2 strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:8082/auth/google/callback",
//       passReqToCallback: true,
//     },
//     async (request, accessToken, refreshToken, profile, done) => {
//       // Authentication logic
//       return done(null, profile);
//     }
//   )
// );

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   async (req, res, next) => {
//     try {
//       const { user } = req;

//       // Check if user already exists in the database
//       let foundUser = await User.findOne({ email: user.email });

//       if (foundUser) {
//         console.log("User already exists.");
//       } else {
//         // Create a new user if not found
//         const newUserDetails = {
//           email: user.email,
//           fullNames: user.displayName || "Google User",
//           username: user.given_name,
//           location: "Unknown", // Placeholder location
//           phoneNumber: "0000000000", // Placeholder phone number
//           password: "Password123?",
//           verifyPassword: "Password123?",
//           birthDate: new Date("2000-01-01"), // Placeholder birthdate
//           bloodGroup: "A+",
//           gender: "Male",
//           rememberMe: false
//         };

//         const newUser = new User(newUserDetails);
//         await newUser.save();
//         console.log("New user created.");
//       }

//       // Redirect to profile on successful authentication
//       res.redirect("/profile");
//     } catch (error) {
//       console.error("Error during user authentication:", error);
//       next(error); // Pass the error to the global error handler
//     }
//   }
// );

//auth with facebook
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "http://localhost:8082/auth/facebook/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       return done(null, profile);
//     }
//   )
// );

// router.get('/auth/facebook',
//   passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     console.log(req.session)
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Create a new user in the system
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               fullNames:
 *                 type: string
 *                 example: "John Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Bad request, validation errors
 *       500:
 *         description: Internal server error
 */

router.post("/auth/signup", checkSchema(createUserSchema), async (req, res) => {
  // Validate the incoming request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract validated data
  const data = matchedData(req);

  try {
    // Hash the password securely
    data.password = hashPassword(data.password);

    data.verified = false;
    // Remove confirmPassword before saving
    delete data.confirmPassword;

    // Create and save the user
    const newUser = new User(data);
    await newUser.save().then((result) => {
      req.session.userID = result._id;
      sendOTPVerificationEmail(result);
    });

    res.status(201).send({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const saltRounds = 10;
    const hashedOTP = bcrypt.hashSync(otp, saltRounds);

    const otpRecord = new UserOtp({
      userId: _id,
      otp: hashedOTP,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 600000), // 10 minutes
    });

    await otpRecord.save();

    sendMail(email, "Verification Code", `Your verification code is: ${otp}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP for user
 *     description: Verifies the OTP sent to the user's email or phone number
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               userID:
 *                 type: string
 *                 example: "60f9b2c3c6d3f0d72b2cd7f1"
 *     responses:
 *       200:
 *         description: OTP verified successfully, user is now verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *       400:
 *         description: Invalid OTP or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/verify-otp", async (req, res) => {
  console.log(req.session);
  try {
    const userId = req.session.userID;
    const { otp } = req.body;

    if (!userId || !otp) {
      throw new Error("Invalid request");
    }

    // Retrieve the OTP record
    const userOtpRecord = await UserOtp.findOne({ userId });

    if (!userOtpRecord) {
      throw new Error("OTP not found");
    }

    // Extract the expiration time and hashed OTP
    const { expiresAt, otp: hashedOTP } = userOtpRecord;

    // Check if the OTP has expired
    if (Date.now() > expiresAt) {
      await UserOtp.deleteOne({ userId }); // Remove the expired OTP
      throw new Error("OTP expired");
    }

    // Verify the OTP
    const isValidOTP = bcrypt.compareSync(otp, hashedOTP);

    if (!isValidOTP) {
      throw new Error("Invalid OTP");
    }

    // If OTP is valid, remove it and update the user's verification status
    await UserOtp.deleteOne({ userId });
    await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(400).send(error.message);
  }
});

router.get("/auth/login", passport.authenticate("local"), async (req, res) => {
  res.status(200).send("user logged in");
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    username,
    password,
    done
  ) {
    try {
      const findUser = await User.findOne({
        $or: [{ email: username }, { username: username }],
      });

      if (!findUser || !comparePassword(password, findUser.password)) {
        return new Error("Invalid Email or Password");
      }

      return done(null, findUser);
    } catch (error) {
      console.log(error);
    }
  })
);
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the user profile
 *     description: Retrieve the authenticated user's profile details
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 displayName:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *       401:
 *         description: Unauthorized - user not authenticated
 */
router.get("/profile", (req, res) => {
  // console.log(req.session);
  res.send(`welcome ${req.session._id}`);
});

export default router;
