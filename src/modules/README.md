# Omnio Dynamics Incorporated (ODI)

This is a repo for me to work on IaC and service ideas.

## Goals
### 2024-Q4+

1. Kubernetes
2. AWS: Solidify Knowledge, Intermediate EKS
3. Typescript (My Preferred DevOps Language)
4. ExpressJS (My API Development)
5. Prometheus & Grafana: Monitoring Stack, Non-Commerical Choice
6. DNS
7. Scaling & DR
8. Terraform: IaC
9. CICD: Pick CICD System (GitOps?)
10. CM: (Ansible?)
11. CLI Glue: (Makefile?)
12. CanadaBuy's Feedback Loop

### 2025-Q2+

1. ML Python Basics: Nuts & Bolts
2. Projects & Services: Brainstorm
3. 

### 2025-QX+

1. ML Generative Development, Cost, Requirements
2. Projects & Services:  1-3 Services Hosted
3. GCP, Azure, ...
4. CDKTF: Cloud Vendor Decoupling Protoyping, Refactor Omnio AWS GCP

## Log
### November 27, 2024

Worked on,

1. SCM Repo Setup
2. VPC & Consulting NodeJS R&D App Dev
3. Typescript Media Lib Dev
4. Networking Concepts Research (VPC, SSO, OAuth 2.0, OIDC)
5. Tested some DR with "stock" AWS
6. NGINX Resarch: Configuration, Using
7. K8s Research: Ingress & Bootstrapping
8. K8s Research: Monitoring
9. Terraform Research: Functions
10. Typescript Research: Language

Thoughts,

1. I don't miss `terragrunt` at all.  CloudFormation is fugly.
2. `tf` files are faster to work with than `CDKTF`.
3. VPC vs network vs cluster ...
4. "Ritual, ceremony code" is useful for **learning**.  Clean it later, but enjoy the exploration.
5. EKS service of type `LoadBalancer`; creates an LB.  Didn't realize that.  Likely a basic detail more experienced `K8s` folk know.
6. SGs are stateful.  If you don't explicitly add SG egress for destination targets, if an ingress allowed the traffic, then egress is automatic. **CONFIRM???**
7. Javascript async is unpleasant to develop in.  Nodejs apps are incredibly useful however; faster to develop than python.
8. Would be nice to play around with incorporating mock's of Fortinet like security

Next?

1. AWS VPNs. 
2. GoDaddy DNS...
3. IPIFY Clone
4. Media FS Typescript Model
5. Access Controls Exploration
6. EKS Cluster Terraform Module Development
7. Add `vpc` TF design / layout README.
8. Add `iac` "state" README.
9. Add `cluster` README.

## Projects & Services

1. ODI Corporate Services Support: PM, CICD Support Services
2. ODI Product R&D: GovTrack, AucBid, Botkit (Core, Cognition), GovInfra & Frameworks Research
3. ODI Employee Training: Enterprise Services Market Rsearch
4. ODI Business Development: Government Tendering System Feedback
5. ODI Training Guides: DevOps, SRE, ...


