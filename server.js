const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const authenticateToken = require('./middleware');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', authRoutes);

// Protect the user details route
app.get('/api/user', authenticateToken, (req, res) => {
    // This route is protected
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
