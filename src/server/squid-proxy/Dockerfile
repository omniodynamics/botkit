# Use an image that has development tools needed for compilation
FROM ubuntu:20.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install necessary dependencies
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    libssl-dev \
    libcap2-bin \
    openssl \
    libdb5.3-dev \
    libldap2-dev \
    libsasl2-dev \
    libxml2-dev \
    libpam0g-dev \
    libkrb5-dev \
    autoconf \
    automake \
    libtool \
    && rm -rf /var/lib/apt/lists/*

# Create squid user and group
RUN groupadd -r squid && useradd -r -g squid squid

# Clone Squid repository
# Note: Replace 'v5' with the latest version you want to use, check Squid's GitHub for the latest tag
ARG SQUID_VERSION="v5"
RUN git clone --depth 1 --branch ${SQUID_VERSION} https://github.com/squid-cache/squid.git /usr/src/squid

WORKDIR /usr/src/squid

# Configure Squid with necessary options for SSL bumping
RUN ./bootstrap.sh && \
    ./configure \
        --prefix=/usr \
        --sysconfdir=/etc/squid \
        --localstatedir=/var \
        --datadir=/usr/share/squid \
        --libexecdir=/usr/lib/squid \
        --with-logdir=/var/log/squid \
        --with-pidfile=/var/run/squid.pid \
        --enable-ssl \
        --enable-ssl-crtd \
        --with-openssl \
        --enable-linux-netfilter \
        --enable-auth \
        --enable-basic-auth-helpers="DB,LDAP,NCSA,PAM,POP3,RADIUS,SASL,SMB" \
        --enable-ntlm-auth-helpers="smb_lm" \
        --enable-digest-auth-helpers="ldap" \
        --enable-negotiate-auth-helpers="kerberos" \
        --enable-external-acl-helpers="file_userip,unix_group,wbinfo_group" \
        --enable-cache-digests \
        --enable-follow-x-forwarded-for \
        --enable-icap-client \
        --enable-esi \
        --enable-storeio="ufs,aufs,diskd,rock" \
        --enable-delay-pools \
        --enable-log-daemon-helpers="DB,file" \
        --disable-arch-native \
        --enable-removal-policies="lru,heap" \
        --with-large-files \
    && make -j$(nproc) \
    && make install

# Attempt to find SSL CRTD after installation, but continue if not found
RUN find /usr -name ssl_crtd -type f -print | head -n 1 > /tmp/ssl_crtd_path \
    && if [ -s /tmp/ssl_crtd_path ]; then \
         SSL_CRTD_PATH=$(cat /tmp/ssl_crtd_path); \
         echo "SSL CRTD Path: $SSL_CRTD_PATH"; \
         $SSL_CRTD_PATH -c -s /var/lib/squid/ssl_db -M 4MB || echo "Failed to initialize SSL DB"; \
       else \
         echo "ssl_crtd not found, SSL bumping might not work"; \
       fi

# Ensure directories exist and set up permissions
RUN mkdir -p /var/cache/squid /var/log/squid /etc/squid/ssl_cert /var/lib/squid/ssl_db \
    && chown -R squid:squid /var/cache/squid /var/log/squid /etc/squid/ssl_cert /var/lib/squid/ssl_db

# Copy a simple squid.conf for testing (you'll want to customize this)
COPY squid.conf /etc/squid/squid.conf

# Expose the default Squid port
EXPOSE 3128

# Start Squid when the container launches
CMD ["squid", "-NYCd", "1"]