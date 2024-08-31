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

// Define the allowed IPs for access (multiple IPs can be added)
const allowedIps = ['10.220.215.126', serverIp]; // Example: localhost and s1's IP

// Middleware to restrict access based on IP address
app.use((req, res, next) => {
    const clientIp = req.socket.remoteAddress.replace('::ffff:', ''); // Clean up IPv4 format from IPv6 style

    console.log('Request IP:', clientIp); // Log the incoming IP for debugging

    // Allow only requests coming from allowed IPs
    if (!allowedIps.includes(clientIp)) {
        return res.status(403).send('<h1>Access Denied: Server 2 can only be accessed from allowed IPs</h1>');
    }
    next();
});

// Endpoint for s2 to return info
app.get('/', (req, res) => {
    res.send(`
        <h1>Server 2 Response</h1>
        <p>Server IP: ${serverIp}</p>
        <p>Client IP: ${req.socket.remoteAddress.replace('::ffff:', '')}</p>
        <p>Browser: ${req.headers['user-agent']}</p>
        <p>Platform: ${req.headers['sec-ch-ua-platform'] || 'Unknown'}</p>
    `);
});

app.listen(port, () => {
    console.log(`Server 2 running at http://localhost:${port}`);
});
