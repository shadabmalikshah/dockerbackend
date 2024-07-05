const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateRefreshToken = require("../config/refreshtoken");
const accessToken = require("../config/jwtToken");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullname, username, email, password, faceBookId, avatar } = req.body;
    const newUserName = username.toLowerCase().replace(/ /g, "");
    const user_name = await User.findOne({ username: newUserName });

    if (user_name) {
      res.status(400).json({ msg: "This user name already exists." });
    }

    const user_email = await User.findOne({ email });
    if (user_email) {
      res.status(400).json({ msg: "This email already exists." });
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    } else {
      const newUser = await new User({
        avatar,
        fullname,
        username: newUserName,
        email,
        password,
        // faceBookId,
      }).save();

      const refreshToken = await generateRefreshToken(newUser?._id);
      const accesToken = await accessToken(newUser?._id);

      const updateuser = await User.findByIdAndUpdate(
        newUser.id,
        {
          token: accesToken,
        },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 720 * 60 * 60 * 1000,
      });

      res.json(updateuser);
    }
  } catch (err) {
    throw new Error(err);
  }
});

const loginFacebookUser = asyncHandler(async (req, res) => {
  try {
    const { faceBookId } = req.body;

    const findUser = await User.findOne({ faceBookId: faceBookId }).populate(
      "followers following",
      "avatar username fullname followers following"
    );

    if (!findUser) res.status(400).json({ msg: "This user does not exist." });
    else {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const accesToken = await accessToken(findUser?._id);

      const updateuser = await User.findByIdAndUpdate(
        findUser._id,
        {
          token: accesToken,
        },
        { new: true }
      ).populate(
        "followers following",
        "avatar username fullname followers following"
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 720 * 60 * 60 * 1000,
      });

      res.json(updateuser);
    }
  } catch (err) {
    throw new Error(err);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });

    if (!findUser) throw new Error("This email does not exist.");

    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const accesToken = await accessToken(findUser?._id);

      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          token: accesToken,
        },
        { new: true }
      ).populate(
        "followers following",
        "avatar username fullname followers following"
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/api/auth/refresh",
        maxAge: 720 * 60 * 60 * 1000,
      });

      res.json(updateuser);
    } else {
      throw new Error("Password is incorrect");
    }
  } catch (err) {
    throw new Error(err);
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const rfToken = req.cookies.refreshToken;

  if (!rfToken) res.status(400).json({ msg: "Please login now!" });

  const decoded = jwt.verify(rfToken, process.env.REFRESH_TOKEN);

  if (!decoded.id) res.status(400).json({ msg: "Please login now!" });

  const user = await User.findById(decoded.id);

  if (!user) res.status(400).json({ msg: "This account does not exist." });

  const access_token = accessToken(user._id);
  await User.findOneAndUpdate(
    { _id: user._id },
    {
      token: access_token,
    }
  );

  res.json(access_token);
});

const logout = asyncHandler(async (req, res) => {
  try {
    const rfToken = req.cookies.refreshToken;

    res.clearCookie("refreshToken", {
      httpOnly: true,
      path: "/api/auth/refresh",
      secure: true,
      sameSite: "none",
    });

    res.json({ msg: "Logged out!" });
  } catch (err) {
    throw new Error(err);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const {
      username,
      avatar,
      fullname,
      mobile,
      address,
      story,
      website,
      gender,
    } = req.body;

    const updateUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        username,
        avatar,
        fullname,
        mobile,
        address,
        story,
        website,
        gender,
      },
      { new: true }
    );

    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const getCurrentUser = await User.findOne({ _id: req.user._id });

    res.json(getCurrentUser);
  } catch (err) {
    throw new Error(err);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) res.status(400).json({ msg: "User not found with this email" });
  try {
    const resetUrl = `Hi ${user.username},<br>
    Sorry to hear you’re having trouble logging into Socito. We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now. <a href="https://localhost:3000/reset-password/${
      user.token
    }">Log in as ${user.username}</a>`;
    const data = {
      to: email,
      subject: `${user.username}, you can get back to Socito easily`,
      html: resetUrl,
    };
    sendEmail(data);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password, token } = req.body;

    const user = await User.findOne({
      refreshToken: token,
    }).populate(
      "followers following",
      "avatar username fullname followers following"
    );

    if (!user)
      res.status(400).json({ msg: "Token Expired, please try again later" });

    user.password = password;

    await user.save();
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  registerUser,
  loginUser,
  handleRefreshToken,
  logout,
  updateUser,
  getCurrentUser,
  loginFacebookUser,
  forgotPasswordToken,
  resetPassword,
};
