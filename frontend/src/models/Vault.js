import mongoose from "mongoose";

const VaultSchema = new mongoose.Schema({
  onChainVaultId:      { type: Number, required: true, unique: true },
  programTeam:         { type: String, required: true, lowercase: true },
  governanceAuthority: { type: String, required: true, lowercase: true },
  rewardToken:         { type: String, default: "0x0000000000000000000000000000000000000000" },
  name:                { type: String, required: true },
  description:         { type: String, default: "" },
  logoUrl:             { type: String, default: "" },
  websiteUrl:          { type: String, default: "" },
  rewards: {
    critical: { type: String, default: "0" },
    high:     { type: String, default: "0" },
    medium:   { type: String, default: "0" },
    low:      { type: String, default: "0" },
  },
  totalFunded: { type: String, default: "0" },
  active:      { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Vault || mongoose.model("Vault", VaultSchema);
