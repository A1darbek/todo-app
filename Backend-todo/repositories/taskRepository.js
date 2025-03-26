const Task = require('../models/Task');

class TaskRepository{
    async create(taskData) {
        const task = new Task(taskData)
        return await task.save()
    }

    async findByUser(userId) {
        return Task.find({userId});
    }

    async update(taskId, userId, updateData) {
        return Task.findOneAndUpdate({_id: taskId, userId}, updateData, {new: true});
    }

    async delete(taskId, userId) {
        return Task.findOneAndDelete({_id: taskId, userId })
    }
}
module.exports = new TaskRepository();