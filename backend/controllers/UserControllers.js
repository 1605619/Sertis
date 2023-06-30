require('../db/connection');
const User = require('../models/User');
const { generateAccessToken, getUserByUsername, createNewUser, handleLoginResponse } = require('../helpers/useHelpers');

class UserController {
  login(req, res) {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(422).json({ error: "Required field(s) missing" });
    }
  
    getUserByUsername(username)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Unauthorized user doesn't exist" });
        }
  
        if (user && password === user.password) {
          return handleLoginResponse(res, user);
        } else {
          return res.status(401).json({ error: "Unauthorized" });
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal server error" });
      });
  };
  
  signup(req, res) {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(422).json({ error: "Required field(s) missing" });
    }
  
    getUserByUsername(username)
      .then((user) => {
        if (user) {
          return res.status(409).json({ error: "Username already exists" });
        }
  
        createNewUser(username, password)
          .then((createdUser) => {
            if (!createdUser) {
              return res.status(500).json({ error: "Failed to create user" });
            }
  
            const accessToken = generateAccessToken(createdUser._id);
            res.json({
              success: true,
              access_token: accessToken,
              user_id: createdUser.id,
              username: createdUser.username,
            });
          })
          .catch((error) => {
            console.error("Error during user creation:", error);
            res.status(500).json({ error: "Failed to create user" });
          });
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
      });
  };
}


module.exports = UserController;