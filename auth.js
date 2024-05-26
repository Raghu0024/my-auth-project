const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const router = express.Router();
const PORT = process.env.PORT || 3000;

// Signup endpoint
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
});

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
});

// User details endpoint (protected)
router.get('/user', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const query = `SELECT id, username FROM users WHERE id = ?`;
        db.get(query, [decoded.id], (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ user });
        });
    });
});

module.exports = router;
