# API de Aprovisionamiento de Máquinas Virtuales Multi-Cloud

Sistema backend para aprovisionar máquinas virtuales en múltiples proveedores de nube (AWS, Azure, GCP y On-Premise) utilizando patrones de diseño y principios SOLID.

## 📋 Descripción

Este proyecto implementa un API REST para el aprovisionamiento unificado de máquinas virtuales en diferentes proveedores de nube. Fue desarrollado como parte de la asignatura de Patrones de Diseño de Software de la Universidad Popular del Cesar.

## 🏗️ Arquitectura y Patrones Implementados

### Principios SOLID

1. **Single Responsibility Principle (SRP)**: Cada clase tiene una única responsabilidad claramente definida.
   - `ProvisioningController`: Maneja las peticiones HTTP
   - `ProvisioningService`: Contiene la lógica de negocio
   - `Logger`: Gestiona el registro de eventos
   - Cada modelo representa un tipo específico de VM

2. **Open/Closed Principle (OCP)**: El sistema está abierto para extensión pero cerrado para modificación.
   - Se pueden agregar nuevos proveedores de nube sin modificar el código existente
   - Solo es necesario crear una nueva factory y registrarla

3. **Liskov Substitution Principle (LSP)**: Las clases derivadas pueden sustituir a sus clases base.
   - Todas las VMs implementan `IVirtualMachine`
   - Todas las factories extienden `VMFactory`

4. **Interface Segregation Principle (ISP)**: Interfaces específicas para cada cliente.
   - `IVirtualMachine` define solo los métodos necesarios
   - Cada implementación concreta agrega sus propios métodos específicos

5. **Dependency Inversion Principle (DIP)**: Dependencia de abstracciones, no de implementaciones concretas.
   - `ProvisioningService` depende de `VMFactory` (abstracción), no de factories concretas
   - El controlador depende del servicio, no de la lógica directamente

### Patrón Factory Method

El patrón Factory Method se utiliza para encapsular la creación de máquinas virtuales:

- **Clase abstracta**: `VMFactory` define el método `createVM()`
- **Factories concretas**:
  - `AWSVMFactory`: Crea instancias de `AWSVirtualMachine`
  - `AzureVMFactory`: Crea instancias de `AzureVirtualMachine`
  - `GCPVMFactory`: Crea instancias de `GCPVirtualMachine`
  - `OnPremiseVMFactory`: Crea instancias de `OnPremiseVirtualMachine`

### Patrón MVC (Model-View-Controller)

- **Model**: Clases en `src/models/` representan las entidades de dominio
- **View**: Swagger UI proporciona la interfaz de documentación y pruebas
- **Controller**: `ProvisioningController` maneja las peticiones HTTP y delega al servicio

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web para el API REST
- **Supabase**: Base de datos PostgreSQL (persistencia de datos)
- **Swagger/OpenAPI**: Documentación interactiva del API
- **dotenv**: Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
project/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de Supabase
│   │   └── swagger.js            # Configuración de Swagger
│   ├── controllers/
│   │   └── ProvisioningController.js  # Controlador REST
│   ├── factories/
│   │   ├── VMFactory.js          # Factory abstracto
│   │   ├── AWSVMFactory.js       # Factory AWS
│   │   ├── AzureVMFactory.js     # Factory Azure
│   │   ├── GCPVMFactory.js       # Factory GCP
│   │   └── OnPremiseVMFactory.js # Factory On-Premise
│   ├── models/
│   │   ├── IVirtualMachine.js    # Interfaz base
│   │   ├── AWSVirtualMachine.js  # Modelo AWS
│   │   ├── AzureVirtualMachine.js # Modelo Azure
│   │   ├── GCPVirtualMachine.js  # Modelo GCP
│   │   ├── OnPremiseVirtualMachine.js # Modelo On-Premise
│   │   └── ProvisioningResult.js # Resultado de aprovisionamiento
│   ├── routes/
│   │   └── provisioning.routes.js # Rutas del API
│   ├── services/
│   │   ├── Logger.js             # Servicio de logging
│   │   └── ProvisioningService.js # Lógica de negocio
│   ├── app.js                    # Configuración de Express
│   └── server.js                 # Punto de entrada
├── sample-data.json              # Datos de prueba
├── .env                          # Variables de entorno
├── package.json
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Supabase (la base de datos ya está configurada)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd project
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   El archivo `.env` ya contiene las credenciales de Supabase necesarias:
   ```
   SUPABASE_URL=<tu-url>
   SUPABASE_ANON_KEY=<tu-key>
   PORT=3000
   ```

4. **Iniciar el servidor**
   ```bash
   node src/server.js
   ```

   El servidor estará disponible en `http://localhost:3000`

## 📖 Uso del API

### Documentación Interactiva (Swagger)

Accede a la documentación completa y prueba los endpoints en:
```
http://localhost:3000/api-docs
```

### Endpoints Disponibles

#### 1. Aprovisionar una VM
```http
POST /api/provision
Content-Type: application/json

{
  "provider": "aws",
  "params": {
    "instanceType": "t2.micro",
    "region": "us-east-1",
    "vpcId": "vpc-123456",
    "ami": "ami-0abcdef"
  }
}
```

**Respuesta exitosa (201)**:
```json
{
  "status": "success",
  "vmId": "aws-1234567890-abc123",
  "provider": "aws",
  "timestamp": "2025-10-07T10:30:00Z"
}
```

#### 2. Obtener todas las VMs
```http
GET /api/vms
```

#### 3. Obtener una VM por ID
```http
GET /api/vms/{vmId}
```

#### 4. Obtener logs de aprovisionamiento
```http
GET /api/logs
```

### Ejemplos de Parámetros por Proveedor

#### AWS
```json
{
  "provider": "aws",
  "params": {
    "instanceType": "t2.micro",
    "region": "us-east-1",
    "vpcId": "vpc-0a1b2c3d",
    "ami": "ami-0abcdef123"
  }
}
```

#### Azure
```json
{
  "provider": "azure",
  "params": {
    "vmSize": "Standard_B1s",
    "resourceGroup": "my-resource-group",
    "image": "Ubuntu-20.04",
    "virtualNetwork": "my-vnet"
  }
}
```

#### Google Cloud Platform
```json
{
  "provider": "gcp",
  "params": {
    "machineType": "n1-standard-1",
    "zone": "us-central1-a",
    "disk": "100GB-SSD",
    "project": "my-project"
  }
}
```

#### On-Premise
```json
{
  "provider": "onpremise",
  "params": {
    "cpu": 4,
    "ram": 16,
    "disk": "500GB",
    "network": "VLAN-100"
  }
}
```

### Usando cURL

```bash
curl -X POST http://localhost:3000/api/provision \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "params": {
      "instanceType": "t2.micro",
      "region": "us-east-1",
      "vpcId": "vpc-123",
      "ami": "ami-123"
    }
  }'
```

## 🗄️ Base de Datos

El sistema utiliza Supabase (PostgreSQL) con las siguientes tablas:

### `virtual_machines`
Almacena información de las máquinas virtuales creadas:
- Campos comunes: id, vm_id, provider, status, created_at, updated_at
- Campos específicos por proveedor (AWS, Azure, GCP, On-Premise)

### `provisioning_logs`
Registra todas las operaciones de aprovisionamiento:
- Parámetros de la solicitud (sin información sensible)
- Estado del aprovisionamiento (success/error)
- Mensajes de error si aplica
- Timestamp de la operación

## 🔒 Seguridad

- **RLS (Row Level Security)**: Habilitado en todas las tablas
- **Sanitización de logs**: Información sensible (API keys, passwords) se elimina de los logs
- **Variables de entorno**: Credenciales almacenadas de forma segura

## 🧪 Datos de Prueba

El archivo `sample-data.json` contiene ejemplos de solicitudes para cada proveedor. Úsalo como referencia para probar el API.

## 📝 Requerimientos Cumplidos

### Funcionales (RF)
- ✅ RF1: Endpoint único para aprovisionar VMs en múltiples proveedores
- ✅ RF2: Lógica específica para cada proveedor
- ✅ RF3: Respuestas con estado del aprovisionamiento (éxito/error)
- ✅ RF4: Sistema de logging sin información sensible
- ✅ RF5: Extensible a nuevos proveedores sin modificar código existente

### No Funcionales (RNF)
- ✅ RNF1: Extensibilidad mediante Factory Method y SOLID
- ✅ RNF2: Mantenibilidad con Dependency Inversion
- ✅ RNF3: Seguridad mediante sanitización de logs
- ✅ RNF4: Escalabilidad con diseño stateless
- ✅ RNF5: Compatibilidad con JSON para todos los proveedores

## 🔄 Extender el Sistema

Para agregar un nuevo proveedor (ejemplo: Oracle Cloud):

1. Crear el modelo en `src/models/OracleVirtualMachine.js`
2. Crear la factory en `src/factories/OracleVMFactory.js`
3. Registrar la factory en `ProvisioningService`:
   ```javascript
   this.factories = {
     // ... existentes
     oracle: new OracleVMFactory()
   };
   ```

No se requiere modificar el controlador ni las rutas.

## 👥 Autor

Desarrollado para la asignatura de Patrones de Diseño de Software
Universidad Popular del Cesar - Especialización en Ingeniería de Software

## 📄 Licencia

Este proyecto es de uso académico.
