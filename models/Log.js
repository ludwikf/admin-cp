import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: String,
    username: String,
  },
  actiontype: String,
  details: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.models.Log || mongoose.model("Log", logSchema);
