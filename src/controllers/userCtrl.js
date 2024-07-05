const { Request, Response } = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const searchUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: req.query.username },
    })
      .limit(10)
      .select("fullname username avatar");

    res.json({ users });
  } catch (err) {
    throw new Error(err);
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const data = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate(
        "followers following",
        "avatar username fullname followers following"
      );

    if (!data) res.status(400).json({ msg: "User does not exist." });

    res.json(data);
  } catch (err) {
    throw new Error(err);
  }
});

const getSuggestionUser = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const following = currentUser.following;

    // Retrieve 5 users who are not already being followed by the current user
    const users = await User.find({
      _id: { $nin: following, $ne: currentUser._id },
    })
      .select("-password -createdAt -updatedAt")
      .populate("followers following", "username,avatar")
      .limit(5);

    res.json(users);
  } catch (err) {
    throw new Error(err);
  }
});

const followUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find({
      _id: req.params.id,
      followers: req.user._id,
    });
    if (user.length > 0)
      res.status(500).json({ msg: "You followed this user." });

    await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );

    const newUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { following: req.params.id },
      },
      { new: true }
    )
      .select("-password")
      .populate(
        "followers following",
        "avatar username fullname followers following"
      );
    res.json(newUser);
  } catch (err) {
    throw new Error(err);
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    const newUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { following: req.params.id },
      },
      { new: true }
    )
      .select("-password")
      .populate(
        "followers following",
        "avatar username fullname followers following"
      );

    res.json(newUser);
  } catch (err) {
    throw new Error(err);
  }
});

const savePost = asyncHandler(async (req, res) => {
  try {
    const user = await User.find({
      _id: req.user._id,
      saved: req.params.id,
    });
    if (user.length > 0)
      res.status(400).json({ msg: "You saved this post." });

    const save = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { saved: req.params.id },
      },
      { new: true }
    );

    if (!save) res.status(400).json({ msg: "This post does not exist." });

    res.json(save);
  } catch (err) {
    throw new Error(err);
  }
});

const unSavePost = asyncHandler(async (req, res) => {
  try {
    const unSave = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { saved: req.params.id },
      },
      { new: true }
    );

    if (!unSave) res.status(400).json({ msg: "This post does not exist." });

    res.json(unSave);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  searchUser,
  getUser,
  followUser,
  unfollowUser,
  getSuggestionUser,
  savePost,
  unSavePost,
};
