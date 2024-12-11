#!/bin/bash

# Update package lists
 apt-get update

apt-get install -y sudo openssl procps vim curl gnutls-bin ca-certficate

# Install Netcat utilities
 apt-get install -y netcat-traditional netcat-openbsd

# Install dig utility
 apt-get install -y dnsutils

# Install Python3 and pip
 apt-get install -y python3 python3-pip

# Install Node.js
apt-get install -y nodejs

# Install Go (Golang)
wget -qO- https://go.dev/dl/go1.22.4.linux-amd64.tar.gz |  tar -C /usr/local -xz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc
source ~/.bashrc

# Install Ansible, Ansible Vault
 apt-add-repository -y ppa:ansible/ansible
 apt-get update
 apt-get install -y ansible

# Install npm (comes with Node.js)
 apt-get install -y npm

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
 ./aws/install
rm awscliv2.zip

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
 install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install kubeadm
 apt-get install -y apt-transport-https ca-certificates curl
 curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" |  tee /etc/apt/sources.list.d/kubernetes.list
 apt-get update
 apt-get install -y kubelet kubeadm kubectl
 apt-mark hold kubelet kubeadm kubectl

# Install Google Cloud CLI (gcloud)
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" |  tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg |  apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
 apt-get update &&  apt-get install -y google-cloud-cli

# Clean up
 apt-get clean
 rm -rf /var/lib/apt/lists/*

echo "Installation of utilities completed."
