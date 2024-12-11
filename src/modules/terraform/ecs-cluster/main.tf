# Configure the AWS Provider
provider "aws" {
  region = "us-west-2" # Change this to your preferred AWS region
}

# Create an ECS cluster
resource "aws_ecs_cluster" "hello_world_cluster" {
  name = "hello-world-cluster"
}

# Create a VPC for our ECS service (you might already have one)
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Create subnets
resource "aws_subnet" "main" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index}.0/24"
  availability_zone = "us-west-2${count.index == 0 ? "a" : "b"}"
}

# Create an Internet Gateway for the VPC
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

# Route table for public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

# Associate the route table with the subnets
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.main[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security group for our ECS tasks
resource "aws_security_group" "ecs_tasks" {
  name        = "ecs-tasks-security-group"
  description = "Allow inbound access for ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Task Execution Role for ECS
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the AmazonECSTaskExecutionRolePolicy to the role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task Definition
resource "aws_ecs_task_definition" "hello_world_task" {
  family                   = "hello-world-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "hello-world-container"
      image = "hello-world"
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "hello_world_service" {
  name            = "hello-world-service"
  cluster         = aws_ecs_cluster.hello_world_cluster.id
  task_definition = aws_ecs_task_definition.hello_world_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.main[*].id
    security_groups = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }
}