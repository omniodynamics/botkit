# data "tls_certificate" "eks_cluster_cert" {
#     url = aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer
# }

# # data "aws_iam_openid_connect_provider" "existing" {
# #   for_each = toset(aws_eks_cluster.eks_cluster[*].identity[*].oidc[*].issuer)
# #   url = each.value
# # }

# output "existing_oidc_providers" {
#   value = aws_eks_cluster.eks_cluster.identity[0]
# }