const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require('../db/connection');
const User = require('../models/User');

function handleLoginResponse(res, user) {
  const accessToken = generateAccessToken(user.id);
  res.json({
    success: true,
    access_token: accessToken,
    user_id: user.id,
    username: user.username,
  });
};

function createNewUser(username, password) {
  return new Promise((resolve, reject) => {
    const newUser = new User({ username, password });
    newUser.save()
      .then((createdUser) => {
        console.log('User created:', createdUser);
        resolve(createdUser);
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        reject(error);
      });
  });
}

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({ username })
      .then((user) => resolve(user))
      .catch((error) => {
        console.error('Error fetching user:', error);
        reject(error);
      });
  });
};

function generateAccessToken(userId) {
  const expiresIn = "1h";
  const token = jwt.sign({ userId }, "your_secret_key", { expiresIn });
  return token;
}

module.exports = {
  generateAccessToken,
  createNewUser,
  getUserByUsername,
  handleLoginResponse,
};
