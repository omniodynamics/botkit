resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
  }
}




resource "aws_eip" "nat_eip" {
  count = length(data.aws_availability_zones.available.names)
  domain = "vpc"
}

resource "aws_nat_gateway" "nat_gtw" {
  count         = length(data.aws_availability_zones.available.names)
  allocation_id = aws_eip.nat_eip[count.index].id
  subnet_id     = aws_subnet.private_subnets[count.index].id
}