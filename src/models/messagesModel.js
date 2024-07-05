const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Types.ObjectId, ref: "user" },
    conversation: { type: mongoose.Types.ObjectId, ref: "conversation" },
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    text: String,
    media: String,
    call: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messagesSchema);

