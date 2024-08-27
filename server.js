// server.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/shubham', (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.send(`Your IP address is: ${ip}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});