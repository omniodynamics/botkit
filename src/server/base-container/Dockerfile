FROM debian:buster-slim

RUN apt-get update && \
    apt-get install -y build-essential ca-certificates \
    openssl curl wget bash procps vim iproute2 net-tools

RUN apt-get install -y python3 python3-pip \
    nodejs rustc openssh-server nginx