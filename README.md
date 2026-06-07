# InnovaTech - Sistema de Gestión de Ventas y Despachos 🚀

InnovaTech es una solución de software empresarial basada en una arquitectura de tres capas (**3-Tier Architecture**), diseñada para ser altamente escalable, segura y resiliente. El proyecto se encuentra completamente containerizado y se despliega de forma automatizada en **Amazon Web Services (AWS)** utilizando herramientas de Infraestructura como Código (IaC) y flujos avanzados de Integración y Despliegue Continuo (CI/CD).

---

## 🏗️ Arquitectura y Componentes del Sistema

El ecosistema de la aplicación se divide en componentes independientes distribuidos en sus respectivas capas tecnológicas:

### 📂 Infraestructura del proyecto

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
|   ├── main.tf
│   ├── compute.tf
│   ├── network.tf
│   ├── security.tf
│   └── variables.tf
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

La topología de red y los recursos en la nube se encuentran aprovisionados de manera modular a través de archivos de configuración de Terraform:

- **`main.tf`:** Inicialización de proveedores cloud y configuraciones principales de la arquitectura global.
- **`network.tf`:** Declaración de la VPC, creación de subredes públicas (Frontend) y subredes privadas (Backend), tablas de ruteo e Internet Gateway / NAT Gateway para aislar los entornos de datos.
- **`security.tf`:** Definición de las reglas de firewalls lógicos mediante *Security Groups*. Implementa el principio de mínimo privilegio restringiendo el acceso del Backend únicamente al tráfico proveniente del balanceador o del Frontend (`web_sg` encadenado a `backend_sg`).
- **`compute.tf`:** Configuración de las plantillas de lanzamiento (*Launch Templates*) e instancias EC2 destinadas a ejecutar los entornos de contenedores Docker.
- **`iam.tf`:** Asignación de permisos y perfiles de instancia específicos (como las políticas de AWS Systems Manager `AmazonSSMManagedInstanceCore`) para administrar los recursos sin exponer claves de acceso públicas.
- **`variables.tf` y `outputs.tf`:** Parametrización dinámica del entorno para mitigar datos estáticos y exportación de direcciones IP o DNS clave.

Además, debido a los límites de hardware propios de la capa gratuita, la instancia de Backend cuenta con una optimización del sistema operativo mediante la adición de **2 GB de memoria Swap virtual**, previniendo que los microservicios Java sean detenidos de forma abrupta por el gestor de memoria física (*OOM Killer*).

---

## 🔄 Flujo de Automatización de CI/CD (GitHub Actions)

El ciclo de vida del código se encuentra completamente automatizado mediante un pipeline unificado que se activa ante eventos en ramas de integración:

```text
[Fase 1: Integración (Tests & Builds)] ──> [Fase 2: Registro (ECR)] ──> [Fase 3: Despliegue (EC2 vía SSH Proxy)]
```

---

## ⚙️ Recomendaciones

El despliege continuo poseen **secrets**. Esto influye en como se escribe el código del manejo de las imágenes a AWS, por lo que hay que estar atento a las siguentes variables:

**CD**

1. Configuraciones para el proceso **terraform apply**

| Nombre secreto | Uso |
|----------------|-----|
| AWS_ACCESS_KEY_ID | Apunta a la cuenta en si. |
| AWS_SECRET_ACCESS_KEY | Contraseña de la cuenta. |
| AWS_SESSION_TOKEN | Token de paso para la cuenta. |
| AWS_REGION | Region en donde está parada la cuenta. |

2. dependientes del proceso **terraform apply** / *Outputs de Terminal*

| Nombre secreto | Tipo | Uso |
|----------------|------|-----|
| EC2_FRONTEND_HOST | Dependiente | Ip exacta de la instancia front_server (Ver en consola AWS). |
| EC2_BACKEND_HOST | Dependiente | Ip exacta de la instancia back_server (Ver en consola AWS). |
| EC2_SSH_KEY | Dependiente | Llave con la cual se usa para crear las máquinas (Crear en consola AWS). |
| AWS_ECR_REGISTRY | Output Terminal | Url que ayuda a dirigir el destino de las imagenes a sus repositorios en aws, o sus nombres (Docker-compose). |

Sin esto, el despliege continuo no será capaz de levantar el proyecto en AWS.

> *PD: El nombre de la llave debe ser `devops-u2.pem` en variables.tf, o estará sujeta a cambios.*