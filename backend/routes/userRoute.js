const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserById,
  changePassword,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/info", getUserById);
router.put("/info", updateUserById);
router.put("/change-password", changePassword);
router.delete("/:id", deleteUser);

module.exports = router;
