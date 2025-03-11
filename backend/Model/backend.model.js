import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["business", "admin"], default: "business" },
    phone: { type: String, unique: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

const referralSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralCode: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    rewardStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rewardAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const Referral = mongoose.model("Referral", referralSchema);

const campaignSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    reward: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
