# InnovaTech - Sistema de Gestión de Ventas y Despachos 🚀

InnovaTech es una solución de software empresarial basada en una arquitectura de tres capas (**3-Tier Architecture**), diseñada para ser altamente escalable, segura y resiliente. El proyecto se encuentra completamente containerizado y se despliega de forma automatizada en **Amazon Web Services (AWS)** utilizando herramientas de Infraestructura como Código (IaC) y flujos avanzados de Integración y Despliegue Continuo (CI/CD).

---

## 🏗️ Arquitectura y Componentes del Sistema

El ecosistema de la aplicación se divide en componentes independientes distribuidos en sus respectivas capas tecnológicas:

### 📂 Infraestructura del proyecto **(v5.0)**

````text
PROYECTO SEMESTRAL/
├── back-Despachos_SpringBoot/
│   └── Springboot-API-REST-DESPACHO/
├── back-Ventas_SpringBoot/
│   └── Springboot-API-REST/
├── db/
│   └── init.sql
├── front_despacho/
│   └── nginx.conf
├── infra/
|   ├── k8s/
|   ├── terraform/
|   |   └── ec2Form/
|   |   └── kubeForm/
├── .env
├── .gitignore
└── docker-compose.yml
````

### 1. Formación General del Proyecto (Presentación y Entorno)
| Tipo | Nombre | Versión | Uso / Descripción |
|------|--------|---------|-------------------|
| Librería | React | 18.2.0 | Desarrollo de la interfaz de usuario (Frontend) reactiva y dinámica. |
| Herramienta | Node.js | 20 | Entorno de ejecución de desarrollo y construcción para el servicio web. |
| Servidor Web | Nginx | e.g. 1.25 unprivileged | Reverse Proxy encargado de recibir el tráfico web (Puerto `8083`) y redirigir las peticiones de la API. |
| Framework | SpringBoot | 3.4.4 | Núcleo base para la construcción del ecosistema de microservicios del Backend. |
| Herramienta | Java Maven | JDK 17 | Gestor de dependencias, automatización y empaquetado del código del Backend. |

### 2. Dependencias Críticas del Backend
| Nombre | Versión | Uso / Descripción |
|--------|---------|-------------------|
| Spring Web | Integrada | Regulador y controlador de puntos de acceso (Endpoints) para peticiones HTTP Rest. |
| Validation | Integrada | Construcción e implementación de reglas de validación en las entidades de negocio. |
| JPA | 3.4.3 | Abstracción de la capa de persistencia y mapeo objeto-relacional (ORM). |
| OpenApi | 2.7.0 | Documentación viva de las API REST, accesible mediante interfaces interactivas de Swagger UI. |
| Lombok | Integrada | Biblioteca encargada de optimizar el código eliminando constructores, getters y setters repetitivos. |
| MySql Driver | Integrada | Conector de base de datos específico para habilitar la comunicación con el motor MySQL. |
| Actuator | Integrada | Monitoreo operativo y supervisión del estado de salud de los servicios del backend. |

---

## ⚙️ Orquestación de Servicios (Docker Compose)

En la capa interna del servidor de aplicaciones, los servicios se gestionan de forma centralizada mediante un archivo de orquestación multibloque:

- **Motor de Datos (`mysql`):** Utiliza la imagen oficial de `mysql:8`. Cuenta con un mecanismo de *Healthcheck* nativo que ejecuta `mysqladmin ping` para garantizar que la base de datos se encuentre lista antes de aceptar conexiones externas.
- **Microservicio de Ventas (`backend-ventas`):** Corre en el puerto `8081`. Está configurado para iniciar única y exclusivamente cuando el contenedor de la base de datos se reporta como un servicio saludable (`service_healthy`). Su estado de salud se valida mediante consultas automatizadas a su interfaz de documentación de Swagger.
- **Microservicio de Despachos (`backend-despachos`):** Expuesto en el puerto `8082`. Posee un encadenamiento de dependencias secuencial estricto, requiriendo que tanto el servicio de `mysql` como el servicio de `backend-ventas` estén completamente saludables para asegurar la consistencia del flujo de negocio.

Todos los contenedores de la capa lógica se comunican de forma aislada a través de la red dedicada con driver bridge llamada `back-net`, manteniendo persistencia de la base de datos mediante el volumen lógico `mysql_data`.

---

## ☁️ Modo de Trabajo de la Infraestructura (AWS & Terraform)

- **Migración a Kubernetes:** Sustitución de Docker Compose por manifiestos declarativos de Kubernetes (`Deployments`, `Services`, `ConfigMaps` y `Secrets`).
- **Infraestructura Modular Multi-AZ:** Rediseño completo de la topología de red utilizando Terraform para implementar Alta Disponibilidad real distribuyendo cargas en múltiples zonas de disponibilidad (`us-east-1a` y `us-east-1b`).
- **Sincronización Asíncrona Nativa:** Reemplazo de las políticas `depends_on` mediante la implementación de `initContainers` en los Pods de Kubernetes.
- **Escalado Horizontal Automático (HPA):** Autoescalado dinámico configurado a través de métricas de CPU en tiempo real.
- **Gobernanza CI/CD Automatizada:** Integración total de GitOps mediante pipelines controlados en GitHub Actions asociados estrictamente a la rama `deploy`.

---

## 📐 Arquitectura de Infraestructura y Red

La topología de red fue calculada meticulosamente para soportar el crecimiento dinámico de los microservicios sin sufrir agotamiento de direccionamiento IP:

- **VPC Principal:** Direccionamiento base `10.0.0.0/16`.
- **Subredes Públicas (2x `/24`):** Ubicadas en zonas de disponibilidad redundantes, dedicadas de forma exclusiva al aprovisionamiento de los **AWS Classic Load Balancers (CLB)**.
- **Subredes Privadas (2x `/20`):** Bloques masivos que proveen hasta ~4,091 IPs usables por zona, diseñadas para mitigar la pre-asignación agresiva de IPs que realiza el driver *AWS VPC CNI* para los Pods del clúster.
- **Redundancia NAT:** Implementación de **dos NAT Gateways independientes** (uno por cada AZ). Si una zona de disponibilidad experimenta una falla total en los centros de datos de AWS, la zona secundaria mantiene salida autónoma a internet para los nodos de cómputo.
- **Cómputo Seguro:** Nodos trabajadores administrados utilizando instancias `t3.medium` ubicados estrictamente dentro del perímetro privado de la VPC.

---

## 🔄 Flujo de Automatización de CI/CD (GitHub Actions)

El ciclo de vida del código se encuentra completamente automatizado mediante un pipeline unificado que se activa ante eventos en ramas de integración:

```text
[Fase 1: Integración (Tests & Builds)] ──> [Fase 2: Registro (ECR)] ──> [Fase 3: Despliegue (EKS)]
```

El estado del despliegue y la salud del ciclo de integración se monitorean 
activamente a través de los logs de ejecución integrados en GitHub Actions, 
los cuales certifican la correcta compilación, empaquetado y entrega de cada 
microservicio en la nube. Así mismo, la infraestructura en AWS cuenta con 
soporte de Amazon CloudWatch, lo que permite realizar un seguimiento en 
tiempo real de las métricas de rendimiento (uso de CPU y memoria) en los 
nodos trabajadores del clúster EKS.

---

## ⚙️ Recomendaciones

El despliege continuo poseen **secrets**. Esto influye en como se escribe el código del manejo de las imágenes a AWS, por lo que hay que estar atento a las siguentes variables:

**CD**

Configuraciones para el proceso **terraform apply**

| Nombre secreto | Uso |
|----------------|-----|
| AWS_ACCESS_KEY_ID | Apunta a la cuenta en si. |
| AWS_SECRET_ACCESS_KEY | Contraseña de la cuenta. |
| AWS_SESSION_TOKEN | Token de paso para la cuenta. |
| AWS_REGION | Region en donde está parada la cuenta. |

Sin esto, el despliege continuo no será capaz de levantar el proyecto en AWS.

---

# Comandos para el Despliegue y funcionamiento óptimo

## 📐 Fase 0 -> **AWS CLI**

Aquí se listarán los comandos para configurar aws cli y a si mismo, terraform.

``aws configure`` -> este comando pedirá los datos de aws details. Estos deben coincidir con aws y los environment de Github secrets.

## ⚙️ Fase 1 -> **Terraform**

Aquí se listarán en orden los comandos necesarios para el Proceso de terraform:

1. ``cd infra/terraform/kubeForm`` -> ingresa a la carpeta a ejecutar (ec2Form para la **v1.0**).
2. ``terraform init`` -> inicia terraform según la versión planteada en main.tf
3. ``terraform plan`` -> (opcional) lista los objetos para aplicar en aws.
4. ``terraform apply`` -> Aplica el listado de objetos.

## ☁️ Fase 2 -> **Kubectl**

Algunos de estos comandos son opcionales, pero en cierto punto, necesarios para ver el estado de los nodos y pods.

Para esto, es necesario tener activo Docker Desktop con Kubernetes.

1. ``aws eks update-kubeconfig --region us-east-1 --name innovatech-cluster`` -> Cambia la dirección de preguntas de la terminal hacia AWS.
2. ``kubectl get hpa`` -> Sirve para confirmar que el clúster quedó listo para soportar el estrés de la entrega.
3. ``kubectl get svc`` -> Sirve para visualizar los servicios (Como el DNS del Front).

### 🚀 Recomendaciones

Para abrir el DNS del front correctamente, usa este formato:

``http://<DNS_FRONT>:8083``

> *PD: El :8083 es donde nginx está escuchando.*
