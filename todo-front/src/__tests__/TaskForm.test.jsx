import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';
import { AuthContext } from '../context/AuthContext';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

// Create a custom provider to supply a dummy user
const dummyUser = { token: 'dummy-token' };

const AllProviders = ({ children }) => (
    <AuthContext.Provider value={{ user: dummyUser }}>
        {children}
    </AuthContext.Provider>
);

describe('TaskForm Component', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('renders empty form and submits new task', async () => {
        const onTaskCreated = vi.fn();
        const onEditComplete = vi.fn();

        // Render the TaskForm without an editingTask prop (new task mode)
        render(
            <AllProviders>
                <TaskForm onTaskCreated={onTaskCreated} onEditComplete={onEditComplete} />
            </AllProviders>
        );

        const titleInput = screen.getByLabelText(/Title/i);
        const descriptionInput = screen.getByLabelText(/Description/i);
        const submitButton = screen.getByRole('button', { name: /Add Task/i });

        // Ensure fields are initially empty
        expect(titleInput.value).toBe('');
        expect(descriptionInput.value).toBe('');

        // Simulate user input
        fireEvent.change(titleInput, { target: { value: 'Test Task' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

        // Mock fetch call for task creation (POST)
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                _id: 'task123',
                title: 'Test Task',
                description: 'Test Description',
                userId: dummyUser.token,
            }),
        });

        // Submit the form
        fireEvent.click(submitButton);

        // Wait for the onTaskCreated callback to be invoked and verify fetch call
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(onTaskCreated).toHaveBeenCalled();
        });

        // After submission, form fields should be cleared
        expect(titleInput.value).toBe('');
        expect(descriptionInput.value).toBe('');
    });

    it('renders prefilled fields when editingTask is provided and updates task', async () => {
        const onTaskCreated = vi.fn();
        const onEditComplete = vi.fn();
        const editingTask = {
            _id: 'task123',
            title: 'Old Title',
            description: 'Old Description',
        };

        // Render TaskForm with an editingTask prop (edit mode)
        render(
            <AllProviders>
                <TaskForm
                    editingTask={editingTask}
                    onTaskCreated={onTaskCreated}
                    onEditComplete={onEditComplete}
                />
            </AllProviders>
        );

        // Check that fields are prefilled
        const titleInput = screen.getByLabelText(/Title/i);
        const descriptionInput = screen.getByLabelText(/Description/i);
        const submitButton = screen.getByRole('button', { name: /Update Task/i });

        expect(titleInput.value).toBe('Old Title');
        expect(descriptionInput.value).toBe('Old Description');

        // Change field values
        fireEvent.change(titleInput, { target: { value: 'New Title' } });
        fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

        // Mock fetch call for task update (PUT)
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                _id: 'task123',
                title: 'New Title',
                description: 'New Description',
                userId: dummyUser.token,
            }),
        });

        // Submit the form
        fireEvent.click(submitButton);

        // Wait for fetch and both callbacks to be called
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(onTaskCreated).toHaveBeenCalled();
            expect(onEditComplete).toHaveBeenCalled();
        });
    });
});
