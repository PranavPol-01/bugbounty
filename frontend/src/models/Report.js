import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  onChainReportId:     { type: Number, required: true, unique: true },
  vaultId:             { type: Number, required: true },
  researcher:          { type: String, required: true, lowercase: true },
  severity:            { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
  title:               { type: String, required: true },
  description:         { type: String, required: true },
  ipfsHash:            { type: String, required: true },
  cloudinaryThumbnail: { type: String, default: "" },
  status:              { type: String, enum: ["Pending", "Approved", "Rejected", "Paid"], default: "Pending" },
  payout:              { type: String, default: "0" },
  governanceNote:      { type: String, default: "" },
  nftMinted:           { type: Boolean, default: false },
  nftTokenId:          { type: Number, default: null },
  submittedAt:         { type: Date, default: Date.now },
  resolvedAt:          { type: Date, default: null },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
