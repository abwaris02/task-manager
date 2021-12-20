const express = require("express");
const Task = require("../models/task");
const router = new express.Router();

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    const taskCreated = await task.save();
    res.status(201).json(taskCreated);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).json({ message: "Invalid description." });
    }
    res.json(task);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>{
    allowedUpdates.includes(update)
  });

  if (!isValidOperation) {
    return res.status(404).json({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json();
    }
    res.json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  try {
    if (!task) {
      res.status(404).json();
    }
    res.json(task);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
