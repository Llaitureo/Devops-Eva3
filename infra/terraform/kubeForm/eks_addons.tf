resource "aws_eks_addon" "cloudwatch_observability" {
  cluster_name             = "innovatech-cluster"
  addon_name               = "amazon-cloudwatch-observability"

  service_account_role_arn = data.aws_iam_role.labrole.arn
}