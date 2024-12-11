FROM base-container AS base
FROM debian:buster-slim

RUN adduser --system --no-create-home \
    --disabled-password --shell /bin/false \
    --group nginx
    
COPY --from=base /certs /certs
COPY --from=base /certs/ca/ca.crt /usr/share/ca-certificates/ca.crt
COPY --from=base /certs/server.crt /etc/ssl/certs/
COPY --from=base /certs/server.key /etc/ssl/private/
COPY nginx.conf /etc/nginx/nginx.conf

RUN apt-get update && apt-get install -y ca-certificates
RUN echo "ca.crt" >> /etc/ca-certificates.conf
RUN update-ca-certificates 
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
