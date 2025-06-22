const mongoose = require('mongoose');
const {Schema, model} = mongoose;

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
  passwordHash: {
    type: String,
    required: true,
    select: false //never return password hash in queries
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = model('User', userSchema);

module.exports = User;
