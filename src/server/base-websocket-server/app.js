const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server on the HTTP server
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`Server received: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client has disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});