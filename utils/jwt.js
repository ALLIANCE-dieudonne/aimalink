import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

//generete jwt
export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1w",
  });
};

// export const verifyToken = (token) => {
//   try {
//     jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     throw new Error("Invalid or expired token!");
//   }
// };

//verifying blacklist

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || BLACKLIST.has(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token,JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
