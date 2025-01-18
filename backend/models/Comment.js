const mongoose = require("mongoose");

const autoPopulateReplies = function (next) {
  this.populate({
    path: "replies",
    populate: { path: "author", select: "fullName avatar" },
  });
  this.populate({ path: "author", select: "fullName avatar" });
  next();
};

const commentSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, trim: true, required: true },
    star: { type: String, default: 0, min: 1, max: 5 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

commentSchema
  .pre("findOne", autoPopulateReplies)
  .pre("find", autoPopulateReplies);

module.exports = mongoose.model("Comment", commentSchema);
