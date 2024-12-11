# Configure the AWS Provider
provider "aws" {
  region = "us-west-2" # Adjust to your preferred region
}

# IAM Role for Step Functions to execute Lambda functions
resource "aws_iam_role" "step_function_role" {
  name = "step-function-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })
}

# Attach policy to allow Step Functions to invoke Lambda
resource "aws_iam_role_policy" "lambda_invoke_policy" {
  name = "lambda_invoke_policy"
  role = aws_iam_role.step_function_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "lambda:InvokeFunction"
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Lambda function 1 - First step
resource "aws_lambda_function" "lambda_one" {
  filename      = "lambda_function_payload.zip"
  function_name = "lambdaOne"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.8"
  # Source code hash is used to detect changes in the function code
  source_code_hash = filebase64sha256("lambda_function_payload.zip")
}

# Lambda function 2 - Second step
resource "aws_lambda_function" "lambda_two" {
  filename      = "lambda_function_payload.zip"
  function_name = "lambdaTwo"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.8"
  source_code_hash = filebase64sha256("lambda_function_payload.zip")
}

# IAM Role for Lambda execution
resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Step Functions State Machine
resource "aws_sfn_state_machine" "state_machine" {
  name     = "MyStepFunction"
  role_arn = aws_iam_role.step_function_role.arn

  definition = <<EOF
{
  "Comment": "A simple step function that executes two lambdas in sequence",
  "StartAt": "LambdaOne",
  "States": {
    "LambdaOne": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.lambda_one.arn}",
      "Next": "LambdaTwo"
    },
    "LambdaTwo": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.lambda_two.arn}",
      "End": true
    }
  }
}
EOF
}