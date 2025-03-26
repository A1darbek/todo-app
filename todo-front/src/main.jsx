import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // MUI blue
        },
        secondary: {
            main: '#9c27b0', // MUI purple
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </GoogleOAuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);
