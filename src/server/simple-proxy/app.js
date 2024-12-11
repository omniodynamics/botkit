const http = require('http');
const url = require('url');
const HttpsProxyAgent = require('https-proxy-agent');

// Create an HTTP server
const server = http.createServer((req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol || (req.connection.encrypted ? 'https:' : 'http:');
  const parsedUrl = url.parse(req.url); // Parse the URL to get path and query

  // Construct the full URL
  const fullUrl = `${protocol}//${host}${req.url}`;

  console.log('Request Details:');
  console.log(`- URL: ${fullUrl}`);
  console.log(`- Path: ${parsedUrl.pathname}`);
  
  // Extract filename from path
  const filename = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1);
  console.log(`- Filename: ${filename || 'No filename in path'}`);

  // Log the method and headers
  console.log(`- Method: ${req.method}`);
  console.log(`- Headers:`, JSON.stringify(req.headers, null, 2));

  // Determine if the request is HTTPS
  let agent = null;
  if (protocol === 'https:') {
    agent = new HttpsProxyAgent(`${protocol}//${host}`);
  }

  // Forward the request
  const proxyReq = http.request({
    method: req.method,
    hostname: host.split(':')[0], // Extract hostname
    port: host.includes(':') ? host.split(':')[1] : (protocol === 'https:' ? 443 : 80),
    path: req.url,
    headers: req.headers,
    agent: agent
  }, (proxyRes) => {
    // Set response headers as received from the target server
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Directly pipe the response body from the target server to the client
    proxyRes.pipe(res, {end: true}); // Ensure the response stream ends properly
  });

  // Pipe the request body through
  req.pipe(proxyReq, {end: true}); // Ensure the request stream ends properly

  // Handle any errors during the proxy request
  proxyReq.on('error', (e) => {
    console.error(`Proxy request error for ${fullUrl}:`, e.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error proxying request: ${e.message}`);
  });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});