const express = require("express");
const router = express.Router();
const client = require("../liveblocks/config"); // this should export createClient()
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/auth", authMiddleware, async (req, res) => {
  try {
    const { room } = req.body; // room = doc._id
    if (!room) return res.status(400).json({ message: "Missing room ID" });

    const session = client.auth({
      room,
      userId: req.userID,
      userInfo: {
        name: req.user.username,
        email: req.user.email,
      },
    });

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Liveblocks authentication failed" });
  }
});

module.exports = router;
