resource "aws_security_group_rule" "sg_frontend" {
  type              = "ingress"
  from_port         = 8083
  to_port           = 8083
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"] # Abierto a internet
  security_group_id = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
}

resource "aws_security_group_rule" "sg_frontend_nodeport" {
  type              = "ingress"
  from_port         = 30080
  to_port           = 30080
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"] 
  security_group_id = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
}

# Al ser ClusterIP, solo debe recibir tráfico desde dentro de la VPC.
resource "aws_security_group_rule" "sg_backend_ventas" {
  type              = "ingress"
  from_port         = 8081
  to_port           = 8081
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr] # Solo permite tráfico de red interna (10.0.0.0/16)
  security_group_id = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
}

resource "aws_security_group_rule" "sg_backend_despachos" {
  type              = "ingress"
  from_port         = 8082
  to_port           = 8082
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr]
  security_group_id = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
}

# PD: .cluster_security_group_id se genera automaticamente,
# ya que es parte de la creación del cluster.
# vpc_config[0] se refiere a la primera (y única) vpc_config.
