require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const sendMagicLinkEmail = require('./mailer');

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Mock User Database
const USERS = [
    { id: 1, email: 'example@example.com', name: 'Example User' }
];

// Endpoint to request a magic link
app.post('/magic-link', async (req, res) => {
    const { email } = req.body;
    const user = USERS.find(u => u.email === email);

    if (!user) {
        return res.status(404).send('User not found');
    }

    try {
        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the magic link email
        await sendMagicLinkEmail({ email, token });
        res.send('Magic link sent successfully. Check your email.');
    } catch (err) {
        console.error('Error sending magic link:', err);
        res.status(500).send('Error sending magic link');
    }
});

// Endpoint to verify the magic link
app.get('/verify', (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Token is required');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = USERS.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(401).send('Invalid token');
        }

        res.send(`Welcome, ${user.name}! Your login is successful.`);
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).send('Invalid or expired token');
    }
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
