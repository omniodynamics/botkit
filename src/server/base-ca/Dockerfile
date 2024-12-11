FROM base-container:latest

ENV CA_CONF=/etc/ssl/openssl.cnf
ENV CA_COUNTRY=CA
ENV CA_STATE=NS
ENV CA_LOCALITY=Kentville
ENV CA_ORG=ODI
ENV CA_CN=odinet.sh
ENV CA_SUBJ="/C=$CA_COUNTRY/ST=$CA_STATE/L=$CA_LOCALITY/O=$CA_ORG/CN=$CA_CN"

RUN mkdir /usr/local/bin
RUN mkdir /etc/ssl/crl

COPY /etc/ssl/openssl.cnf /etc/ssl/openssl.cnf
COPY app/funcs.bash /app/funcs.sh
COPY files/etc/nginx/sites-available/crl.conf /etc/nginx/sites-available/crl.conf
COPY files/etc/nginx/sites-available/https.conf /etc/nginx/sites-available/https.conf

RUN ln -s /etc/nginx/sites-available/https.conf /etc/nginx/sites-enabled/https.conf
RUN ln -s /etc/nginx/sites-available/crl.conf /etc/nginx/sites-enabled/crl.conf

WORKDIR /etc/ssl
RUN openssl genrsa -out ca.key 2048
RUN openssl req -key ca.key -new -x509 -days 3650 -sha256 -extensions v3_ca -out ca.crt -subj="${CA_SUBJ}"

RUN echo "01" > crlnumber
RUN touch index.txt
RUN touch serial.txt

CMD ["/bin/bash"]