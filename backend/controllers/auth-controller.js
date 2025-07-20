const User = require("../models/user-model");
const bcrypt = require("bcrypt");

const signup = async(req,res) => {
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

const login = async (req, res,next) =>
{
    try
    {
        const {email, password} = req.body;

        //check if user exists or not.
        const userExist = await User.findOne({email}).select("+password");//returns the entire details of the user 
        // and the password field as well even thought it is not selected by default. (schema: password: {select: false})
        if(!userExist)
        {
            return res.status(400).json({message:"User does not exist"});
        }
        
        const user = await userExist.comparePassword(password);//comparing the password.
        
        if(user)
        {
            res.
            status(200).
            json({ 
                    msg: "Login successful", 
                    token: await userExist.generateToken(),
                    userId: userExist._id.toString(), 
                });
        }
        else
        {
            res.status(400).json({message:"Invalid Credentials"})
        }
    
    } 
    catch(error)
    {
        next(error);
    }
};

const user = async (req,res) =>
{
    try {
        const userData = req.user;
        res.status(200).json({userData})
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}
module.exports = {signup,login,user};

// Note: The above code assumes that the User model has a generateToken method defined, 
// which is used to create a JWT token for the user upon successful registration. 