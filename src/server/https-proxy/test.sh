
  525  certutil -addstore "CA" certs/ca-certificate.pem 
  526  certutil -addstore "Root" certs/ca-certificate.pem 
  527  certutil -addstore "Root" ca-certificate.pem 
  528  certutil -addstore "CA" ca-certificate.pem 
  529  curl --proxytunnel --proxy https://localhost:8443 https://localhost:8443
  530  curl -v --proxytunnel --proxy https://localhost:8443 https://localhost:8443
  531  curl -vvvv --proxytunnel --proxy https://localhost:8443 https://localhost:8443
  532  curl -vvvv --proxytunnel --proxy https://localhost:8443 https://google.com
  533  curl -L -vvvv --proxytunnel --proxy https://localhost:8443 https://google.com
  534  curl -L -vvvv --proxytunnel --proxy https://localhost:8443 https://example.com

curl -L -vvvv --proxytunnel --proxy https://localhost:8443 https://example.com
  
