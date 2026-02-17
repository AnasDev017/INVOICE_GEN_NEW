import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true
  },

  amount: { type: Number, required: true },

  method: {
    type: String,
    enum: ["cash", "bank", "card", "paypal", "crypto"]
  },

  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "success"
  }

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
