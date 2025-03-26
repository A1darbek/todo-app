const taskRepository = require('../repositories/taskRepository');

class TaskService{
    async createTask(userId, taskData) {
       return await taskRepository.create({...taskData, userId})
    }

    async getTasks(userId) {
        return taskRepository.findByUser(userId)
    }

    async updateTask(userId, taskId, updateData) {
        const updatedTask = await taskRepository.update(taskId, userId, updateData)
        if (!updatedTask) {
            throw new Error('Task not found or not authorized');
        }
        return updatedTask
    }

    async deleteTask(userId, taskId) {
        const deletedTask = await taskRepository.delete(taskId, userId)
        if (!deletedTask) {
            throw new Error('Task not found or not authorized');
        }
        return deletedTask
    }
}
module.exports = new TaskService();