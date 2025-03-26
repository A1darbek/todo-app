// src/__tests__/ToDoListPage.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ToDoListPage from '../pages/ToDoListPage';
import { AuthContext } from '../context/AuthContext';

// 1) Provide a dummy user and logout mock
const dummyUser = { token: 'dummy-token' };
const mockLogout = vi.fn();

// 2) Utility to render ToDoListPage with the AuthContext
function renderWithAuth(ui, { user = dummyUser, logout = mockLogout } = {}) {
    return render(
        <AuthContext.Provider value={{ user, logout }}>
            {ui}
        </AuthContext.Provider>
    );
}

describe('ToDoListPage', () => {
    // 3) Mock fetch in each test
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.resetAllMocks();
        mockLogout.mockClear();
    });

    it('fetches and displays tasks from the server', async () => {
        // Arrange: mock a successful fetch returning 2 tasks
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: 'task1', title: 'Task 1', description: 'First task' },
                { _id: 'task2', title: 'Task 2', description: 'Second task' },
            ],
        });

        // Act
        renderWithAuth(<ToDoListPage />);

        // Assert: wait for tasks to appear
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
            expect(screen.getByText('First task')).toBeInTheDocument();
            expect(screen.getByText('Second task')).toBeInTheDocument();
        });

        // Also confirm fetch was called once with the correct headers
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('/api/tasks', expect.objectContaining({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${dummyUser.token}`,
            },
        }));
    });

    it('calls logout when the "Logout" button is clicked', async () => {
        // Arrange: mock an empty tasks fetch
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        // Act
        renderWithAuth(<ToDoListPage />);

        // Wait for tasks fetch to finish so the page is stable
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        // Click the logout button
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        // Assert: logout is called
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('deletes a task when "Delete" button is clicked', async () => {
        // We expect 3 fetch calls in total
        global.fetch
            // 1) Initial tasks fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    { _id: 'task1', title: 'Task 1', description: 'First task' },
                ],
            })
            // 2) The DELETE call
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            })
            // 3) The refetch after successful delete
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

        renderWithAuth(<ToDoListPage />);

        // Wait for the initial tasks to appear
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
        });

        // Click delete
        fireEvent.click(screen.getByRole('button', { name: /delete/i }));

        // By now, we expect 3 fetch calls in total
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(3);
        });

        // 2nd call was DELETE
        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            '/api/tasks/task1',
            expect.objectContaining({ method: 'DELETE' })
        );

        // 3rd call is the refetch
        expect(global.fetch).toHaveBeenNthCalledWith(
            3,
            '/api/tasks',
            expect.objectContaining({})
        );

        // The updated tasks list is empty
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    });


    it('starts editing a task when "Edit" is clicked', async () => {
        // Arrange: mock tasks
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: 'task1', title: 'My Task', description: 'Some details' },
            ],
        });

        renderWithAuth(<ToDoListPage />);

        // Wait for tasks to appear
        await waitFor(() => {
            expect(screen.getByText('My Task')).toBeInTheDocument();
        });

        // Click "Edit"
        const editButton = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editButton);

        // The TaskForm is now in "edit mode"
        // Usually you'd check for "Update Task" button or pre-filled fields
        expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
        expect(screen.getByDisplayValue('My Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Some details')).toBeInTheDocument();
    });
});
