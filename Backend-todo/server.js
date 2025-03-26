const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express();
const PORT  = process.env.PORT || 5000;

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err))

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res) => {
    // Log the error details
    console.error(err.stack);

    // Respond with a generic error message, but include err.message for meaningful info
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});