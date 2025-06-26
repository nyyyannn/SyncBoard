const { z } = require('zod');

const signupSchema = z.object({
  username: z.string().min(3, "Username too short"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

module.exports = signupSchema;
