import { Strategy as LocalStrategy } from "passport-local";
import User from "../db/schemas/userSchema.js";
import { comparePassword } from "../utils/helpers.js";
import passport from "passport";

export default passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user || !comparePassword(password, user.password)) {
          return done(null, false, { message: "Invalid Email or Password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
