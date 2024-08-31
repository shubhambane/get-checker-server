// s2.js
const express = require('express');
const app = express();
const port = 4000;

// Middleware to restrict access to only allow requests from s1
app.use((req, res, next) => {
    const customHeader = req.headers['x-custom-header'];
    console.log('Received custom header:', customHeader); // Debug log to check headers
    console.log('Request IP:', req.headers['x-forwarded-for']); // Log the received IP

    if (customHeader !== 'access-via-s1') {
        // Deny access if not accessed via s1
        return res.status(403).send('<h1>Access Denied: Server 2 can only be accessed via Server 1</h1>');
    }
    next();
});

// Endpoint for s2 to return info
app.get('/', (req, res) => {
    res.send(`
        <h1>Server 2 Response</h1>
        <p>IP: ${req.headers['x-forwarded-for']}</p>
        <p>Browser: ${req.headers['user-agent']}</p>
        <p>Platform: ${req.headers['sec-ch-ua-platform'] || 'Unknown'}</p>
    `);
});

app.listen(port, () => {
    console.log(`Server 2 running at http://localhost:${port}`);
});
