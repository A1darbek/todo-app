import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

// Mock the GoogleLogin component from @react-oauth/google
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }) => (
        <button onClick={() => onSuccess({ credential: 'dummy-credential' })}>
            Google Login
        </button>
    ),
}));

// Mock the global fetch API
beforeEach(() => {
    global.fetch = vi.fn();
});

afterEach(() => {
    vi.resetAllMocks();
});

describe('LoginPage', () => {
    it('renders login form and submits credentials', async () => {
        // Simulate a successful login response
        // eslint-disable-next-line no-undef
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'dummy-token' }),
        });

        render(
            <AuthProvider>
                <Router>
                    <LoginPage />
                </Router>
            </AuthProvider>
        );

        // Fill in the form and submit
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const loginButton = screen.getByTestId('login-button');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        // Verify that fetch was called with the correct endpoint and options
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(global.fetch).toHaveBeenCalledWith(
            '/api/login',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
            })
        );
    });

    it('handles Google login click', async () => {
        // Simulate a successful response for Google login
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'dummy-google-token', email: 'google@example.com' }),
        });

        render(
            <AuthProvider>
                <Router>
                    <LoginPage />
                </Router>
            </AuthProvider>
        );

        // Simulate clicking the Google Login button
        const googleLoginButton = screen.getByRole('button', { name: /Google Login/i });
        fireEvent.click(googleLoginButton);

        // Verify that fetch was called for Google login
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(global.fetch).toHaveBeenCalledWith(
            '/api/google-login',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: 'dummy-credential' }),
            })
        );
    });
});
