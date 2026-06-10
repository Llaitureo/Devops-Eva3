output "cluster_name" {
  value = aws_eks_cluster.eks.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.eks.endpoint
}

output "back_ecr_url" {
  value = aws_ecr_repository.backend_Ventas_repo.repository_url
}

output "despacho_ecr_url" {
  value = aws_ecr_repository.backend_Despachos_repo.repository_url
}

output "front_ecr_url" {
  value = aws_ecr_repository.frontend_Despacho_repo.repository_url
}