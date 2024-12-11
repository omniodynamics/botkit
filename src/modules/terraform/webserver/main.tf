locals { 
  key_exists = fileexists(pathexpand("~/.ssh/ec2-ssh-key.pem")) 
}

output "debug" {
  value = [
    local.key_exists
  ]
}


resource "aws_key_pair" "ec2_ssh_key" {
  key_name   = "ec2-ssh-key"
  public_key = tls_private_key.ec2_key.public_key_openssh
}

resource "tls_private_key" "ec2_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key" {
  content         = tls_private_key.ec2_key.private_key_pem
  filename        = pathexpand("~/.ssh/ec2-ssh-key.pem")
  file_permission = "600"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "nginx_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro" # Free-tier eligible
  subnet_id     = var.subnet_id
  key_name      = aws_key_pair.ec2_ssh_key.key_name
  vpc_security_group_ids = [var.allow_sg_id]

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nginx
              systemctl start nginx
              systemctl enable nginx
              apt-get install -y nodejs npm
              npm install -g express
              EOF



  connection {
    type        = "ssh"
    user        = "ubuntu"  # or "ubuntu" if using Ubuntu AMI
    private_key = file("~/.ssh/ec2-ssh-key.pem")
    host        = self.public_ip    
    agent       = false
    agent_identity = "none"

  }

  provisioner "file" {
    source      = "../../../apps/botkit.run/botkit.service"  
    destination = "/home/ubuntu/botkit.service"  
  }


}

output "instance_public_ip" {
  value = aws_instance.nginx_server.public_ip
}