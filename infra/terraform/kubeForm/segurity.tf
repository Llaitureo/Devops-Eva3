
resource "aws_security_group_rule" "sg_frontend_nodeport" {
  type              = "ingress"
  from_port         = 30080
  to_port           = 30080
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"] 
  security_group_id = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
}

resource "aws_security_group_rule" "sg_backend_ventas" {
  type              = "ingress"
  from_port         = 8081
  to_port           = 8081
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr]
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
