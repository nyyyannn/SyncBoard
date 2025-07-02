const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); //contains user data

const authMiddleware = async (req, res, next) => //passing next is a must! to move to next middleware
{
    const token = req.header("Authorization"); //not headers* Authorization is the key part (check postman)

    //if you attempt to use an expired token, you'll receive an error.
    if(!token)
    {
        return res.
            status(401).
            json({message:"Unauthorized HTTP, token not provided"});
    }

    //Assuming token is in the format "Bearer <jwtToken>, removing the prefix"
    const jwtToken = token.split(" ")[1]; // much safer

    if (!jwtToken) return res.status(401).json({ message: "Malformed token" });

    try
    {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET); //they should match (.verify is provided by jwttoken);
        // console.log("Token verified:", isVerified);
        const userData = await User.
                                findOne({ _id : isVerified.id }).
                                select({ password: 0});//to check the collection and find a user with a matching email and remove the password from the data received
        // console.log("User data:", userData);
        req.user = userData;
        req.token = token;
        req.userID = userData._id.toString(); //passing custom information in the request. To pass information between middleware functions.
        next();    
    }
    catch(error)
    {
        return res.
            status(401).
            json({message:"Unauthorized. Invalid token"});
    }
}

module.exports = authMiddleware;