# Terraform block to specify the required providers
terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

# Provider configuration (in this case, we don't need to configure anything for the null provider)
provider "null" {}

# Dummy resource using null_resource
resource "null_resource" "example" {
  # This will run a local command when the resource is created or updated
  provisioner "local-exec" {
    command = "echo 'Hello, Terraform!'"
  }

  # This will run a local command when the resource is destroyed
  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Destroying the example resource!'"
  }

  # Triggers can be used to force re-creation or updates of this resource
  triggers = {
    always_run = "${timestamp()}"
  }
}