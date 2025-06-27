const { z } = require("zod");

const createDocSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title too long" })
});

module.exports = createDocSchema;
