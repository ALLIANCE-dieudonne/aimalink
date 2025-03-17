import User from "../db/schemas/userSchema.js";
export const getAllUsers = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
};

export const getUser = async (req, res) => {
    const userId = req.user._id;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error fetching user");
    }
};

export const updateUser = async (req, res) => {

    const userId = req.user._id;
    const updatedUser = req.body;

    try {
      const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error updating user");
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.user._id;

    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Error deleting user");
    }
};
