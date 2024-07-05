const { Request, Response, NextFunction } = require("express");
const User = require("../models/userModel");
const jsonwebtoken = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decoded?.id);
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    res.json({ message: error.message });
  }
});

module.exports = { authMiddleware };
