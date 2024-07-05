const { Router } = require("express");

const {
  deleteImagesAvatar,
  deleteImagesMessages,
  deleteImagesPost,
  uploadImagesAvatar,
  uploadImagesMessages,
  uploadImagesPost,
} = require("../controllers/uploadImgCtrl");
const { authMiddleware } = require("../middleware/authMiddleWare");

const { imgResize, uploadPhoto } = require("../middleware/uploadImage");
const router = Router();

router.post(
  "/avatar",
  authMiddleware,
  uploadPhoto.array("images", 10),
  // imgResize,
  uploadImagesAvatar
);

router.post(
  "/post",
  authMiddleware,
  uploadPhoto.array("images", 10),
  // imgResize,
  uploadImagesPost
);

router.post(
  "/messages",
  authMiddleware,
  uploadPhoto.array("images", 10),
  // imgResize,
  uploadImagesMessages
);

router.delete("/delete-img/avatar/:id", authMiddleware, deleteImagesAvatar);
router.delete("/delete-img/post/:id", authMiddleware, deleteImagesPost);
router.delete("/delete-img/messages/:id", authMiddleware, deleteImagesMessages);

module.exports = router;
