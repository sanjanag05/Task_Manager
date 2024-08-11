const Task = require("../models/Task");
require("dotenv").config();

const getTaskByBulk = async (req, res) => {
  console.log("req.user:", req.user);

  try {
    // Retrieve all tasks with specific fields
    const tasks = await Task.find({}, "content title id description"); // Projection syntax
    res.status(200).json({
      tasks,
      status: true,
      msg: "Tasks found successfully.",
    });
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

const getTaskById = async (req, res) => {
  const taskId = req.params.taskId;
  console.log("taskId", taskId);
  try {
    const task = await Task.findOne({
      _id: taskId,
    });
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found.." });
    }
    res
      .status(200)
      .json({ task, status: true, msg: "Task found successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
const postTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({ user: req.user.id, title, description });
    res
      .status(200)
      .json({ task, status: true, msg: "Task created successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!description || !title) {
      return res.status(400).json({ status: false, msg: "" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(400)
        .json({ status: false, msg: "Task with given id not found" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description },
      { new: true }
    );
    res
      .status(200)
      .json({ task, status: true, msg: "Task updated successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
const deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(400)
        .json({ status: false, msg: "Task with given id not found" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

module.exports = {
  getTaskById,
  postTask,
  deleteTask,
  updateTask,
  getTaskByBulk,
};
