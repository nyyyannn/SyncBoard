const express = require("express");
const router = express.Router();
const client = require("../liveblocks/config");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/auth",authMiddleware, async(req, res)=>
{
    try
    {
        const session = client.auth({
            userId:req.userID,
            userInfo:{
                name:req.user.username,
                email:req.user.email,
            }
        });

        res.status(200).json(session);
    }
    catch(error)
    {
        res.status(500).json({message:"Liveblocks authentication failed"});
    }
});

module.exports = router;