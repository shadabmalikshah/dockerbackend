const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN, {
    expiresIn: "30d",
  });
};

module.exports = generateRefreshToken;
