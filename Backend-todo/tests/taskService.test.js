const taskService = require('../services/taskService');
const taskRepository = require('../repositories/taskRepository');

jest.mock('../repositories/taskRepository');

describe('TaskService', () => {
    describe('createTask', () => {
        it('should create a new task for the given user', async () => {
            // Arrange
            const taskData = { title: 'Test Task', description: 'Test Description' };
            const userId = 'user123'
            taskRepository.create.mockResolvedValue({ _id: 'task123', ...taskData, userId: userId });

            // Act
            const task = await taskService.createTask(userId, taskData)

            // Assert
            expect(task).toHaveProperty('_id', 'task123')
            expect(task).toHaveProperty('userId', userId)
        });
    });
    describe('getTasks', () => {
        it('should return tasks for the given user', async () => {
            // Arrange
            const userId = 'user123'
            const tasks = [{ _id: 'task1', title: 'Task1', userId }]
            taskRepository.findByUser.mockResolvedValue(tasks)

            // Act
            const result = await taskService.getTasks(userId)


            // Assert
            expect(result).toEqual(tasks)
        });
    });

    describe('updateTask', () => {
        it('should update and return the task if it exists', async () => {
            // Arrange
            const userId = 'user123';
            const taskId = 'task1';
            const updateData = { title: 'Updated Task' };
            const updatedTask = { _id: taskId, title: 'Updated Task', userId}
            taskRepository.update.mockResolvedValue(updatedTask)

            // Act
            const result = await taskService.updateTask(userId, taskId, updateData)

            // Assert
            expect(result).toEqual(updatedTask)
        });
        it('should throw an error if the task is not found or not authorized', async () => {
            // Arrange
            const userId = 'user123'
            const taskId = 'nonexistent'
            const updateData = { title: 'Updated Task'}
            taskRepository.update.mockResolvedValue(null)

            // Act & Assert
            await expect(taskService.updateTask(userId, taskId, updateData))
                .rejects.toThrow('Task not found or not authorized')
        });
    });

    describe('deleteTask', () => {
        it('should delete and return the task if it exists', async () => {
            // Arrange
            const userId = 'user123'
            const taskId = 'task1'
            taskRepository.delete.mockResolvedValue({ _id: taskId, userId})

            // Act
            const result = await taskService.deleteTask(userId, taskId)

            // Assert
            expect(result).toHaveProperty('_id', taskId)
        });
        it('should throw an error if the task is not found or not authorized', async () => {
            // Arrange
            const userId = 'user123';
            const taskId = 'nonexistent';
            taskRepository.delete.mockResolvedValue(null)

            // Act & Assert
            await expect(taskService.deleteTask(userId, taskId))
                .rejects.toThrow('Task not found or not authorized')
        });
    });
});