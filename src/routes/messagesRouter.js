const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleWare");
const {
  createMessages,
  deleteMessages,
  getMessages,
} = require("../controllers/messagesCtrl");

const router = Router();
router.post("/", authMiddleware, createMessages);
router.get("/:id", authMiddleware, getMessages);
router.delete("/delete/:id", authMiddleware, deleteMessages);

module.exports = router;

