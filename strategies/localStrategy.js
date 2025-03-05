import { Strategy as LocalStrategy } from "passport-local";
import User from "../db/schemas/userSchema.js";
import { comparePassword } from "../utils/helpers.js";
import passport from "passport";


export default passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // You can still use "email" as the default field for username
    },
    async (emailOrUsername, password, done) => {
      try {
        // Check if the input is an email or a username
        const query = emailOrUsername.includes('@')
          ? { email: emailOrUsername } // If it contains "@" it's treated as email
          : { username: emailOrUsername }; // Otherwise, it's treated as username

        // Find the user by either email or username
        const user = await User.findOne(query);

        if (!user || !comparePassword(password, user.password)) {
          return done(null, false, { message: "Invalid Email/Username or Password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
