# API de Aprovisionamiento de Máquinas Virtuales Multi-Cloud

Sistema completo de aprovisionamiento de recursos cloud que implementa múltiples patrones de diseño (SOLID, Factory Method, Abstract Factory, Builder, Director, MVC) para gestionar máquinas virtuales, redes y discos en AWS, Azure, GCP y On-Premise.

## Características Principales

### Patrones de Diseño Implementados

1. **SOLID Principles** - Código limpio y mantenible
2. **Factory Method** - Creación de objetos delegada a subclases
3. **Abstract Factory** - Familias de recursos relacionados
4. **Builder** - Construcción paso a paso de objetos complejos
5. **Director** - Orquesta la construcción según tipo de VM
6. **MVC** - Arquitectura Modelo-Vista-Controlador

### Proveedores Soportados

- **AWS** (Amazon Web Services)
- **Azure** (Microsoft Azure)
- **GCP** (Google Cloud Platform)
- **On-Premise** (Infraestructura local)

### Tipos de Máquinas Virtuales

- **Standard** - Propósito general, equilibrio CPU/RAM
- **Memory-Optimized** - Optimizadas para memoria
- **Compute-Optimized** - Optimizadas para cómputo

### Tamaños Disponibles

- **Small** - 2 vCPU base
- **Medium** - 4 vCPU base
- **Large** - 8 vCPU base

## Tecnologías

- **Node.js** v18+ con Express 5
- **Supabase** (PostgreSQL con RLS)
- **Swagger/OpenAPI** para documentación
- **JavaScript** (ES6+)

## Instalación

### Prerrequisitos

```bash
# Node.js 18 o superior
node --version

# npm
npm --version

# Cuenta Supabase
# Crear en https://supabase.com
```

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd vm-provisioning-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Editar archivo `.env`:
```env
# URL de Supabase
SUPABASE_URL=https://tuproyecto.supabase.co

# Clave anónima de Supabase
SUPABASE_ANON_KEY=tu_clave_aqui

# Puerto del servidor (opcional)
PORT=3000
```

4. **Ejecutar migraciones de base de datos**

En el SQL Editor de Supabase, ejecutar en orden:
- `supabase/migrations/20251007151213_create_vm_provisioning_schema.sql`
- `supabase/migrations/20251007152000_add_network_and_disk_tables.sql`
- `supabase/migrations/20251008000000_add_vm_attributes.sql`

5. **Iniciar el servidor**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Uso de la API

### Documentación Swagger

Acceder a la documentación interactiva:
```
http://localhost:3000/api-docs
```

### Endpoints Disponibles

#### 1. Aprovisionar con Abstract Factory (POST /api/provision)

Crea recursos especificando todos los parámetros manualmente.

**Ejemplo AWS:**
```bash
curl -X POST http://localhost:3000/api/provision \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "params": {
      "vm": {
        "instanceType": "t3.medium",
        "region": "us-east-1",
        "vpcId": "vpc-123",
        "ami": "ami-123"
      },
      "network": {
        "vpcId": "vpc-123",
        "subnet": "10.0.1.0/24",
        "securityGroup": "sg-123",
        "region": "us-east-1"
      },
      "disk": {
        "volumeType": "gp3",
        "sizeGB": 100,
        "encrypted": true
      }
    }
  }'
```

#### 2. Aprovisionar con Builder + Director (POST /api/provision/builder)

El Director asigna automáticamente vCPU y RAM según tipo y tamaño.

**Tipos de VM:**
- `standard` - Propósito general
- `memory-optimized` - Optimizada para memoria
- `compute-optimized` - Optimizada para cómputo

**Tamaños:**
- `small`, `medium`, `large`

**Ejemplo AWS Standard Small (t3.medium: 2 vCPU, 4 GB RAM):**
```bash
curl -X POST http://localhost:3000/api/provision/builder \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "vmType": "standard",
    "size": "small",
    "region": "us-east-1",
    "params": {
      "vm": {
        "vpcId": "vpc-123",
        "ami": "ami-123",
        "keyPairName": "my-key"
      },
      "network": {
        "vpcId": "vpc-123",
        "subnet": "10.0.1.0/24",
        "securityGroup": "sg-web",
        "firewallRules": ["HTTP", "HTTPS", "SSH"],
        "publicIP": true
      },
      "disk": {
        "volumeType": "gp3",
        "encrypted": true,
        "iops": 3000
      }
    }
  }'
```

**Ejemplo Azure Memory-Optimized Medium (E4s_v3: 4 vCPU, 32 GB RAM):**
```bash
curl -X POST http://localhost:3000/api/provision/builder \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "azure",
    "vmType": "memory-optimized",
    "size": "medium",
    "region": "eastus",
    "params": {
      "vm": {
        "resourceGroup": "my-rg",
        "imageReference": "UbuntuServer:20.04-LTS"
      },
      "network": {
        "virtualNetwork": "my-vnet",
        "subnetName": "default",
        "networkSecurityGroup": "my-nsg",
        "publicIP": false
      },
      "disk": {
        "diskSku": "Premium_LRS",
        "managedDisk": true
      }
    }
  }'
```

**Ejemplo GCP Compute-Optimized Large (n2-highcpu-8: 8 vCPU, 8 GB RAM):**
```bash
curl -X POST http://localhost:3000/api/provision/builder \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "gcp",
    "vmType": "compute-optimized",
    "size": "large",
    "region": "us-central1",
    "params": {
      "vm": {
        "project": "my-project-123",
        "image": "debian-11"
      },
      "network": {
        "networkName": "default",
        "subnetworkName": "default",
        "firewallTag": "compute",
        "publicIP": true
      },
      "disk": {
        "diskType": "pd-ssd",
        "autoDelete": true
      }
    }
  }'
```

#### 3. Listar VMs (GET /api/vms)
```bash
curl http://localhost:3000/api/vms
```

#### 4. Obtener VM por ID (GET /api/vms/:vmId)
```bash
curl http://localhost:3000/api/vms/aws-vm-1234567890
```

#### 5. Ver Logs (GET /api/logs)
```bash
curl http://localhost:3000/api/logs
```

## Configuraciones Predefinidas por el Director

### AWS

**Standard (Propósito General):**
- Small: `t3.medium` - 2 vCPU, 4 GB RAM
- Medium: `m5.large` - 2 vCPU, 8 GB RAM
- Large: `m5.xlarge` - 4 vCPU, 16 GB RAM

**Memory-Optimized:**
- Small: `r5.large` - 2 vCPU, 16 GB RAM
- Medium: `r5.xlarge` - 4 vCPU, 32 GB RAM
- Large: `r5.2xlarge` - 8 vCPU, 64 GB RAM

**Compute-Optimized:**
- Small: `c5.large` - 2 vCPU, 4 GB RAM
- Medium: `c5.xlarge` - 4 vCPU, 8 GB RAM
- Large: `c5.2xlarge` - 8 vCPU, 16 GB RAM

### Azure

**Standard:**
- Small: `D2s_v3` - 2 vCPU, 8 GB RAM
- Medium: `D4s_v3` - 4 vCPU, 16 GB RAM
- Large: `D8s_v3` - 8 vCPU, 32 GB RAM

**Memory-Optimized:**
- Small: `E2s_v3` - 2 vCPU, 16 GB RAM
- Medium: `E4s_v3` - 4 vCPU, 32 GB RAM
- Large: `E8s_v3` - 8 vCPU, 64 GB RAM

**Compute-Optimized:**
- Small: `F2s_v2` - 2 vCPU, 4 GB RAM
- Medium: `F4s_v2` - 4 vCPU, 8 GB RAM
- Large: `F8s_v2` - 8 vCPU, 16 GB RAM

### GCP

**Standard:**
- Small: `e2-standard-2` - 2 vCPU, 8 GB RAM
- Medium: `e2-standard-4` - 4 vCPU, 16 GB RAM
- Large: `e2-standard-8` - 8 vCPU, 32 GB RAM

**Memory-Optimized:**
- Small: `n2-highmem-2` - 2 vCPU, 16 GB RAM
- Medium: `n2-highmem-4` - 4 vCPU, 32 GB RAM
- Large: `n2-highmem-8` - 8 vCPU, 64 GB RAM

**Compute-Optimized:**
- Small: `n2-highcpu-2` - 2 vCPU, 2 GB RAM
- Medium: `n2-highcpu-4` - 4 vCPU, 4 GB RAM
- Large: `n2-highcpu-8` - 8 vCPU, 8 GB RAM

### On-Premise

**Standard:**
- Small: `onprem-std1` - 2 vCPU, 4 GB RAM
- Medium: `onprem-std2` - 4 vCPU, 8 GB RAM
- Large: `onprem-std3` - 8 vCPU, 16 GB RAM

**Memory-Optimized:**
- Small: `onprem-mem1` - 2 vCPU, 16 GB RAM
- Medium: `onprem-mem2` - 4 vCPU, 32 GB RAM
- Large: `onprem-mem3` - 8 vCPU, 64 GB RAM

**Compute-Optimized:**
- Small: `onprem-cpu1` - 2 vCPU, 2 GB RAM
- Medium: `onprem-cpu2` - 4 vCPU, 4 GB RAM
- Large: `onprem-cpu3` - 8 vCPU, 8 GB RAM

## Datos de Prueba

El proyecto incluye archivos de prueba:
- `vm-test-data.json` - Ejemplos con Builder + Director (12 configuraciones completas)
- `test-data.json` - Ejemplos con Abstract Factory
- `sample-data.json` - Datos de ejemplo adicionales

## Estructura del Proyecto

```
vm-provisioning-api/
├── src/
│   ├── builders/                    # Patrón Builder
│   │   ├── VirtualMachineBuilder.js    # Builder abstracto
│   │   ├── AWSVirtualMachineBuilder.js
│   │   ├── AzureVirtualMachineBuilder.js
│   │   ├── GCPVirtualMachineBuilder.js
│   │   └── OnPremiseVirtualMachineBuilder.js
│   ├── directors/                   # Patrón Director
│   │   └── Director.js                  # Orquesta la construcción
│   ├── models/                      # Modelos de dominio
│   │   ├── IVirtualMachine.js          # Interfaces
│   │   ├── INetwork.js
│   │   ├── IDisk.js
│   │   ├── VirtualMachinePackage.js    # Producto del Builder
│   │   ├── AWS*, Azure*, GCP*, OnPremise* (Implementaciones)
│   │   └── ProvisioningResult.js
│   ├── factories/                   # Abstract Factory pattern
│   │   ├── AbstractFactory.js
│   │   ├── AWSFactory.js
│   │   ├── AzureFactory.js
│   │   ├── GCPFactory.js
│   │   └── OnPremiseFactory.js
│   ├── controllers/                 # MVC Controllers
│   │   └── ProvisioningController.js
│   ├── services/                    # Lógica de negocio
│   │   ├── ProvisioningService.js        # Con Abstract Factory
│   │   ├── ProvisioningServiceBuilder.js # Con Builder + Director
│   │   └── Logger.js
│   ├── routes/                      # Express routes
│   │   └── provisioning.routes.js
│   ├── config/                      # Configuración
│   │   ├── database.js
│   │   └── swagger.js
│   ├── app.js                       # Express app
│   └── server.js                    # Entry point
├── supabase/migrations/             # Migraciones de BD
│   ├── 20251007151213_create_vm_provisioning_schema.sql
│   ├── 20251007152000_add_network_and_disk_tables.sql
│   └── 20251008000000_add_vm_attributes.sql
├── vm-test-data.json                # Datos de prueba Builder
├── test-data.json                   # Datos de prueba Factory
├── sample-data.json                 # Datos adicionales
├── .env                             # Variables de entorno
├── package.json
└── README.md
```

## Base de Datos

### Tablas

- **virtual_machines** - VMs aprovisionadas
- **networks** - Recursos de red
- **disks** - Discos de almacenamiento
- **provisioning_logs** - Logs de operaciones

### Seguridad

- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Datos sensibles no se almacenan en logs

## Patrones de Diseño Explicados

### 1. SOLID Principles

- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Extensible sin modificar código existente
- **L**iskov Substitution: Subtipos sustituyen a tipos base
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Depende de abstracciones

### 2. Factory Method

Delega la creación de objetos a subclases especializadas.

### 3. Abstract Factory

Crea familias de objetos relacionados sin especificar clases concretas.
Garantiza que VM, Network y Disk sean del mismo proveedor.

### 4. Builder

Construye objetos complejos paso a paso.
Permite diferentes representaciones del mismo objeto.

### 5. Director

Orquesta el proceso de construcción.
Define el orden y la lógica de construcción.
Asigna automáticamente vCPU y RAM según tipo de VM.

### 6. MVC

- **Model**: Clases de dominio
- **View**: Swagger UI
- **Controller**: Maneja HTTP, delega a servicios

## Parámetros

### Obligatorios

**VM:**
- `provider` - Proveedor cloud
- `vcpus` - Número de vCPUs
- `memoryGB` - Memoria RAM en GB

**Network:**
- `region` - Región

**Disk:**
- `region` - Región

### Opcionales

**VM:**
- `memoryOptimization` - boolean
- `diskOptimization` - boolean
- `keyPairName` - string

**Network:**
- `firewallRules` - array de strings
- `publicIP` - boolean

**Disk:**
- `iops` - number

## Ejemplos de Uso

Ver `vm-test-data.json` para ejemplos completos de:
- 12 configuraciones predefinidas
- Todos los proveedores (AWS, Azure, GCP, OnPremise)
- Todos los tipos de VM (standard, memory-optimized, compute-optimized)
- Todos los tamaños (small, medium, large)
- Parámetros obligatorios y opcionales

## Requisitos Cumplidos

### Funcionales (RF)

- ✅ RF1: Crear VMs en múltiples proveedores
- ✅ RF2: VM asociada a red y disco del mismo proveedor
- ✅ RF3: Director orquesta construcción según tipo
- ✅ RF4: Director asigna vCPU y RAM automáticamente
- ✅ RF5: Validación de coherencia de región y proveedor

### No Funcionales (RNF)

- ✅ RNF1: Modularidad (Factory, Builder, Director)
- ✅ RNF2: Extensibilidad sin modificar código existente
- ✅ RNF3: Validación cruzada
- ✅ RNF4: Escalabilidad
- ✅ RNF5: Código legible y documentado

## Autor
* **Sergio David De La Hoz Cordero**
* **Estudiante de Ingenieria de Sistemas**
* **Universidad Popular del Cesar**

## Enlaces Útiles

- [Supabase Docs](https://supabase.com/docs)
- [Express.js](https://expressjs.com/)
- [Swagger](https://swagger.io/)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

## Preguntas Frecuentes

### ¿Cuál es la diferencia entre los dos endpoints?

- `/api/provision` - Abstract Factory: Especificas todos los parámetros manualmente
- `/api/provision/builder` - Builder + Director: El Director asigna vCPU y RAM automáticamente según tipo y tamaño

### ¿Cómo obtengo credenciales de Supabase?

1. Crear cuenta en https://supabase.com
2. Crear nuevo proyecto
3. Ir a Settings > API
4. Copiar URL y anon key

### ¿Puedo agregar un nuevo proveedor?

Sí, siguiendo el Open/Closed Principle:
1. Crear modelos (VM, Network, Disk)
2. Crear Builder concreto
3. Crear Factory concreto
4. Registrar en servicios
5. Agregar configuraciones en Director

### ¿Cómo pruebo la API?

1. Usar Swagger UI en `/api-docs`
2. Usar `curl` con ejemplos del README
3. Usar datos de `vm-test-data.json` para Builder
4. Usar datos de `test-data.json` para Factory


