const net = require('net');

// SOCKS4 Protocol Constants
const SOCKS4_CONNECT = 0x01;
const SOCKS4_CONNECT_SUCCESS = 0x5A;
const SOCKS4_CONNECT_FAILED = 0x5B;
const SOCKS4_VERSION = 0x04;

// Helper function to read bytes from a buffer
function read(buffer, offset, length) {
  return buffer.slice(offset, offset + length);
}

// Helper function to write bytes to a buffer
function write(buffer, offset, data) {
  data.copy(buffer, offset);
}

// Main server logic
const server = net.createServer((clientSocket) => {
  console.log('Client connected');

  clientSocket.on('data', (data) => {
    // Handle SOCKS4 handshake
    if (data[0] === SOCKS4_VERSION) {
      const command = data[1];
      const port = data[2] * 256 + data[3];
      const ip = `${data[4]}.${data[5]}.${data[6]}.${data[7]}`;

      // SOCKS4 does not support domain names, only IP addresses
      if (command === SOCKS4_CONNECT) {
        console.log(`Connect request for ${ip}:${port}`);

        // Create a new socket to connect to the destination
        const destinationSocket = new net.Socket();

        destinationSocket.on('connect', () => {
          console.log('Connected to destination');
          // Send success response back to client
          const response = Buffer.alloc(8);
          response[0] = 0; // Null byte for SOCKS4
          response[1] = SOCKS4_CONNECT_SUCCESS;
          clientSocket.write(response);

          // Pipe data between client and destination
          clientSocket.pipe(destinationSocket);
          destinationSocket.pipe(clientSocket);
        });

        destinationSocket.on('error', (error) => {
          console.error('Connection to destination failed:', error.message);
          // Send failure response
          const response = Buffer.alloc(8);
          response[0] = 0; // Null byte for SOCKS4
          response[1] = SOCKS4_CONNECT_FAILED;
          clientSocket.write(response);
          clientSocket.end();
        });

        destinationSocket.connect(port, ip);
      } else {
        console.log('Unsupported SOCKS4 command:', command);
        clientSocket.end();
      }
    }
  });
  
  clientSocket.on('error', (err) => {
    console.error('Client socket error:', err);
  });

  clientSocket.on('close', (hadError) => {
    console.log('Client disconnected', hadError ? 'with error' : '');
  });
});

// Start the server
const PORT = 1080; // Common SOCKS port
server.listen(PORT, () => {
  console.log(`SOCKS4 Proxy server listening on port ${PORT}`);
});
