// s1.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to get client info
app.use((req, res, next) => {
    req.clientInfo = {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        browser: req.headers['user-agent'],
        platform: req.headers['sec-ch-ua-platform'] || 'Unknown'
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
        <p>IP: ${req.clientInfo.ip}</p>
        <p>Browser: ${req.clientInfo.browser}</p>
        <p>Platform: ${req.clientInfo.platform}</p>
    `;

    // Attempt to access s2 via s1
    try {
        const response = await axios.get('http://localhost:4000', {
            headers: {
                'x-forwarded-for': req.clientInfo.ip,
                'user-agent': req.clientInfo.browser,
                'sec-ch-ua-platform': req.clientInfo.platform,
                'x-custom-header': 'access-via-s1', // Custom header to identify requests from s1
            },
        });
        s2ViaS1Result = `
            <h2>Case 3: Accessing Server 2 via Server 1</h2>
            ${response.data}
        `;
    } catch (error) {
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
