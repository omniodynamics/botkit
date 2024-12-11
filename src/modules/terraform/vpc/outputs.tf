output "public_subnets" {
    value = aws_subnet.public_subnets
}

output "private_subnets" {
    value= aws_subnet.private_subnets
}

output "vpc_id" {
    value = aws_vpc.vpc.id
}

output "aws_security_group_allow" {
    value = aws_security_group.allow
}
