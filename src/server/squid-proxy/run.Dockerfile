# Use an official Ubuntu image as the base for Squid
FROM ubuntu:22.04

# Install Squid and necessary tools
RUN apt-get update && \
    apt-get install -y squid openssl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create directories for Squid configuration and SSL
RUN mkdir -p /etc/squid/ssl_cert && \
    mkdir -p /var/spool/squid

# Generate a self-signed CA certificate for MITM
RUN openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 \
    -subj "/C=US/ST=State/L=Locality/O=Org/CN=MITM CA" \
    -keyout /etc/squid/ssl_cert/myCA.pem \
    -out /etc/squid/ssl_cert/myCA.pem

# Copy custom Squid configuration
COPY squid.conf /etc/squid/squid.conf

# Ensure Squid has the correct permissions
RUN chown -R proxy:proxy /var/spool/squid && \
    chmod -R 755 /var/spool/squid && \
    chown -R proxy:proxy /etc/squid/ssl_cert && \
    chmod -R 700 /etc/squid/ssl_cert

# Expose the Squid port
EXPOSE 3128

# Start Squid with the custom configuration
CMD ["squid", "-f", "/etc/squid/squid.conf", "-NYCd", "1"]

# Health check to verify Squid is running
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD squidclient -h localhost mgr:info | grep -q "Squid Object Cache"
