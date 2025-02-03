const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const submitTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending",'submitted'],
      default: "pending",
    },
    price: {
      type: Number,
      required: false,
    },
    image:{
      type: Object,
      required: false,
      default: [
        {
          url: `null`,
          path: "null",
        },
      ],
    },
  },
  { timestamps: true }
);

submitTaskSchema.plugin(paginate);

module.exports = mongoose.model("SubmitTask", submitTaskSchema);
