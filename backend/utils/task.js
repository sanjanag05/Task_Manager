const { z } = require("zod");

// Define the Zod schema for a Task
const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
});

module.exports = { taskSchema };
