const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middlewares/Auth");

router.get("/:productId", commentController.getAllComments);
router.post("/", verifyToken, commentController.createComment);
router.put("/:id", verifyToken, commentController.updateComment);
router.delete("/:id", verifyToken, commentController.deleteComment);
router.post("/reply", verifyToken, commentController.createReply);

module.exports = router;
