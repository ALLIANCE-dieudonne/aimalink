import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../db/schemas/userSchema.js";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export default passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // This extracts JWT from the Authorization header
      secretOrKey: JWT_SECRET, // The secret used to verify JWTs
    },
    async (jwtPayload, done) => {
      try {
        // Find the user by ID from the JWT payload
        const user = await User.findById(jwtPayload.id);

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        //isAdmin
        const userWithAdminFlag = {
          ...user.toObject(), // Convert Mongoose document to plain object
          isAdmin: user.email === "silverseeker769@gmail.com", // Set admin flag
        };
        // User found, authentication successful
        return done(null, userWithAdminFlag);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
