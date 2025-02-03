const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const referralSchema = new mongoose.Schema(
  {
    referralCode: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

referralSchema.plugin(paginate);

module.exports = mongoose.model("Referral", referralSchema);
