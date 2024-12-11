/**
 * Virtual Private CLOUDs are virtual.
 * They can have gateways.
 * VPCs have ACLs which are associated with it's subnets.
 * VPCs have firewalls (ACLs + Security Groups).
 * SGs operate at the VPC level.
 * Routers are associated with subnets.
 * Route tables can propogate their routes to peer'd networks (???).
 **/

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "vpc" {
  cidr_block           = var.cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
}


resource "aws_subnet" "public_subnets" {
  count                   = length(data.aws_availability_zones.available.names)
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.subnets.public.cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}


resource "aws_subnet" "private_subnets" {
  count             = length(data.aws_availability_zones.available.names)
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.subnets.private.cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
}


