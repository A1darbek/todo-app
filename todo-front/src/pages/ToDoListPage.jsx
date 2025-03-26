import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import TaskForm from '../components/TaskForm.jsx';

import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Stack,
} from '@mui/material';

const ToDoListPage = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (taskId) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (res.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <Box maxWidth="600px" margin="auto" mt={4}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h5">Your To-Do List</Typography>
                <Button variant="outlined" color="error" onClick={logout}>
                    Logout
                </Button>
            </Stack>

            <Box mb={4}>
                <TaskForm
                    onTaskCreated={fetchTasks}
                    editingTask={editingTask}
                    onEditComplete={() => setEditingTask(null)}
                />
            </Box>

            <Stack spacing={2}>
                {tasks.map((task) => (
                    <Card key={task._id} variant="outlined">
                        <CardContent>
                            <Typography variant="h6">{task.title}</Typography>
                            <Typography variant="body2">{task.description}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setEditingTask(task)}
                            >
                                Edit
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(task._id)}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export default ToDoListPage;
