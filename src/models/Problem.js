import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
    required: true,
  },
  tags: {
    type: [String],
    required: false,
  },
  testCases: {
    type: String,
    required: true,
  }
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
