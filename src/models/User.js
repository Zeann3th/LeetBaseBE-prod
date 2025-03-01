import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
});
