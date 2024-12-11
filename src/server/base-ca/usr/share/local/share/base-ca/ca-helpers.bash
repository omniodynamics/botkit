#!/bin/bash

# TODO: REMOVE -nodes AND ENABLE ENCRYPTION!

# export CA_CONF=/etc/ssl/openssl.cnf
# export CA_CONF_PATH=/etc/ssl
# export CA_COUNTRY=${CA_COUNTRY:-CA}
# export CA_STATE=${CA_STATE:-NS}
# export CA_LOCALITY=${CA_LOCALITY:-Kentville}
# export CA_ORG=${CA_ORG:-ODI}
# export CA_CN="CA ${RANDOM}"
# export CA_SUBJ="/C=$CA_COUNTRY/ST=$CA_STATE/L=$CA_LOCALITY/O=$CA_ORG/CN=$CA_CN"

function main() {
    
    cd ${CA_CONF_PATH}

    # Generate the key.
    openssl genrsa -out ca.key 2048

    # Generate the self-signed cert (in one step).
    openssl req -key ca.key -new -x509 -days 3650 -sha256 -extensions v3_ca -out ca.crt -subj="${CA_SUBJ}"


    echo "01" > crlnumber
    touch index.txt

}
