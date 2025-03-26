import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';

import { Box, Typography, TextField, Button, Alert, Stack } from '@mui/material';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                const data = await res.json();
                login({ token: data.token, email });
                navigate('/todos');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const res = await fetch('/api/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });
            if (res.ok) {
                const data = await res.json();
                login({ token: data.token, email: data.email });
                navigate('/todos');
            } else {
                setError('Google login failed');
            }
        } catch (err) {
            setError('An error occurred during Google login');
        }
    };

    const handleGoogleLoginError = () => {
        setError('Google login failed');
    };

    return (
        <Box
            maxWidth="400px"
            margin="auto"
            mt={5}
            p={3}
            borderRadius={2}
            boxShadow={3}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleFormSubmit} mb={2}>
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Login
                </Button>
            </Box>

            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
            />

            <Stack direction="row" justifyContent="space-between" mt={2}>
                <Typography variant="body1">
                    Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
                </Typography>
            </Stack>
        </Box>
    );
};

export default LoginPage;
