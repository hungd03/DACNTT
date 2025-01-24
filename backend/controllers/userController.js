const UserService = require("../services/userService");

class UserController {
  async getUsers(req, res) {
    try {
      const users = await UserService.getUsers(req.query);
      res.json({ status: true, users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUser(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(200).json({
          status: true,
          user: null,
          msg: "User not logged in",
        });
      }

      const userId = req.user?.userId;
      const user = await UserService.getUser(userId);
      res.json({ status: true, user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ status: true, user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await UserService.updateUser(userId, req.body);
      res.json({ status: true, user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      await UserService.deleteUser(userId);
      res.json({ status: true, message: "User deleted statusfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async changePassword(req, res) {
    const userId = req.user.userId;
    try {
      await UserService.changePassword(userId, req.body);
      res.json({ status: true, message: "Password changed statusfully" });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  async addAddress(req, res) {
    const userId = req.user.userId;
    const { address } = req.body;
    try {
      const user = await UserService.addAddress(userId, address);
      res.json({ status: true, message: "Address Added Successfully", user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteAddress(req, res) {
    const userId = req.user.userId;
    const { addressId } = req.params;
    try {
      const user = await UserService.deleteAddress(userId, addressId);
      res.json({ status: true, message: "Address Added Successfully", user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
