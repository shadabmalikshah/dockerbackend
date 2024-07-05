const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleWare");
const {
  searchUser,
  getUser,
  followUser,
  unfollowUser,
  getSuggestionUser,
  savePost,
  unSavePost,
} = require("../controllers/userCtrl");

const router = Router();

router.get("/search", searchUser);
router.get("/suggestions", authMiddleware, getSuggestionUser);
router.get("/:username", authMiddleware, getUser);
router.put("/follow/:id", authMiddleware, followUser);
router.put("/unfollow/:id", authMiddleware, unfollowUser);
router.put("/save-post/:id", authMiddleware, savePost);
router.put("/unsave-post/:id", authMiddleware, unSavePost);

module.exports = router;
