const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const createPost = asyncHandler(async (req, res) => {
  try {
    const { content, images } = req.body;

    if (images.length === 0)
      res.status(400).json({ msg: "Please add your photo." });
    const newPost = new Post({
      content,
      images,
      user: req.user._id,
    });
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { post: newPost._id },
      },
      { new: true }
    );
    await (
      await newPost.populate("user", "avatar username fullname followers")
    ).save();

    res.json(newPost);
  } catch (err) {
    throw new Error(err);
  }
});

const getPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({
      user: [...req.user.following, req.user._id],
    })
      .populate("user", "avatar username fullname followers")
      .sort("-createdAt");

    res.json(posts);
  } catch (err) {
    throw new Error(err);
  }
});

const getUserPosts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({
      user: user._id,
    })
      .populate("user", "avatar username fullname followers")
      .sort("-createdAt");

    res.json(posts);
  } catch (err) {
    throw new Error(err);
  }
});

const getExplorePosts = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const following = currentUser.following;

    // Retrieve 5 users who are not already being followed by the current user
    const users = await User.find({
      _id: { $nin: following, $ne: currentUser._id },
    });

    const post = await Post.find({ user: { $in: users } }).populate(
      "user",
      "username avatar fullname followers"
    );
    res.json(post);
  } catch (err) {
    throw new Error(err);
  }
});

const getAPost = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.findOne({
      _id: req.params.id,
    }).populate("user", "avatar username fullname followers");

    res.json(posts);
  } catch (err) {
    throw new Error(err);
  }
});

const likePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.find({
      _id: req.params.id,
    });
    const like = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );
    if (!like) res.status(400).json({ msg: "This post does not exist." });
    res.json(like);
  } catch (err) {
    throw new Error(err);
  }
});

const unLikePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.find({
      _id: req.params.id,
      likes: req.user._id,
    });
    const unlike = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    if (!unlike) res.status(400).json({ msg: "This post does not exist." });
    res.json(unlike);
  } catch (err) {
    throw new Error(err);
  }
});

const updatePost = asyncHandler(async (req, res) => {
  try {
    const { id, content } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        content,
      },
      { new: true }
    ).populate("user", "avatar username fullname followers");

    res.json(post);
  } catch (err) {
    throw new Error(err);
  }
});

const deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { post: post._id },
      },
      { new: true }
    );
    await Comment.deleteMany({ _id: { $in: post.comments } });
    res.json(post);
  } catch (err) {
    throw new Error(err);
  }
});

const getSavedPost = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    const post = await Post.find({
      _id: { $in: user.saved },
    })
      .populate("user", "avatar username followers")
      .sort("-createdAt");

    res.json(post);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  likePost,
  unLikePost,
  getAPost,
  updatePost,
  deletePost,
  getExplorePosts,
  getSavedPost,
};
