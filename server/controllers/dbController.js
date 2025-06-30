const Task = require('../models/Task'); 

async function getTasks(req, res) {
  try {
    const tasks = await Task.find({}); 
    res.status(200).json(tasks); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message }); 
  }
}

async function addTask(req, res) {
  try {
    const { title } = req.body; 

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required to add a task.' });
    }

    const task = await Task.create({ title }); 
    res.status(201).json({ success: true, data: task }); 
  } catch (error) {
    if (error.name === 'ValidationError') { 
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message }); 
  }
}

async function toggleTask(req, res) {
  try {
    const { id: taskId } = req.params; 

    let task = await Task.findById(taskId); 

    if (!task) {
      return res.status(404).json({ success: false, message: `No task found with ID: ${taskId}` }); // אם המשימה לא נמצאה
    }

    task.done = !task.done; 
    task = await task.save(); 

    res.status(200).json({ success: true, data: task }); 
  } catch (error) {
    if (error.name === 'CastError') { 
      return res.status(400).json({ success: false, message: 'Invalid Task ID format.' });
    }
    res.status(500).json({ success: false, message: error.message }); 
  }
}

async function deleteTask(req, res) {
  try {
    const { id: taskId } = req.params; 

    const task = await Task.findByIdAndDelete(taskId); 

    if (!task) {
      return res.status(404).json({ success: false, message: `No task found with ID: ${taskId}` }); 
    }

    res.status(200).json({ success: true, data: {} }); 
  } catch (error) {
    if (error.name === 'CastError') { 
      return res.status(400).json({ success: false, message: 'Invalid Task ID format.' });
    }
    res.status(500).json({ success: false, message: error.message }); 
  }
}

module.exports = {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
};
