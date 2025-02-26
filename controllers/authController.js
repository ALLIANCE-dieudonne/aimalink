import { matchedData, validationResult } from "express-validator";
import { comparePassword, hashPassword } from "../utils/helpers.js";
import User from "../db/schemas/userSchema.js";
import { generateToken } from "../utils/jwt.js";
import { sendMail } from "../utils/email.js";
import passport from "passport";
import bcrypt from "bcrypt";
import UserOtp from "../db/schemas/userOTP.js";
import "../strategies/localStrategy.js";

export const signUp = async (req, res) => {
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

    const token = generateToken(newUser);

    res.status(201).send({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const sendOTPVerificationEmail = async ({ _id, email }, res) => {
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
    console.log(error);
  }
};

export const verifyOTP = async (req, res) => {
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
};

export const resendOTP = async (req, res) => {
  try {
    const userId = req.session.userID;

    const userOtpRecord = await UserOtp.findOne({ userId });

    if (!userOtpRecord) {
      console.log("No existing OTP found, creating a new one.");
    } else if (Date.now() < userOtpRecord.expiresAt) {
      return res
        .status(400)
        .json({
          message: "OTP already sent. Please wait before requesting a new one.",
        });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendOTPVerificationEmail(user);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Invalid Email or Password" });

    req.logIn(user, (err) => {
      if (err) return next(err);

      const token = generateToken(user);
      return res.status(200).json({ message: "User logged in", token });
    });
  })(req, res, next);
};
