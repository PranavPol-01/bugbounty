import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipientAddress: { type: String, required: true, lowercase: true },
  type: {
    type: String,
    enum: ["REPORT_SUBMITTED", "REPORT_APPROVED", "REPORT_REJECTED", "PAYOUT_EXECUTED", "NFT_MINTED"],
    required: true,
  },
  message:   { type: String, required: true },
  reportId:  { type: Number, default: null },
  vaultId:   { type: Number, default: null },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
