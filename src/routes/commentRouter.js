const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleWare");
const {
  createComment,
  deleteComment,
  getComments,
  getCommentsByPost,
  likeComment,
  unLikeComment,
  updateComment,
} = require("../controllers/commentCtrl");

const router = Router();
router.post("/", authMiddleware, createComment);

router.get("/", authMiddleware, getComments);
router.get("/:id", authMiddleware, getCommentsByPost);

router.put("/like/:id", authMiddleware, likeComment);
router.put("/unlike/:id", authMiddleware, unLikeComment);
router.put("/update", authMiddleware, updateComment);
router.delete("/delete/:id", authMiddleware, deleteComment);

module.exports = router;
