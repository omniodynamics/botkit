// Access Control Lists (subnet scope)
// Security Groups      (vpc scope)



resource "aws_network_acl" "acl" {
  vpc_id = aws_vpc.vpc.id
  subnet_ids = concat(
    aws_subnet.public_subnets.*.id,
    aws_subnet.private_subnets.*.id
  )

}

resource "aws_network_acl_rule" "allow_inbound" {
  network_acl_id = aws_network_acl.acl.id
  rule_number    = 100
  egress         = false
  protocol       = "-1"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 0
  to_port        = 65535
}

# For outbound traffic from 64.66.210.14, you'd need to set egress to true and adjust the source to the VPC's CIDR
resource "aws_network_acl_rule" "allow_outbound" {
  network_acl_id = aws_network_acl.acl.id
  rule_number    = 100
  egress         = true
  protocol       = "-1"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 0
  to_port        = 65535
}



# resource "aws_security_group" "allow" {
#   name        = "allow"
#   description = "Default allow ingress/egres"
#   vpc_id      = aws_vpc.vpc.id

#   ingress {
#     description = "From anywhere"
#     from_port   = 0
#     to_port     = 0
#     protocol    = -1
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

resource "aws_security_group" "allow" {
  name        = "allow"
  description = "Default allow ingress/egres"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    description = "From anywhere"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["64.66.211.99/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}