import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: String,
    enum: ["free", "pro", "business"]
  },

  amount: Number,

  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"]
  },

  startDate: Date,
  endDate: Date

}, { timestamps: true });

export default mongoose.model("Billing", billingSchema);
