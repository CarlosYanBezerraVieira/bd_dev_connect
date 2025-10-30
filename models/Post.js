const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    authorImageBytes: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
