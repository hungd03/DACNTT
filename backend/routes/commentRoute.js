const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middlewares/Auth");

router.get("/", commentController.getAllComments);
router.post("/", verifyToken, commentController.createComment);
router.post("/:id/replies", verifyToken, commentController.createReply);
router.post("/:id/report", verifyToken, commentController.reportComment);
router.patch("/:id", verifyToken, commentController.updateComment);
router.patch("/:id/like", verifyToken, commentController.likeComment);
router.delete("/:id", verifyToken, commentController.deleteComment);
router.delete("/:id/dismiss", verifyToken, commentController.dismissReport);

module.exports = router;
