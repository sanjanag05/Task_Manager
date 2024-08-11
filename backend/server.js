const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoutes");
const taskRoute = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const mongoUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((error) => {
    console.error(error);
  });

app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);
app.use("/api/profile", profileRoutes);
app.get("/", (req, res) => {
  res.send("Hello from MERN stack!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
