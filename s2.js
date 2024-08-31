// s2.js
const express = require('express');
const os = require('os');
const app = express();
const port = 4000;

// Function to get the server's IP address
function getServerIp() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'Unknown IP';
}

// Server IP
const serverIp = getServerIp();

// Define the allowed IP for access (s1's IP address)
const allowedIp = '10.220.81.111'; // Replace with the actual IP of s1 when deployed

// Middleware to restrict access based on IP address
app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log('Request IP:', clientIp); // Log the incoming IP for debugging

    // Allow only requests coming from the allowed IP
    if (clientIp !== allowedIp) {
        return res.status(403).send('<h1>Access Denied: Server 2 can only be accessed via Server 1</h1>');
    }
    next();
});

// Endpoint for s2 to return info
app.get('/', (req, res) => {
    res.send(`
        <h1>Server 2 Response</h1>
        <p>Server IP: ${serverIp}</p>
        <p>Client IP: ${req.headers['x-forwarded-for']}</p>
        <p>Browser: ${req.headers['user-agent']}</p>
        <p>Platform: ${req.headers['sec-ch-ua-platform'] || 'Unknown'}</p>
    `);
});

app.listen(port, () => {
    console.log(`Server 2 running at http://localhost:${port}`);
});
