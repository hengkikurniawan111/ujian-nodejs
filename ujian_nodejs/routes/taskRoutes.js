const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Endpoint GET /api/tasks
// Menerima query parameters: page, pageSize, q, done
router.get("/tasks", taskController.getAllTasks);

module.exports = router;
