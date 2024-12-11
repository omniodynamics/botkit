# Virtual Private Cloud

A VPC is a `network` that contains resources controllable via a *Cloud Vendor API*.

- Isolated: Mine!
- Resources: Things w. Behaviors.
- IAM: Controls, Security.
- Plumbing: Gateways, Routing, Firewalls, IAM.

So, we include the AWS resources to support the above.

1. Public & Private IAM Controls.
2. Gateways.
3. Network Glue: Route Tables, Firewalls (ACLs, SGs).

We don't include,

1. Compute
2. Files
3. Secrets

Possibly a "ceremony" or "ritual" Terraform module that most people create just to exercise their AWS knowledge / concepts.
