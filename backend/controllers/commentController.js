const commentService = require("../services/commentService");

class CommentController {
  async getAllComments(req, res) {
    try {
      const comments = await commentService.getAllComments(req);
      if (!comments)
        return res.status(500).json({ message: "No Comment Found" });
      res.status(200).json({ sucess: true, data: comments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createComment(req, res) {
    try {
      const comment = await commentService.createComment(req);
      res.status(200).json({ success: true, data: comment });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateComment(req, res) {
    try {
      const comment = await commentService.updateComment(req);
      res.status(200).json({
        success: true,
        message: "Comment updated sucessfully",
        data: comment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      await commentService.deleteComment(req);
      res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async createReply(req, res) {
    try {
      const reply = await commentService.createReply(req);
      res.status(200).json({ success: true, data: reply });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CommentController();
