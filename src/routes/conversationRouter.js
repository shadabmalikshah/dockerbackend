const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleWare");
const {
  createConversation,
  deleteConversation,
  getAConversation,
  getConversation,
  isReadConversation,
} = require("../controllers/conversationCtrl");

const router = Router();
router.post("/:id", authMiddleware, createConversation);
router.get("/", authMiddleware, getConversation);
router.get("/:id", authMiddleware, getAConversation);

router.delete("/delete/:id", authMiddleware, deleteConversation);
router.put("/:id", authMiddleware, isReadConversation);

module.exports = router;
