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
import { sendMail } from "../utils/email.js";
import { verifyOTP, login, signUp, resendOTP } from "../controllers/authController.js";
import "../middleware/authMiddleware.js"


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; 

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



router.post(
  "/auth/signup",
  checkSchema(createUserSchema),
  signUp
);



router.post(
  "/verify-otp",
  verifyOTP
);

router.get(
  "/auth/login",
  login
);

router.post("/auth/resend-otp",resendOTP);


router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }), // Protect route
  (req, res) => {
    res.json({ message: "Access granted!", user: req.user });
  }
);






export default router;
