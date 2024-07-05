const { Router } = require("express");
const {
  handleRefreshToken,
  loginUser,
  logout,
  registerUser,
  updateUser,
  loginFacebookUser,
  getCurrentUser,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/authCtrl");
const { authMiddleware } = require("../middleware/authMiddleWare");

const router = Router();
router.post("/refresh", handleRefreshToken);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-facebook", loginFacebookUser);

router.post("/logout", logout);
router.put("/", authMiddleware, updateUser);
router.get("/", authMiddleware, getCurrentUser);
router.post("/forgot-password", forgotPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;

