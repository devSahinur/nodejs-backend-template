const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    message: { type: String, required: false },
    image: { type: Object, required: false },
    linkId: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "client", "employee", "unknown"],
      default: "unknown",
    },
    type: {
      type: String,
      enum: ["task", "payment", "unknown"],
      default: "unknown",
    },
    viewStatus: { type: Boolean, enum: [true, false], default: false },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

module.exports = mongoose.model("Notification", notificationSchema);
