const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/index");
const {
  postTask,
  updateTask,
  deleteTask,
  getTaskByBulk,
  getTaskById,
} = require("../controllers/taskController");

router.post("/create", verifyAccessToken, postTask);
router.post("/update/:taskId", verifyAccessToken, updateTask);
router.post("/delete/:taskId", verifyAccessToken, deleteTask);
router.get("/:taskId", verifyAccessToken, getTaskById);
router.get("/", verifyAccessToken, getTaskByBulk);

module.exports = router;
