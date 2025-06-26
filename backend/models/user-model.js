const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // prevent duplicate accounts
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false //never return password hash in queries
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateToken = async function () {
  try
  {
    const payload = { id: this._id.toString() };
    const secret = process.env.JWT_SECRET;
    return jwt.sign(payload, secret, { expiresIn: '1d' });
  }
  catch
  {
    console.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
};

userSchema.pre('save', async function(next){
    const user = this; //current user object being saved(the one above)

    try
    {
        if(!user.isModified("password"))
        {
            return next();
        }
        const saltRound = await bcrypt.genSalt(10); //higher the value, the more complex and time consuming.
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    }
    catch(error)
    {
        next(error);
    }
});

// Instance method: password comparison (for login)
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
