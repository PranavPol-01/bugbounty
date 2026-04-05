import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  address:         { type: String, required: true, unique: true, lowercase: true },
  username:        { type: String, default: "" },
  bio:             { type: String, default: "" },
  avatarUrl:       { type: String, default: "" },
  twitterHandle:   { type: String, default: "" },
  totalEarned:     { type: String, default: "0" },
  approvedReports: { type: Number, default: 0 },
  nftCount:        { type: Number, default: 0 },
  role:            { type: String, enum: ["researcher", "programTeam", "governance", "admin"], default: "researcher" },
  createdAt:       { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
