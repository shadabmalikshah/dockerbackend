const asyncHandler = require("express-async-handler");
const Notify = require("../models/notificationModel");

const createNotify = asyncHandler(async (req, res) => {
  try {
    const { id, recipients, images, url, content } = req.body;

    const filteredRecipients = recipients.filter(
      (recipientId) => recipientId !== req.user._id.toString()
    );

    const notify = new Notify({
      id,
      recipients: filteredRecipients,
      images,
      url,
      content,
      user: req.user._id,
    });

    await (
      await notify.populate("user", "avatar username following followers")
    ).save();
    res.json(notify);
  } catch (err) {
    throw new Error(err);
  }
});

const getNotify = asyncHandler(async (req, res) => {
  try {
    const notifies = await Notify.find({
      recipients: { $in: [req.user._id] },
    })
      .sort("-createdAt")
      .populate("user", "avatar username following followers");

    res.json(notifies);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteNotify = asyncHandler(async (req, res) => {
  try {
    const notifies = await Notify.findOneAndDelete({
      id: req.params.id,
    })
      .sort("-createdAt")
      .populate("user", "avatar username following followers");

    res.json(notifies);
  } catch (err) {
    throw new Error(err);
  }
});

const isReadNotify = asyncHandler(async (req, res) => {
  try {
    const notifies = await Notify.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { isRead: true },
      { new: true }
    ).populate("user", "avatar username following followers");

    res.json(notifies);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createNotify, getNotify, deleteNotify, isReadNotify };
