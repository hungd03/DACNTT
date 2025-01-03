require("dotenv").config();
const User = require("../models/User");

// Register User
const registerUser = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (userExisted)
      return res
        .status(400)
        .json({ status: false, msg: "User Already Existed" });

    const newUser = new User({ fullName, email, phone, password });
    await newUser.save();
    res.json({ status: true, msg: "User Registered Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: false, msg: "Invalid Email or Password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, msg: "Invalid Email or Password" });

    // Return token
    const accessToken = jwt.sign(
      { userId: user._id, role: user?.role },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      msg: "Log in successfully",
      accessToken,
      role: user.role,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
