const Comment = require("../models/Comment");
const Order = require("../models/Orders");
const ApiErrorUtils = require("../utils/ApiErrorUtils");

const SELECTED_FIELDS =
  "_id productId author content star likes isEdited createdAt updatedAt";

const populateOpts = [
  {
    path: "author",
    select: "fullName avatar.url",
    model: "User",
  },
];

const formatReportResult = (result) => {
  const { data, pagination } = result;
  const reportedComments = [];

  // Process each parent comment
  data.forEach((comment) => {
    // If parent comment has report, add it to the array
    if (comment.report && comment.report.length > 0) {
      const parentComment = {
        _id: comment._id,
        productId: comment.productId,
        author: comment.author,
        content: comment.content,
        star: comment.star,
        likes: comment.likes,
        report: comment.report,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
      reportedComments.push(parentComment);
    }

    // Check replies for reports
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach((reply) => {
        if (reply.report && reply.report.length > 0) {
          const reportedReply = {
            _id: reply._id,
            productId: reply.productId,
            author: reply.author,
            content: reply.content,
            likes: reply.likes,
            report: reply.report,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
          };
          reportedComments.push(reportedReply);
        }
      });
    }
  });

  // Update pagination with new total
  const updatedPagination = {
    ...pagination,
    total: reportedComments.length,
    pages: Math.ceil(reportedComments.length / pagination.limit),
  };

  return {
    success: true,
    data: reportedComments,
    pagination: updatedPagination,
  };
};

const buildCommentTypeQuery = async (commentType) => {
  const baseQuery = {
    _id: { $nin: await Comment.distinct("replies") },
  };

  if (!commentType || commentType === "all") {
    return baseQuery;
  }

  switch (commentType) {
    case "replied": {
      return {
        ...baseQuery,
        replies: { $exists: true, $ne: [] },
      };
    }

    case "unreplied": {
      return {
        ...baseQuery,
        star: { $exists: true },
        $or: [{ replies: { $exists: false } }, { replies: { $size: 0 } }],
      };
    }

    case "report": {
      return {
        ...baseQuery,
        "report.0": { $exists: true },
      };
    }

    default:
      return baseQuery;
  }
};

class CommentService {
  async getAllComments(options = {}) {
    const {
      fields = SELECTED_FIELDS,
      productId,
      userId,
      filters = {},
      pagination = { page: 1, limit: 10 },
    } = options;

    const query = await buildCommentTypeQuery(filters.commentType);

    // Add additional filters
    if (productId) {
      query.productId = productId;
    }
    if (userId && filters.commentType !== "replied") {
      query.author = userId;
    }
    if (filters.star) {
      query.star = Number(filters.star);
    }

    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const totalDocs = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .select(fields)
      .populate(populateOpts)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const result = {
      data: comments,
      pagination: {
        total: totalDocs,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(totalDocs / limit),
      },
    };

    // Format lại kết quả nếu là report type
    if (filters.commentType === "report") {
      return formatReportResult(result);
    }

    return result;
  }

  async createComment(userId, commentData) {
    const { productId, content, star } = commentData;

    const order = await Order.findOne({
      userId,
      "items.productId": productId,
      orderStatus: { $in: ["Delivered"] },
    });

    if (!order) {
      throw ApiErrorUtils.simple("You haven't purchased this product", 400);
    }

    // Kiểm tra nếu user đã bình luận cho sản phẩm này
    const existingComment = await Comment.findOne({
      productId: productId,
      author: userId,
    });

    if (existingComment) {
      throw ApiErrorUtils.simple("You have reviewed this product", 400);
    }

    const newComment = new Comment({
      productId: productId,
      author: userId,
      content,
      star,
    });

    await newComment.populate(populateOpts);
    return await newComment.save();
  }

  async createReply(userId, commentId, commentData) {
    const { content } = commentData;
    try {
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        throw ApiErrorUtils.simple("Parent comment not found", 404);
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

      await savedReply.populate(populateOpts);
      return savedReply;
    } catch (error) {
      throw error;
    }
  }

  async updateComment(commentId, commentData) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw ApiErrorUtils.simple("Comment not found", 404);
    if (comment.isEdited) {
      throw ApiErrorUtils.simple("You can only edit your comment once.", 400);
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        ...commentData,
        isEdited: true,
      },
      { new: true }
    ).populate(populateOpts);
    return updatedComment;
  }

  async likeComment(commentId, userId) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw ApiErrorUtils.simple("Comment not found", 404);

    if (!comment.likes) comment.likes = [];
    const userLikeIndex = comment.likes.indexOf(userId);

    if (userLikeIndex > -1) {
      comment.likes.pull(userId); // Unlike
    } else {
      comment.likes.push(userId); // Like
    }
    comment.populate(populateOpts);
    await comment.save();
    return comment;
  }

  async reportComment(commentId, userId, reportData) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw ApiErrorUtils.simple("Comment not found", 404);

    const hasReported = comment.report?.some(
      (report) => report.reportedBy._id.toString() === userId.toString()
    );

    if (hasReported) {
      throw ApiErrorUtils.simple("You have already reported this comment", 400);
    }

    const newReport = {
      reason: reportData.reason,
      description: reportData.description,
      reportedBy: userId,
    };

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: { report: newReport },
      },
      { new: true }
    );

    return updatedComment;
  }

  async deleteComment(commentId) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw ApiErrorUtils.simple("Comment not found", 404);
    }
    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }
    await Comment.updateMany(
      { replies: commentId },
      { $pull: { replies: commentId } }
    );
    return Comment.findByIdAndDelete(commentId);
  }

  async dismissReport(commentId) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw ApiErrorUtils.simple("Comment not found", 404);
    }

    comment.report = [];
    await comment.save();

    return comment;
  }
}

module.exports = new CommentService();
