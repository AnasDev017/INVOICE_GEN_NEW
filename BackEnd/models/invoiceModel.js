import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },

    clientName: {
      type: String,
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
    },

    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
