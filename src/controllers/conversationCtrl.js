const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");
const Messages = require("../models/messagesModel");

const createConversation = asyncHandler(async (req, res) => {
  try {
    const existingConversation = await Conversation.findOne({
      $or: [
        { recipients: [req.user._id, req.params.id] },
        { recipients: [req.params.id, req.user._id] },
      ],
    }).populate("recipients", "avatar username fullname");

    if (existingConversation) {
      res.json(existingConversation);
    } else {
      const newConversation = new Conversation({
        recipients: [req.user._id, req.params.id],
      });
      await newConversation.save();

      const populatedConversation = await Conversation.findById(
        newConversation._id
      ).populate("recipients", "avatar username fullname");

      res.json(populatedConversation);
    }
  } catch (err) {
    throw new Error(err);
  }
});

const deleteConversation = asyncHandler(async (req, res) => {
  try {
    const newConver = await Conversation.findOneAndDelete({
      _id: req.params.id,
    });
    await Messages.deleteMany({ conversation: newConver._id });

    res.json(newConver);
  } catch (err) {
    throw new Error(err);
  }
});

const getConversation = asyncHandler(async (req, res) => {
  try {
    const conversations = await Conversation.find({
      recipients: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .populate("recipients", "avatar username fullname");

    res.json(conversations);
  } catch (err) {
    throw new Error(err);
  }
});

const getAConversation = asyncHandler(async (req, res) => {
  try {
    const conversations = await Conversation.find({
      _id: req.params.id,
    }).populate("recipients", "avatar username fullname");

    res.json(conversations);
  } catch (err) {
    throw new Error(err);
  }
});

const isReadConversation = asyncHandler(async (req, res) => {
  try {
    const msg = await Conversation.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { isRead: true },
      { new: true }
    ).populate("recipients", "avatar username fullname");

    res.json(msg);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createConversation,
  deleteConversation,
  getConversation,
  getAConversation,
  isReadConversation,
};
