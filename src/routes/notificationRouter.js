const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleWare");
const {
  createNotify,
  deleteNotify,
  getNotify,
  isReadNotify,
} = require("../controllers/notificationCtrl");

const router = Router();
router.post("/", authMiddleware, createNotify);

router.get("/", authMiddleware, getNotify);
router.delete("/:id", authMiddleware, deleteNotify);
router.put("/:id", authMiddleware, isReadNotify);

module.exports = router;

