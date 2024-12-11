const https = require('https');
const http = require('http');
const tls = require('tls');
const url = require('url');
const fs = require('fs');
const forge = require('node-forge');

// Directory for certificates
const CERT_DIR = './certs';

// Create the directory for certificates if it doesn't exist
fs.mkdirSync(CERT_DIR, { recursive: true });

// Function to generate self-signed CA if not exists
function ensureCACert() {
  const caKeyPath = `${CERT_DIR}/ca-private-key.pem`;
  const caCertPath = `${CERT_DIR}/ca-certificate.pem`;

  if (!fs.existsSync(caKeyPath) || !fs.existsSync(caCertPath)) {
    const caKeys = forge.pki.rsa.generateKeyPair(2048);
    const caCert = forge.pki.createCertificate();
    caCert.publicKey = caKeys.publicKey;
    caCert.serialNumber = '01';
    caCert.validity.notBefore = new Date();
    caCert.validity.notAfter = new Date();
    caCert.validity.notAfter.setFullYear(caCert.validity.notBefore.getFullYear() + 10);
    
    const attrs = [
      { name: 'commonName', value: 'Local CA' },
      { name: 'countryName', value: 'US' },
      { shortName: 'ST', value: 'California' },
      { name: 'localityName', value: 'San Francisco' },
      { name: 'organizationName', value: 'Your Company' },
      { shortName: 'OU', value: 'Your Department' }
    ];
    caCert.setSubject(attrs);
    caCert.setIssuer(attrs);
    caCert.setExtensions([
      { name: 'basicConstraints', cA: true },
      { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
      { name: 'subjectKeyIdentifier' }
    ]);

    caCert.sign(caKeys.privateKey);
    fs.writeFileSync(caKeyPath, forge.pki.privateKeyToPem(caKeys.privateKey));
    fs.writeFileSync(caCertPath, forge.pki.certificateToPem(caCert));
  }
}

// Generate CA if doesn't exist
ensureCACert();

// Read CA certificates and key
const caOptions = {
  key: fs.readFileSync(`${CERT_DIR}/ca-private-key.pem`),
  cert: fs.readFileSync(`${CERT_DIR}/ca-certificate.pem`)
};

// CA certificate for signing new certificates
const caCert = forge.pki.certificateFromPem(fs.readFileSync(`${CERT_DIR}/ca-certificate.pem`, 'utf8'));

// Function to generate and save a certificate for the target site
function generateAndSaveSiteCertificate(hostname) {
  const certFileName = `${hostname.replace(/[^a-zA-Z0-9]/g, '_')}.crt`; // Sanitize filename
  const certPath = `${CERT_DIR}/${certFileName}`;
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
    { name: 'localityName', value: 'Mountain View' },
    { name: 'organizationName', value: 'Google LLC' },
    { shortName: 'OU', value: 'Google' }
  ];

  cert.setSubject(attrs);
  cert.setIssuer(caCert.subject.attributes);
  cert.setExtensions([
    { name: 'basicConstraints', cA: false },
    { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
    { name: 'extKeyUsage', serverAuth: true },
    { name: 'subjectAltName', altNames: [{ type: 2, value: hostname }] } // Changed from "localhost:8443" to hostname
  ]);

  cert.sign(forge.pki.privateKeyFromPem(fs.readFileSync(`${CERT_DIR}/ca-private-key.pem`, 'utf8')));

  // Write certificate to file
  fs.writeFileSync(certPath, forge.pki.certificateToPem(cert));

  return {
    cert: forge.pki.certificateToPem(cert),
    key: forge.pki.privateKeyToPem(keys.privateKey)
  };
}

// Create an HTTPS server to act as a proxy
const server = https.createServer(caOptions, (req, res) => {
  const target = new URL(req.url);
  const hostname = target.hostname;
  
  // Generate and save certificate for the requested host
  const { cert, key } = generateAndSaveSiteCertificate(hostname);
  
  const context = tls.createSecureContext({
    key: key,
    cert: cert
  });

  // Create a new socket to connect to the destination with our generated certificate
  const clientSocket = new tls.TLSSocket(req.socket, {
    secureContext: context,
    isServer: true,
    requestCert: true,
    rejectUnauthorized: false
  });

  clientSocket.on('secureConnection', (secureSocket) => {
    const options = {
      host: hostname,
      port: target.port || 443,
      method: req.method,
      path: req.url,
      headers: req.headers,
      rejectUnauthorized: false // Bypass certificate validation for MITM
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, {end: true});
    });

    req.pipe(proxyReq, {end: true});
    proxyReq.on('error', (e) => {
      console.error('Proxy Error:', e);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error in proxying request: ' + e.message);
    });
  });
});

// SNI Handling for HTTPS (Server Name Indicated?)
// SAN (Subject Alternative Name)
server.addContext('*', {
  SNICallback: (servername, cb) => {
    console.log(`SNI Callback for: ${servername}`);
    const { cert, key } = generateAndSaveSiteCertificate(servername);
    const context = tls.createSecureContext({
      key: key,
      cert: cert
    });
    cb(null, context);
  }
});

// Start the server
const PORT = 8443;
server.listen(PORT, () => {
  console.log(`HTTPS Proxy Server running on port ${PORT}`);
});