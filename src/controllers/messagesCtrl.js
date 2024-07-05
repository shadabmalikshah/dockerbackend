const asyncHandler = require("express-async-handler");
const Messages = require("../models/messagesModel");
const Conversation = require("../models/conversationModel");

const createMessages = asyncHandler(async (req, res) => {
  try {
    const { sender, recipient, text, media, call } = req.body;
    if (!recipient || (text === "" && media === "" && !call)) return;
    const newConversation = await Conversation.findOneAndUpdate(
      {
        $or: [
          { recipients: [sender, recipient] },
          { recipients: [recipient, sender] },
        ],
      },
      {
        recipients: [sender, recipient],
        isRead: false,
        lastMessages: text,
      },
      { new: true }
    );
    const newMessage = new Messages({
      conversation: newConversation._id,
      sender,
      call,
      recipient,
      text,
      media,
    });

    await (
      await newMessage.save()
    ).populate("recipient sender", "avatar username fullname");

    res.json(newMessage);
  } catch (err) {
    throw new Error(err);
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Messages.find({
      conversation: req.params.id,
    })
      .sort("-createdAt")
      .populate("recipient sender", "avatar username fullname");
    res.json(messages);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteMessages = asyncHandler(async (req, res) => {
  try {
    const deleteMessages = await Messages.findOneAndDelete({
      _id: req.params.id,
      sender: req.user._id,
    });
    res.json(deleteMessages);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createMessages, getMessages, deleteMessages };
