# API de Aprovisionamiento de M\u00e1quinas Virtuales Multi-Cloud

Sistema de aprovisionamiento de recursos cloud que implementa patrones de dise\u00f1o SOLID, Factory Method, Abstract Factory y arquitectura MVC para gestionar m\u00e1quinas virtuales, redes y discos en m\u00faltiples proveedores (AWS, Azure, GCP, On-Premise).

## \ud83c\udfaf Caracter\u00edsticas Principales

- **Patr\u00f3n Abstract Factory**: Crea familias completas de recursos relacionados (VM + Red + Disco)
- **Patr\u00f3n Factory Method**: Delega la creaci\u00f3n de objetos a subclases especializadas
- **Arquitectura MVC**: Separaci\u00f3n clara de responsabilidades (Modelo, Vista, Controlador)
- **Principios SOLID**: C\u00f3digo limpio, mantenible y extensible
- **Multicloud**: Soporte para AWS, Azure, GCP y On-Premise
- **API REST**: Endpoints RESTful con documentaci\u00f3n Swagger
- **Base de Datos**: Persistencia en Supabase (PostgreSQL)

## \ud83d\udce6 Tecnolog\u00edas Implementadas

- **Node.js** con Express 5
- **Supabase** (PostgreSQL con Row Level Security)
- **Swagger/OpenAPI** para documentaci\u00f3n de API
- **Design Patterns**: Abstract Factory, Factory Method, MVC
- **SOLID Principles**: Single Responsibility, Open/Closed, Dependency Inversion

## \ud83d\udcda Patrones de Dise\u00f1o Implementados

### 1. Abstract Factory
Crea familias de objetos relacionados sin especificar sus clases concretas. Garantiza que VM, Red y Disco de un mismo proveedor sean compatibles entre s\u00ed.

```javascript
// Cada proveedor tiene su propio factory que crea recursos compatibles
const factory = new AWSFactory();
const vm = factory.createVirtualMachine(vmParams);
const network = factory.createNetwork(networkParams);
const disk = factory.createDisk(diskParams);
```

**Implementaci\u00f3n:**
- `AbstractFactory`: Clase abstracta que define la interfaz para crear familias de recursos
- `AWSFactory`, `AzureFactory`, `GCPFactory`, `OnPremiseFactory`: Implementaciones concretas

### 2. Factory Method
Delega la creaci\u00f3n de objetos a subclases especializadas por proveedor.

```javascript
// La clase abstracta define el m\u00e9todo, las subclases lo implementan
class AbstractFactory {
  createVirtualMachine(params) { /* abstract */ }
  createNetwork(params) { /* abstract */ }
  createDisk(params) { /* abstract */ }
}
```

### 3. MVC (Model-View-Controller)
- **Model**: Clases de dominio (VirtualMachine, Network, Disk)
- **Controller**: `ProvisioningController` maneja peticiones HTTP
- **Service**: `ProvisioningService` contiene la l\u00f3gica de negocio

### 4. Principios SOLID

#### Single Responsibility (SRP)
Cada clase tiene una \u00fanica responsabilidad:
- `ProvisioningController`: Maneja HTTP
- `ProvisioningService`: L\u00f3gica de aprovisionamiento
- `Logger`: Registro de eventos

#### Open/Closed (OCP)
El sistema es extensible sin modificar c\u00f3digo existente. Para agregar un nuevo proveedor:
1. Crear clases concretas (VM, Network, Disk)
2. Crear un nuevo factory
3. Registrar en el servicio

#### Liskov Substitution (LSP)
Las implementaciones concretas pueden sustituir a sus interfaces:
```javascript
IVirtualMachine vm = new AWSVirtualMachine(...);
IVirtualMachine vm = new AzureVirtualMachine(...);
```

#### Interface Segregation (ISP)
Interfaces espec\u00edficas para cada tipo de recurso (IVirtualMachine, INetwork, IDisk).

#### Dependency Inversion (DIP)
Las clases dependen de abstracciones, no de implementaciones concretas:
```javascript
// El servicio depende de AbstractFactory, no de factories concretos
this.factories = {
  aws: new AWSFactory(),
  azure: new AzureFactory()
};
```

## \ud83d\udee0\ufe0f Instalaci\u00f3n

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase (gratis en [supabase.com](https://supabase.com))

### Pasos de Instalaci\u00f3n

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

Edita el archivo `.env` con tus credenciales de Supabase:

```env
# URL de tu proyecto Supabase
SUPABASE_URL=https://tuproyecto.supabase.co

# Clave an\u00f3nima de tu proyecto Supabase
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Puerto del servidor (opcional)
PORT=3000
```

Para obtener estas credenciales:
1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a Settings > API
4. Copia la URL y la clave `anon/public`

4. **Ejecutar migraciones de base de datos**

Las migraciones se encuentran en `supabase/migrations/`. Aplica las migraciones usando el panel de Supabase:

1. Ve a SQL Editor en tu proyecto Supabase
2. Ejecuta el contenido de:
   - `20251007151213_create_vm_provisioning_schema.sql`
   - `20251007152000_add_network_and_disk_tables.sql`

5. **Iniciar el servidor**
```bash
npm start
```

El servidor estar\u00e1 disponible en `http://localhost:3000`

## \ud83d\ude80 Uso de la API

### Documentaci\u00f3n Swagger

Accede a la documentaci\u00f3n interactiva en:
```
http://localhost:3000/api-docs
```

### Endpoints Disponibles

#### 1. Aprovisionar Recursos (POST /api/provision)

Crea una familia completa de recursos (VM + Red + Disco).

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
        "vpcId": "vpc-0123456789abcdef0",
        "ami": "ami-0c55b159cbfafe1f0"
      },
      "network": {
        "vpcId": "vpc-0123456789abcdef0",
        "subnet": "10.0.1.0/24",
        "securityGroup": "sg-0123456789abcdef0",
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

**Ejemplo Azure:**
```bash
curl -X POST http://localhost:3000/api/provision \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "azure",
    "params": {
      "vm": {
        "vmSize": "Standard_D2s_v3",
        "location": "eastus",
        "resourceGroup": "my-resource-group",
        "imageReference": "UbuntuServer:18.04-LTS"
      },
      "network": {
        "virtualNetwork": "my-vnet",
        "subnetName": "default",
        "networkSecurityGroup": "my-nsg",
        "region": "eastus"
      },
      "disk": {
        "diskSku": "Premium_LRS",
        "sizeGB": 128,
        "managedDisk": true
      }
    }
  }'
```

**Ejemplo GCP:**
```bash
curl -X POST http://localhost:3000/api/provision \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "gcp",
    "params": {
      "vm": {
        "machineType": "n1-standard-2",
        "zone": "us-central1-a",
        "project": "my-project-12345",
        "image": "debian-11-bullseye-v20240110"
      },
      "network": {
        "networkName": "default",
        "subnetworkName": "default",
        "firewallTag": "web-server",
        "region": "us-central1"
      },
      "disk": {
        "diskType": "pd-ssd",
        "sizeGB": 50,
        "autoDelete": true
      }
    }
  }'
```

**Ejemplo On-Premise:**
```bash
curl -X POST http://localhost:3000/api/provision \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "onpremise",
    "params": {
      "vm": {
        "cpu": 4,
        "ram": 16,
        "hypervisor": "VMware ESXi",
        "network": "vlan-100"
      },
      "network": {
        "physicalInterface": "eth0",
        "vlanId": 100,
        "firewallPolicy": "allow-web-traffic",
        "region": "datacenter-1"
      },
      "disk": {
        "storagePool": "SAN-Pool-01",
        "sizeGB": 200,
        "raidLevel": "RAID5"
      }
    }
  }'
```

#### 2. Listar VMs (GET /api/vms)
```bash
curl http://localhost:3000/api/vms
```

#### 3. Obtener VM por ID (GET /api/vms/:vmId)
```bash
curl http://localhost:3000/api/vms/aws-vm-1234567890-abc123
```

#### 4. Ver Logs (GET /api/logs)
```bash
curl http://localhost:3000/api/logs
```

## \ud83d\udcdd Datos de Prueba

El archivo `test-data.json` contiene ejemplos completos para cada proveedor. Puedes usar estos datos para probar la API.

## \ud83c\udfdb\ufe0f Estructura del Proyecto

```
vm-provisioning-api/
\u251c\u2500\u2500 src/
\u2502   \u251c\u2500\u2500 models/              # Modelos de dominio
\u2502   \u2502   \u251c\u2500\u2500 IVirtualMachine.js
\u2502   \u2502   \u251c\u2500\u2500 INetwork.js
\u2502   \u2502   \u251c\u2500\u2500 IDisk.js
\u2502   \u2502   \u251c\u2500\u2500 AWSVirtualMachine.js
\u2502   \u2502   \u251c\u2500\u2500 AWSNetwork.js
\u2502   \u2502   \u251c\u2500\u2500 AWSDisk.js
\u2502   \u2502   \u251c\u2500\u2500 Azure*, GCP*, OnPremise* ...
\u2502   \u2502   \u2514\u2500\u2500 ProvisioningResult.js
\u2502   \u251c\u2500\u2500 factories/          # Abstract Factory pattern
\u2502   \u2502   \u251c\u2500\u2500 AbstractFactory.js
\u2502   \u2502   \u251c\u2500\u2500 AWSFactory.js
\u2502   \u2502   \u251c\u2500\u2500 AzureFactory.js
\u2502   \u2502   \u251c\u2500\u2500 GCPFactory.js
\u2502   \u2502   \u2514\u2500\u2500 OnPremiseFactory.js
\u2502   \u251c\u2500\u2500 controllers/        # MVC Controllers
\u2502   \u2502   \u2514\u2500\u2500 ProvisioningController.js
\u2502   \u251c\u2500\u2500 services/           # Business logic
\u2502   \u2502   \u251c\u2500\u2500 ProvisioningService.js
\u2502   \u2502   \u2514\u2500\u2500 Logger.js
\u2502   \u251c\u2500\u2500 routes/             # Express routes
\u2502   \u2502   \u2514\u2500\u2500 provisioning.routes.js
\u2502   \u251c\u2500\u2500 config/             # Configuration
\u2502   \u2502   \u251c\u2500\u2500 database.js
\u2502   \u2502   \u2514\u2500\u2500 swagger.js
\u2502   \u251c\u2500\u2500 app.js              # Express app
\u2502   \u2514\u2500\u2500 server.js           # Server entry point
\u251c\u2500\u2500 supabase/
\u2502   \u2514\u2500\u2500 migrations/         # Database migrations
\u251c\u2500\u2500 test-data.json          # Datos de prueba
\u251c\u2500\u2500 .env                    # Variables de entorno
\u251c\u2500\u2500 package.json
\u2514\u2500\u2500 README.md
```

## \ud83d\udce6 Base de Datos

### Tablas Principales

#### `virtual_machines`
Almacena las m\u00e1quinas virtuales aprovisionadas.

#### `networks`
Almacena los recursos de red (VPC, Virtual Networks, etc.).

#### `disks`
Almacena los discos de almacenamiento.

#### `provisioning_logs`
Registra todas las operaciones de aprovisionamiento.

### Esquema de Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Pol\u00edticas configuradas para acceso p\u00fablico (demo)
- En producci\u00f3n, ajustar pol\u00edticas seg\u00fan autenticaci\u00f3n

## \ud83d\udd27 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar en modo desarrollo (igual que start)
npm run dev
```

## \ud83d\udcda Ejemplos de Uso Avanzado

### Agregar un Nuevo Proveedor

Para agregar soporte para un nuevo proveedor (ej: DigitalOcean):

1. **Crear modelos de dominio:**
```javascript
// src/models/DigitalOceanVirtualMachine.js
class DigitalOceanVirtualMachine extends IVirtualMachine { ... }

// src/models/DigitalOceanNetwork.js
class DigitalOceanNetwork extends INetwork { ... }

// src/models/DigitalOceanDisk.js
class DigitalOceanDisk extends IDisk { ... }
```

2. **Crear factory concreto:**
```javascript
// src/factories/DigitalOceanFactory.js
class DigitalOceanFactory extends AbstractFactory {
  createVirtualMachine(params) { ... }
  createNetwork(params) { ... }
  createDisk(params) { ... }
}
```

3. **Registrar en el servicio:**
```javascript
// src/services/ProvisioningService.js
this.factories = {
  aws: new AWSFactory(),
  azure: new AzureFactory(),
  gcp: new GCPFactory(),
  onpremise: new OnPremiseFactory(),
  digitalocean: new DigitalOceanFactory() // Nuevo
};
```

## \ud83d\udcdd Requerimientos Cumplidos

### Requerimientos Funcionales (RF)

- **RF1**: La API permite aprovisionar familias de recursos (VM + Red + Disco) en un \u00fanico request
- **RF2**: Sistema expone endpoint REST unificado para provisi\u00f3n de tres tipos de recurso
- **RF3**: El aprovisionamiento de VM es consistente (recursos del mismo proveedor)
- **RF4**: La API devuelve resultado con datos del recurso creado e IDs generados
- **RF5**: Sistema extensible para nuevos proveedores sin modificar controlador central

### Requerimientos No Funcionales (RNF)

- **RNF1**: Consistencia garantizada (VM no se crea sin Red y Disco asociados)

## \ud83d\udd12 Consideraciones de Seguridad

- Las credenciales de Supabase deben mantenerse privadas
- En producci\u00f3n, configurar pol\u00edticas RLS restrictivas
- Implementar autenticaci\u00f3n para endpoints sensibles
- Validar y sanitizar todas las entradas de usuario
- No exponer claves de API de proveedores cloud en el frontend

## \ud83d\udcdd Licencia

ISC License - Universidad Popular del Cesar

## \ud83d\udc65 Autor

Especializaci\u00f3n en Ingenier\u00eda de Software
Universidad Popular del Cesar

## \ud83d\udd17 Enlaces \u00datiles

- [Documentaci\u00f3n de Supabase](https://supabase.com/docs)
- [Express.js](https://expressjs.com/)
- [Swagger/OpenAPI](https://swagger.io/)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

## \u2753 Preguntas Frecuentes

### \u00bfC\u00f3mo obtengo las credenciales de Supabase?
1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia URL y anon key

### \u00bfPuedo usar otra base de datos?
S\u00ed, pero requiere modificar `src/config/database.js` y las migraciones.

### \u00bfC\u00f3mo despliego en producci\u00f3n?
1. Configura las variables de entorno en tu servidor
2. Ejecuta `npm install --production`
3. Inicia con `npm start`
4. Usa un process manager como PM2

## \ud83d\udcde Soporte

Para dudas o problemas, contacta al equipo docente del curso de Patrones de Dise\u00f1o de Software.
