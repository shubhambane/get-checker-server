// s1.js
const express = require('express');
const axios = require('axios');
const os = require('os');
const app = express();
const port = 3000;

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

// Middleware to get client info
app.use((req, res, next) => {
    req.clientInfo = {
        ip: req.socket.remoteAddress,
        browser: req.headers['user-agent'],
        platform: req.headers['sec-ch-ua-platform'] || 'Unknown',
    };
    next();
});

// Variables to store results from each case
let s1Result = '';
let s2DirectAccessResult = '<h1>Access Denied to Server 2</h1>';
let s2ViaS1Result = '<h1>Server 2 Response via Server 1</h1>';

// Endpoint to access s1 directly
app.get('/', async (req, res) => {
    // Populate s1 result
    s1Result = `
        <h2>Case 1: Accessing Server 1 Directly</h2>
        <p>Server IP: ${serverIp}</p>
        <p>Client IP: ${req.clientInfo.ip}</p>
        <p>Browser: ${req.clientInfo.browser}</p>
        <p>Platform: ${req.clientInfo.platform}</p>
    `;

    // Attempt to access s2 via s1
    try {
        const response = await axios.get('http://localhost:4000');
        s2ViaS1Result = `
            <h2>Case 3: Accessing Server 2 via Server 1</h2>
            ${response.data}
        `;
    } catch (error) {
        console.error('Error accessing s2:', error.message); // Log the error message
        console.error('Error details:', error); // Log the complete error object for debugging
        s2ViaS1Result = `<h2>Case 3: Accessing Server 2 via Server 1</h2><p>Error: ${error.message}</p>`;
    }

    // Render all three cases
    res.send(`
        <html>
            <head><title>Access Results</title></head>
            <body>
                <h1>Access Test Results</h1>
                <div>${s1Result}</div>
                <div>
                    <h2>Case 2: Accessing Server 2 Directly</h2>
                    ${s2DirectAccessResult}
                </div>
                <div>${s2ViaS1Result}</div>
            </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server 1 running at http://localhost:${port}`);
});
