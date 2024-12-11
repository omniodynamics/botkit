# Let's Encrypt's ACME Tool
- Automated Certificate Management Environment
| automatic issuance, renewal, and management of SSL/TLS certificates
| The ACME protocol allows servers to automatically prove to Let's Encrypt that they control a domain. This is done through various challenge types like HTTP-01 (where a file is placed on the server) or DNS-01 (where a TXT record is added to the DNS).

# Setting Up a Self-Signed CA

This guide walks you through the process of creating a self-signed Certificate Authority (CA) for testing or internal use.

## Steps:

1. **Prepare the Environment**
   - Ensure OpenSSL is installed on your system. On Debian-based systems:
     ```bash
     sudo apt-get update
     sudo apt-get install openssl
     ```

2. **Create Necessary Directories**
   - Create a directory structure to keep your CA files organized:
     ```bash
     mkdir -p ~/myCA/{private,certs,newcerts}
     cd ~/myCA
     touch index.txt
     echo 1000 > serial
     ```

3. **Generate the CA Private Key**
   - Generate a private key for your CA. Use 4096 bits for enhanced security:
     ```bash
     openssl genrsa -aes256 -out private/ca.key.pem 4096
     ```

4. **Create the CA Certificate**
   - Create a self-signed certificate for your CA:
     ```bash
     opav3lenssl req -config /etc/ssl/openssl.cnf -key private/ca.key.pem -new -x509 -days 3650 -sha256 -extensions v3_ca -out certs/ca.cert.pem
     ```
   - You'll be prompted for details like country name, organization, etc. These will be embedded in the certificate.

5. **Verify CA Certificate**
   - Check to ensure the certificate was created correctly:
     ```bash
     openssl x509 -noout -text -in certs/ca.cert.pem
     ```

6. **Create a Certificate Signing Request (CSR) for a Server**
   - Generate a private key for your server:
     ```bash
     openssl genrsa -out private/server.key.pem 2048
     ```
   - Create a CSR for this server key:
     ```bash
     openssl req -config /etc/ssl/openssl.cnf -key private/server.key.pem -new -sha256 -out csr/server.csr.pem
     ```

7. **Sign the Server Certificate**
   - Sign the server's CSR with your CA:
     ```bash
     openssl ca -config /etc/ssl/openssl.cnf -extensions server_cert -days 365 -notext -md sha256 -in csr/server.csr.pem -out certs/server.cert.pem
     ```

8. **Verify Server Certificate**
   - Check the server certificate:
     ```bash
     openssl x509 -noout -text -in certs/server.cert.pem
     ```

9. **Distribute Certificates**
   - Distribute `ca.cert.pem` to clients for trust.
   - Distribute `server.cert.pem` and `server.key.pem` to the server.

10. **Optional: Add CA to Trust Store**
    - On the client machines, import `ca.cert.pem` into the trusted certificate store to avoid security warnings.

## Note:
- Use this in a controlled environment as self-signed certificates are not trusted by default in public contexts.
- Always secure the CA's private key (`ca.key.pem`) as it can sign certificates for any domain.






  129  openssl ca -config /etc/ssl/openssl.cnf -sha256 -in server.csr
  130  openssl ca -config /etc/ssl/openssl.cnf -in server.csr
  131  vim /etc/ssl/openssl.cnf
  132  openssl ca -config /etc/ssl/openssl.cnf -in server.csr
  133  ls /etc/ssl
  134  file /etc/ssl/*
  135  openssl ca -config /etc/ssl/openssl.cnf -in server.csr
  136  cd /etc/ssl
  137  ls
  138  openssl rsa -in ca.key -text -noout
  139  ls
  140  openssl x509 -in ca.crt -text -noout
  141  openssl x509 -noout -modulus -in ca.crt
  142  openssl rsa -noout -modulus -in ca.key
  143  ls -la
  144  cd ~
  145  openssl ca -config /etc/ssl/openssl.cnf -days 365 -notext -md sha256 -in server.csr -out server.crt -extensions v3_req
  146  vim /etc/ssl/openssl.cnf
  147  openssl ca -config /etc/ssl/openssl.cnf -days 365 -notext -md sha256 -in server.csr -out server.crt -extensions v3_req
  148  openssl ca -config /etc/ssl/openssl.cnf -days 365 -notext -md sha256 -in server.csr -out server.crt
  149  ls /etc/ssl
  150  touch /etc/ssl/serial.txt
  151  openssl ca -config /etc/ssl/openssl.cnf -days 365 -notext -md sha256 -in server.csr -out server.crt
  152  echo 01 >> /etc/ssl/serial.txt
  153  openssl ca -config /etc/ssl/openssl.cnf -days 365 -notext -md sha256 -in server.csr -out server.crt
  154  cd /etc/ssl
  155  ls
  156  ls new/
  157  openssl x509 -in new/01.pem
  158  openssl x509 -in new/01.pem  -text -noout
  159  history


root@9a96d26f5e13:/etc/ssl# file *
bk.cnf:         ASCII text
ca.crt:         PEM certificate
ca.key:         PEM RSA private key
certs:          directory
crl:            directory
crlnumber:      ASCII text
index.txt:      ASCII text
index.txt.attr: ASCII text
index.txt.old:  empty
new:            directory
openssl.cnf:    ASCII text
private:        directory
serial.txt:     ASCII text
serial.txt.old: ASCII text
root@9a96d26f5e13:/etc/ssl# ^C
root@9a96d26f5e13:/etc/ssl# cd ~
root@9a96d26f5e13:~# openssl ca -config /etc/ssl/openssl.cnf -revoke se
rver.crt
Using configuration from /etc/ssl/openssl.cnf
Revoking Certificate 01.
Data Base Updated
root@9a96d26f5e13:~# openssl ca -config /etc/ssl/openssl.cnf -revoke server.crt  -crl_reason keyCompromise
Using configuration from /etc/ssl/openssl.cnf
ERROR:Already revoked, serial number 01
root@9a96d26f5e13:~# openssl ca -config /etc/ssl/openssl.cnf -gencrl -o
ut /etc/ssl/ca.
ca.crt  ca.key
root@9a96d26f5e13:~# openssl ca -config /etc/ssl/openssl.cnf -gencrl -out /etc/ssl/ca.
ca.crt  ca.key
root@9a96d26f5e13:~# openssl ca -config /etc/ssl/openssl.cnf -gencrl -out /etc/ssl/crl
crl/       crlnumber
root@9a96d26f5e13:~# openssl ca -config /etc/ssl/openssl.cnf -gencrl -out /etc/ssl/ca.crl
Using configuration from /etc/ssl/openssl.cnf
root@9a96d26f5e13:~# ls
openssl-1.1.1t         server.crt  server.key
openssl-1.1.1t.tar.gz  server.csr
root@9a96d26f5e13:~# ls^C
root@9a96d26f5e13:~# !cd
cd ~
root@9a96d26f5e13:~# cd /etc/ssl
root@9a96d26f5e13:/etc/ssl# ls
bk.cnf  certs      index.txt.attr      openssl.cnf
ca.crl  crl        index.txt.attr.old  private
ca.crt  crlnumber  index.txt.old       serial.txt
ca.key  index.txt  new                 serial.txt.old
root@9a96d26f5e13:/etc/ssl# file ca.cr
ca.cr: cannot open `ca.cr' (No such file or directory)
root@9a96d26f5e13:/etc/ssl# file ca.crl
ca.crl: ASCII text
root@9a96d26f5e13:/etc/ssl# cat ca.crl
-----BEGIN X509 CRL-----
MIIBqjCBkzANBgkqhkiG9w0BAQQFADBOMQswCQYDVQQGEwJJTDELMAkGA1UECAwC
TlMxEjAQBgNVBAcMCUtlbnR2aWxsZTEMMAoGA1UECgwDT0RJMRAwDgYDVQQDDAdD
QSAxNTU0Fw0yNDEyMTEwNTQwMTZaFw0yNTAxMTAwNTQwMTZaMBQwEgIBARcNMjQx
MjExMDUzOTIzWjANBgkqhkiG9w0BAQQFAAOCAQEADnT/0DUPgY7WWdudkmZTeAPR
m0+wN6CcFjGfbX1/23H9R1k1AfFh9HlO3mOHKvbWmdMhZmj8MxjmK4czHOHoRZIA
0+vy+DocMFhmwhWAlr+fmDwjkQPF86zyebVrVB3nK5ET1uSO6AJ7J76i3Dflq+7m
Ch6EDz5I7qe9JcB6edfg7XvEvP2u55mC/N5kRUk9q7/o6BOF5Qy+mtTJfuXgV2Kt
HYkP7/0qFN/yM51yiBQV5xCfPwu29qogvR4pBQgh3hfmuLBBeTe5dposqNl1CQGV
1dxRAGPlCLGM5P/Yqcg++KmdEUr08SDt0jVXnGlkHu2TRYIgnjqr1om/IlKXhA==
-----END X509 CRL-----
root@9a96d26f5e13:/etc/ssl# ^C
root@9a96d26f5e13:/etc/ssl# cat crlnumber
01
root@9a96d26f5e13:/etc/ssl# cat serial.txt
02
root@9a96d26f5e13:/etc/ssl# cat index.txt
R       251211053643Z   241211053923Z   01      unknown /C=IL/ST=NS/L=Kentville/O=ODI/CN=blog.odinet.sh
180  nginx -r
  181  nginx --help
  182  nginx -help
  183  nginx
  184  pkill nginx
  185  nginx
  186  tail -f /var/log/nginx/access.log
  187  curl localhost
  188  curl localhost/crl
  189  curl localhost/crl/ca.crl
  190  curl http://localhost/crl/ca.crl
  191  curl http://crtl.odinet.sh/crl/ca.crl
  192  vim /etc/hosts
  193  curl http://crtl.odinet.sh/crl/ca.crl
  194  curl http://crl.odinet.sh/crl/ca.crl
  195  vim /etc/hosts
  196  curl http://crl.odinet.sh/crl/ca.crl
  197  cat /etc/nginx/sites-available/crl.conf
  198  cat /etc/nginx/nginx.conf
  199  vim/etc/nginx/nginx.conf
  200  vim /etc/nginx/nginx.conf
  201  cd /etc/nginx/
  202  ls
  203  cd sites-enabled/
  204  ls
  205  man ln
  206  ln --help
  207  ln --help
  208  ln -s ../sites-available/crl.conf crl.conf
  209  ls -la
  210  pkill nginx
  211  nginx
  212  vim ../sites-available/crl.conf
  213  pkill nginx
  214  nginx
  215  curl http://crl.odinet.sh/crl/ca.crl
  216  clear
  217  ls
  218  cat crl.conf
  219  ls
  220  cat ../nginx.conf
  221  ls
  222  vim https.conf
  223  pkill nginx; nginx
  224  curl https://crl.odinet.sh
  225  cd ..
  226  vim nginx.conf
  227  openssl x509 -in /etc/ssl/ca.crt -text -noout
  228  vim https.conf
  229  vim nginx.conf
  230  pkill nginx; nginx
  231  curl https://crl.odinet.sh
  232  cat /etc/hosts
  233  vim sites-enabled/https.conf
  234  pkill nginx; nginx
  235  curl https://crl.odinet.sh
  236  curl -v https://crl.odinet.sh
  237  vim nginx.conf
  238  pkill nginx; nginx
  239  curl -v https://crl.odinet.sh
  240  curl --CAFile /etc/ssl/ca.crt https://crl.odinet.sh
  241  curl --ca /etc/ssl/ca.crt https://crl.odinet.sh
  242  curl --help | less
  243* /c
  244  curl --help | grep ca
  245  curl --cacert /etc/ssl/ca.crt https://crl.odinet.sh
  246  curl -v --cacert /etc/ssl/ca.crt https://crl.odinet.sh
  247  vim nginx.conf
  248  pkill nginx; nginx
  249  curl -v --cacert /etc/ssl/ca.crt https://crl.odinet.sh
  250  vim sites-enabled/https.conf
  251  pkill nginx; nginx
  252  curl --tlsv1.2-v --cacert /etc/ssl/ca.crt https://crl.odinet.sh
  253  curl --tlsv1.2 -v --cacert /etc/ssl/ca.crt https://crl.odinet.sh
  254  cat /etc/ssl/openssl.cnf
  255  history
