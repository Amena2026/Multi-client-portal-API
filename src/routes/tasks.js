const express = require('express');
const router = express.Router()
const taskController = require('../controllers/taskController')

router.get('/', taskController.getAllTasks)
router.get('/', taskController.createNewTask)
router.get('/:id', taskController.getSingleTask)
router.get('/:id', taskController.updateTask)
router.get('/:id', taskController.deleteTask)

module.exports = router;