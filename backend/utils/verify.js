const { z } = require("zod");

const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});
const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = { signinInput, signupInput };
