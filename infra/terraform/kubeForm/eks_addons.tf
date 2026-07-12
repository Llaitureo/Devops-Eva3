resource "aws_eks_addon" "cloudwatch_observability" {
  cluster_name             = aws_eks_cluster.eks.name
  addon_name               = "amazon-cloudwatch-observability"

  service_account_role_arn = data.aws_iam_role.labrole.arn

  depends_on = [
    aws_eks_cluster.eks,
    aws_eks_node_group.workers
  ]
}