variable "domain" { type = string }
variable "name" { type = string }
variable "region" { type = string }
variable "cidr" { type = string }
variable "subnets" { 
    type = object({

                public = object({
                    cidrs = list(string)
                })
                private = object({
                    cidrs = list(string)
                })

    })
}