const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasksId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["paypal", "stripe", "unknown"],
      default: "unknown",
    },
    paymentData: {
      type: Object,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

paymentSchema.plugin(paginate);

module.exports = mongoose.model("Payment", paymentSchema);
