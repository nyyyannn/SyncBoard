const User = require("../models/user-model");
const bcrypt = require("bcrypt");

const register = async(req,res) => {
    try
    {
        //Get registration data
        const {username, email, password} = req.body;
        
        //Check if email already exists
        const userExist = await User.findOne({email})
        if(userExist)
        {
            return res.status(400).json({message: "Email already exists"});
        }

        //creating if the email dosen't exist
        const userCreated = await User.create({username, email, password});

        res.
        status(201).
        json({ msg: "Registration successful", 
               token: await userCreated.generateToken(),
               userId: userCreated._id.toString(), //converting to string is a good practice.
            });
    }
    catch(error)
    {
        res.status(500).json("Internal Server Error");
        //next(error);
    }
};

module.exports = {register};

// Note: The above code assumes that the User model has a generateToken method defined, 
// which is used to create a JWT token for the user upon successful registration. 