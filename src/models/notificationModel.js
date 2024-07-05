const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    recipients: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    images: String,
    url: String,
    content: String,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notification", notificationSchema);
