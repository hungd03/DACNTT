const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const {
  processUserAvatar,
  handleMulterError,
  deleteImages,
} = require("../controllers/uploadController");
const { upload } = require("../configs/uploadConfig");

router.get("/", UserController.getUsers);
router.get("/info", UserController.getUser);
router.post("/", UserController.createUser);
router.patch(
  "/info/:id",
  upload.single("avatar"),
  handleMulterError,
  processUserAvatar,
  UserController.updateUser
);
router.delete("/:id", deleteImages, UserController.deleteUser);

router.patch("/change-password", UserController.changePassword);
router.post("/address", UserController.addAddress);
router.delete("/address/:addressId", UserController.deleteAddress);

module.exports = router;
