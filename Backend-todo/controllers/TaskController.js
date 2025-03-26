class TaskController{
    constructor(taskService) {
        this.taskService = taskService
    }

    createTask = async (req, res) => {
        try {
            const userId = req.user.userId
            const task = await this.taskService.createTask(userId, req.body)
            res.status(201).json(task)
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    getTasks = async (req, res) => {
        try {
            const userId = req.user.userId
            const task = await this.taskService.getTasks(userId)
            res.json(task)
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    updateTask = async (req, res) => {
        try {
            const userId = req.user.userId
            const taskId = req.params.id
            const updatedTask = await this.taskService.updateTask(userId,taskId, req.body)
            res.json(updatedTask)
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    deleteTask = async (req, res) => {
        try {
            const userId = req.user.userId;
            const taskId = req.params.id;
            const deletedTask = await this.taskService.deleteTask(userId,taskId)
            res.json({ message: 'Task deleted successfully' })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
module.exports = TaskController;