const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const interestSchema = new mongoose.Schema(
  {
    id: Number,
    icon: String,
    title: String
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// notificationSchema.plugin(toJSON);
interestSchema.plugin(paginate);

module.exports = mongoose.model("Interest", interestSchema);
