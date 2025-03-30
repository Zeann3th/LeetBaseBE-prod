import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  nodeType: {
    type: String,
    enum: ["comment", "discussion"],
    required: true
  },
  nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  vote: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true
  },
}, { timestamps: true });

voteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
