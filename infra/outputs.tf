output "ecr_frontend_url" {
  description = "URL del repositorio ECR para la imagen del Frontend"
  value       = aws_ecr_repository.frontend_repo.repository_url
}

output "ecr_ventas_url" {
  description = "URL del repositorio ECR para el microservicio de Ventas"
  value       = aws_ecr_repository.ventas_repo.repository_url
}

output "ecr_despachos_url" {
  description = "URL del repositorio ECR para el microservicio de Despachos"
  value       = aws_ecr_repository.despachos_repo.repository_url
}

# Output consolidado del Registry ID (Útil para el comando 'aws ecr get-login-password')
output "aws_account_registry_id" {
  description = "ID del Registro ECR (corresponde al AWS Account ID)"
  value       = aws_ecr_repository.frontend_repo.registry_id
}