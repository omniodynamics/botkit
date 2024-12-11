# Configure the AWS Provider
provider "aws" {
  region = "us-west-2" # or your desired region
}

# IAM Users
resource "aws_iam_user" "users" {
  for_each = toset([
    "john.smith",   # IT
    "alice.johnson", # HR
    "bob.miller",   # Finance
    "emma.white",   # Marketing
    "daniel.lee",   # Development
    "sophia.brown"  # Operations
  ])
  name = each.value
}

# IAM Groups
resource "aws_iam_group" "groups" {
  for_each = toset(["IT", "HR", "Finance", "Marketing", "Development", "Operations"])
  name     = each.value
}

# Add users to groups
resource "aws_iam_group_membership" "group_membership" {
  for_each = {
    IT         = ["john.smith"]
    HR         = ["alice.johnson"]
    Finance    = ["bob.miller"]
    Marketing  = ["emma.white"]
    Development = ["daniel.lee"]
    Operations = ["sophia.brown"]
  }

  name  = each.key
  users = each.value
  group = each.key
}

# Developer Role and Policy
resource "aws_iam_policy" "developer_policy" {
  name        = "DeveloperAccessPolicy"
  description = "Policy for developers to access CloudTrail and EKS logs"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "cloudtrail:LookupEvents",
          "eks:ListClusters",
          "eks:DescribeCluster",
          "eks:ListNodegroups",
          "eks:DescribeNodegroup",
          "eks:ListFargateProfiles",
          "eks:DescribeFargateProfile",
          "logs:DescribeLogGroups",
          "logs:GetLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role" "developer_role" {
  name = "DeveloperRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "developer_role_policy_attach" {
  role       = aws_iam_role.developer_role.name
  policy_arn = aws_iam_policy.developer_policy.arn
}

# Account Admin Role and Policy
resource "aws_iam_policy" "account_admin_policy" {
  name        = "AccountAdminPolicy"
  description = "Policy for admins to view budget"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["budgets:ViewBudget"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role" "account_admin_role" {
  name = "AccountAdminRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "account_admin_role_policy_attach" {
  role       = aws_iam_role.account_admin_role.name
  policy_arn = aws_iam_policy.account_admin_policy.arn
}

# Attach Developer Role to Development Group
resource "aws_iam_group_policy_attachment" "developer_group_policy_attach" {
  group      = aws_iam_group.groups["Development"].name
  policy_arn = aws_iam_role.developer_role.arn
}

# Attach Account Admin Role to Finance User (assuming Finance user is an admin)
resource "aws_iam_user_policy_attachment" "account_admin_user_policy_attach" {
  user       = aws_iam_user.users["bob.miller"].name
  policy_arn = aws_iam_role.account_admin_role.arn
}