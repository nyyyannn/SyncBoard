const { z } = require('zod');

const signupSchema = z.object({
  username: z.string().min(3, "Username too short"),
  email: z.string().email("Invalid email format").
        min(3,{message:"Email must be at least 3 characters"}).
        max(255, {message: "Email must not be more than 255 characters"}),
  password: z.string().min(7, "Password must be at least 7 characters").
  max(1024, {message: "Password must not be more than 1024 characters"}),
});

module.exports = signupSchema;
