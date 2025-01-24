const User = require("../models/User");

const SELECTED_FIELDS = "_id fullName email phone avatar status createdAt";

class UserService {
  async getUsers(query) {
    const { page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find({ role: "customer" })
        .select(SELECTED_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getUser(userId) {
    try {
      const user = await User.findById(userId).select("-password");

      if (!user) throw new Error("User Not Found");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(data) {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("Email already exists");
      }

      const userData = {
        ...data,
        password: data.phone,
      };

      const user = new User(userData);
      await user.save();

      const userWithoutPassword = await User.findById(user._id)
        .select("-password")
        .lean();

      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updatedData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updatedData },
        { new: true }
      );

      if (!user) throw new Error("User Not Found");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) throw new Error("User Not Found");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId, updatedData) {
    const { oldPassword, newPassword, confirmPassword } = updatedData;
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User Not Found");

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) throw new Error("Old password is incorrect");
      if (newPassword !== confirmPassword)
        throw new Error("New password and confirm passwod do not match");

      user.password = newPassword;
      await user.save();
    } catch (error) {
      throw error;
    }
  }

  async addAddress(userId, data) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User Not Found");

      user.shippingAddress.push(data);
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteAddress(userId, addressId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User Not Found");

      user.shippingAddress = user.shippingAddress.filter(
        (addr) => addr._id.toString() !== addressId
      );

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
