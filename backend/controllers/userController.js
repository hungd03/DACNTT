const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ status: true, users: users });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

// Get user by id
exports.getUserById = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(200).json({
      status: true,
      user: null,
      msg: "User not logged in",
    });
  }

  const id = req.user?.userId;
  try {
    const user = await User.findById(id).select("-password");
    if (!user)
      return res.status(400).json({ status: false, msg: "User Not Found!" });
    res.status(200).json({ status: true, user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

// Change password: Replace old password with the new one
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, msg: "User Not Found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, msg: "Old password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        msg: "New password and comfirm password do not match",
      });
    }

    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ status: true, msg: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err,
    });
  }
};

// Delete a user : Admin only
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ status: false, msg: "User Not Found" });
    }
    res.status(200).json({ status: true, msg: "User Deleted Successfully!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};
