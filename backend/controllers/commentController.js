const commentService = require("../services/commentService");

class CommentController {
  async getAllComments(req, res) {
    try {
      const {
        fields,
        star,
        commentType,
        page = 1,
        limit = 10,
        productId,
        userId,
      } = req.query;

      const comments = await commentService.getAllComments({
        userId: userId || undefined,
        productId: productId || undefined,
        fields,
        filters: {
          star: star || undefined,
          commentType: commentType || "all",
        },
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
      });

      res.status(200).json({
        success: true,
        data: comments.data,
        pagination: comments.pagination,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }

  async createComment(req, res) {
    try {
      const userId = req.user.userId;
      const commentData = req.body;
      await commentService.createComment(userId, commentData);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }

  async createReply(req, res) {
    try {
      const userId = req.user.userId;
      const commentId = req.params.id;
      const commentData = req.body;
      await commentService.createReply(userId, commentId, commentData);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }

  async updateComment(req, res) {
    try {
      const commentId = req.params.id;
      const commentData = req.body;
      const result = await commentService.updateComment(commentId, commentData);
      res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }

  async likeComment(req, res) {
    try {
      const commentId = req.params.id;
      const userId = req.user.userId;
      await commentService.likeComment(commentId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }

  async reportComment(req, res) {
    try {
      const userId = req.user.userId;
      const commentId = req.params.id;
      const reportData = req.body;

      await commentService.reportComment(commentId, userId, reportData);
      res.status(200).json({ success: true, message: "Reported successfully" });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      const commentId = req.params.id;
      await commentService.deleteComment(commentId);
      res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }

  async dismissReport(req, res) {
    try {
      const commentId = req.params.id;
      await commentService.dismissReport(commentId);
      res.json({ success: true, message: "Report dismissed successfully" });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new CommentController();
