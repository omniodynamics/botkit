#!/bin/bash

# Directory to store certificates
CERT_DIR="./certs"
mkdir -p $CERT_DIR

# CA Key
openssl genrsa -out $CERT_DIR/ca-private-key.pem 4096

# CA Certificate
cat > $CERT_DIR/ca.cnf <<EOF
[req]
default_bits = 4096
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C=US
ST=State
L=City
O=Your Organization
OU=Your Department
CN=Your CA Name
emailAddress=your@email.com

[v3_ca]
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, keyCertSign
EOF

openssl req -x509 -new -nodes -key $CERT_DIR/ca-private-key.pem \
    -sha256 -days 3650 -out $CERT_DIR/ca-certificate.pem \
    -config $CERT_DIR/ca.cnf -extensions v3_ca

openssl x509 -in $CERT_DIR/ca-certificate.pem -outform DER -out $CERT_DIR/ca-certificate.crt


# Cleanup
rm $CERT_DIR/ca.cnf

echo "CA certificate and key have been generated in $CERT_DIR"