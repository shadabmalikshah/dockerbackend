const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleWare");
const {
  createPost,
  deletePost,
  getAPost,
  getExplorePosts,
  getPosts,
  getSavedPost,
  getUserPosts,
  likePost,
  unLikePost,
  updatePost,
} = require("../controllers/postCtrl");

const router = Router();
router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);

router.get("/explore", authMiddleware, getExplorePosts);

router.get("/:id", authMiddleware, getAPost);

router.get("/user/:username", authMiddleware, getUserPosts);
router.put("/like/:id", authMiddleware, likePost);
router.put("/unlike/:id", authMiddleware, unLikePost);
router.put("/update", authMiddleware, updatePost);
router.delete("/delete/:id", authMiddleware, deletePost);
router.get("/save/:id", authMiddleware, getSavedPost);

module.exports = router;
