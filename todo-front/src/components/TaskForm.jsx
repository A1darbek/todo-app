// components/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    Box,
    TextField,
    Button,
    Typography,
} from '@mui/material';

const TaskForm = ({ onTaskCreated, editingTask, onEditComplete }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [editingTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingTask ? 'PUT' : 'POST';
        const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ title, description }),
            });
            if (res.ok) {
                setTitle('');
                setDescription('');
                onTaskCreated();
                if (editingTask) onEditComplete();
            }
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" mb={2}>
                {editingTask ? 'Update Task' : 'Add Task'}
            </Typography>

            <TextField
                label="Title"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
            >
                {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
        </Box>
    );
};

export default TaskForm;
