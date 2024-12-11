const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

// HTTP Server for handling HTTP requests
const httpServer = http.createServer((req, res) => {
  console.log('HTTP PROXY:', req.url);
  const target = new URL(req.url);
  proxy.web(req, res, {
    target: `${req.protocol}://${target.host}`,
    changeOrigin: true,
    secure: false // Bypass certificate validation for HTTPS (forwards HTTPS without inspection)
  });
});

// Handle errors for HTTP proxy
proxy.on('error', (err, req, res) => {
  console.error('HTTP Proxy Error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong with the HTTP proxy.');
});

// HTTPS Server for handling HTTPS requests
const httpsServer = https.createServer((req, res) => {
  console.log('HTTPS PROXY:', req.url);
  const target = new URL(`https://${req.headers.host}${req.url}`);
  proxy.web(req, res, {
    target: target.href,
    changeOrigin: true,
    secure: false // Bypass certificate validation for HTTPS (forwards HTTPS without inspection)
  });
});

// Handle errors for HTTPS proxy
proxy.on('error', (err, req, res) => {
  console.error('HTTPS Proxy Error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong with the HTTPS proxy.');
});

// Start HTTP server
httpServer.listen(8080, () => {
  console.log('HTTP Proxy Server running on port 8080');
});

// Start HTTPS server
httpsServer.listen(8443, () => {
  console.log('HTTPS Proxy Server running on port 8443');
});
