const Comment = require("../models/Comment");
const Order = require("../models/Orders");

class CommentService {
  async getAllComments(req) {
    const comments = await Comment.find({
      productId: req.params.productId,
      _id: { $nin: await Comment.distinct("replies") },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return comments;
  }

  async createComment(req) {
    const { productId, userId, content, star } = req.body;
    try {
      const order = await Order.findOne({
        userId,
        "items.productId": productId,
        orderStatus: { $in: ["On the way", "Delivered"] },
      });

      if (!order) {
        throw new Error("Bạn chỉ được bình luận khi đã mua sản phẩm.");
      }

      // Kiểm tra nếu user đã bình luận cho sản phẩm này
      const existingComment = await Comment.findOne({
        productId: productId,
        author: userId,
      });

      if (existingComment) {
        throw new Error("Bạn chỉ có thể bình luận một lần cho sản phẩm này.");
      }

      const newComment = new Comment({
        productId: productId,
        author: userId,
        content,
        star,
      });

      return await newComment.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(`Bạn đã bình luận cho sản phẩm này trước đó.`);
      }
      throw error;
    }
  }

  async updateComment(req) {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("author");
    return updatedComment;
  }

  async deleteComment(req) {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }
    await Comment.updateMany({ replies: id }, { $pull: { replies: id } });
    return Comment.findByIdAndDelete(id);
  }

  async createReply(req) {
    const { commentId, userId, content } = req.body;
    try {
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        throw new Error("Không tìm thấy bình luận cha.");
      }

      // Tạo và lưu trực tiếp reply
      const savedReply = await Comment.create({
        productId: parentComment.productId,
        author: userId,
        content,
      });

      // Đẩy id của reply vào replies của parentComment
      parentComment.replies.push(savedReply._id);
      await parentComment.save();

      // Populate author thông tin sau khi lưu
      await savedReply.populate("author", "fullName avatar");

      return savedReply;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CommentService();
