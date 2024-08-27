// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Enable trust proxy to get the real client IP
app.set('trust proxy', true);

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request from IP: ${req.ip}`);
  next();
});

// Route to get the client's IP address
app.get('/', (req, res) => {
  const forwardedIpsStr = req.headers['x-forwarded-for'] || '';
  const forwardedIps = forwardedIpsStr.split(',').map(ip => ip.trim()).filter(ip => ip);
  const ip = forwardedIps.length ? forwardedIps[0] : req.connection.remoteAddress;
  res.json({ ipAddress: ip });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});