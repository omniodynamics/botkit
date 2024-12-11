const https = require('https');
const http = require('http');
const tls = require('tls');
const url = require('url');
const fs = require('fs');
const forge = require('node-forge');

// Read CA certificates and key
const CERT_DIR = './certs';
const caOptions = {
  key: fs.readFileSync(`${CERT_DIR}/ca-private-key.pem`),
  cert: fs.readFileSync(`${CERT_DIR}/ca-certificate.pem`)
};

// CA certificate for signing new certificates
const caCert = forge.pki.certificateFromPem(fs.readFileSync(`${CERT_DIR}/ca-certificate.pem`, 'utf8'));

function generateSiteCertificate(hostname) {
  console.log(`Generating certificate for hostname: ${hostname}`);
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [
    { name: 'commonName', value: hostname },
    { name: 'countryName', value: 'US' },
    { shortName: 'ST', value: 'California' },
    { name: 'localityName', value: 'San Francisco' },
    { name: 'organizationName', value: 'Your Company' },
    { shortName: 'OU', value: 'Your Department' }
  ];
  cert.setSubject(attrs);
  cert.setIssuer(caCert.subject.attributes);
  cert.setExtensions([
    { name: 'basicConstraints', cA: false },
    { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
    { name: 'extKeyUsage', serverAuth: true },
    { name: 'subjectAltName', altNames: [{ type: 2, value: hostname }] }
  ]);

  cert.sign(forge.pki.privateKeyFromPem(fs.readFileSync(`${CERT_DIR}/ca-private-key.pem`, 'utf8')));
  console.log(`Certificate generated for ${hostname}`);
  return {
    cert: forge.pki.certificateToPem(cert),
    key: forge.pki.privateKeyToPem(keys.privateKey)
  };
}

// Create an HTTPS server to act as a proxy
const server = https.createServer(caOptions, (req, res) => {
  console.log("Hello again...");
  const host = req.headers.host;  // This is the target host from the client's request
  const protocol = 'https:';
  const parsedUrl = url.parse(req.url);
  const fullUrl = `${protocol}//${host}${req.url}`;

  console.log(`Requesting HOST, ${host}`)

  console.log('Request Details:', fullUrl);
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  const { cert, key } = generateSiteCertificate(host);  // Generate cert for the requested host
  console.log(`Certificate and key generated for ${host}`);
  console.log("Trying...");

  // Establish a new secure connection to the target server using the original host details
  const options = {
    host: host.split(':')[0],
    port: host.includes(':') ? host.split(':')[1] : 443,
    method: req.method,
    path: req.url,
    headers: req.headers,
    rejectUnauthorized: false // Bypassing certificate validation for MITM purposes
  };

  console.log('Proxying request to:', options.host, options.port);

  const clientReq = https.request(options, (serverRes) => {
    console.log('Response from target server:', serverRes.statusCode);
    console.log('Response headers:', JSON.stringify(serverRes.headers, null, 2));
    // Forward the response from the server to the client
    res.writeHead(serverRes.statusCode, serverRes.headers);
    serverRes.pipe(res, {end: true});
  });

  // Handle client request data
  req.pipe(clientReq, {end: true});

  clientReq.on('error', (e) => {
    console.error(`Problem with request to ${fullUrl}:`, e.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error with request: ${e.message}`);
  });
});

// SSL/TLS options for the proxy server
server.addContext('*', {
  SNICallback: (servername, cb) => {
    console.log(`SNI Callback called for servername: ${servername}`);
    const { cert, key } = generateSiteCertificate(servername);
    console.log(`Generated new context for ${servername}`);
    const context = tls.createSecureContext({
      key: key,
      cert: cert
    });
    cb(null, context);
  }
});

const PORT = 8443;
server.listen(PORT, () => {
  console.log(`MITM Proxy server running on port ${PORT}`);
});