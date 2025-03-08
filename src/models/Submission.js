import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  submissionId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "WRONG_ANSWER"],
    default: "PENDING",
  },
  error: {
    type: String,
  },
  runtime: {
    type: Number,
  },
  memory: {
    type: Number,
  },
}, { timestamps: true });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
