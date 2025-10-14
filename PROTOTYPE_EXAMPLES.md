# Ejemplos de Uso del Patrón Prototype

## Ejemplo Completo: Crear y Clonar una VM AWS

### Paso 1: Aprovisionar una VM Base

```bash
POST http://localhost:3000/api/provision
Content-Type: application/json

{
  "provider": "aws",
  "params": {
    "vm": {
      "instanceType": "t3.medium",
      "region": "us-east-1",
      "vpcId": "vpc-0123456789abcdef0",
      "ami": "ami-0c55b159cbfafe1f0",
      "vcpus": 2,
      "memoryGB": 4,
      "memoryOptimization": false,
      "diskOptimization": true,
      "keyPairName": "my-ssh-key"
    },
    "network": {
      "vpcId": "vpc-0123456789abcdef0",
      "subnet": "10.0.1.0/24",
      "securityGroup": "sg-web-server",
      "region": "us-east-1"
    },
    "disk": {
      "volumeType": "gp3",
      "sizeGB": 100,
      "encrypted": true
    }
  }
}
```

**Respuesta:**
```json
{
  "status": "success",
  "vmId": "aws-1699999999999-abc123xyz",
  "provider": "aws",
  "timestamp": "2024-10-13T12:00:00.000Z"
}
```

### Paso 2: Registrar como Plantilla Prototype

```bash
POST http://localhost:3000/api/prototypes/register
Content-Type: application/json

{
  "vmId": "aws-1699999999999-abc123xyz",
  "templateName": "aws-web-server-template"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Plantilla \"aws-web-server-template\" registrada correctamente",
  "templateName": "aws-web-server-template",
  "vmId": "aws-1699999999999-abc123xyz"
}
```

### Paso 3: Listar Plantillas Disponibles

```bash
GET http://localhost:3000/api/prototypes
```

**Respuesta:**
```json
{
  "status": "success",
  "count": 1,
  "data": [
    "aws-web-server-template"
  ]
}
```

### Paso 4: Clonar desde la Plantilla

```bash
POST http://localhost:3000/api/prototypes/clone
Content-Type: application/json

{
  "templateName": "aws-web-server-template"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "VM clonada desde plantilla \"aws-web-server-template\"",
  "vmId": "aws-1700000000000-def456uvw",
  "templateName": "aws-web-server-template",
  "timestamp": "2024-10-13T12:05:00.000Z"
}
```

## Ejemplo: Múltiples Plantillas para Diferentes Casos de Uso

### Plantilla 1: Servidor Web Básico

```bash
POST /api/prototypes/register
{
  "vmId": "aws-vm-001",
  "templateName": "web-basic-t3-small"
}
```

### Plantilla 2: Base de Datos Optimizada

```bash
POST /api/prototypes/register
{
  "vmId": "aws-vm-002",
  "templateName": "database-r5-xlarge"
}
```

### Plantilla 3: Servidor de Procesamiento

```bash
POST /api/prototypes/register
{
  "vmId": "aws-vm-003",
  "templateName": "compute-c5-2xlarge"
}
```

### Clonar Según Necesidad

```bash
# Para servidor web
POST /api/prototypes/clone
{ "templateName": "web-basic-t3-small" }

# Para base de datos
POST /api/prototypes/clone
{ "templateName": "database-r5-xlarge" }

# Para procesamiento
POST /api/prototypes/clone
{ "templateName": "compute-c5-2xlarge" }
```

## Ejemplo: Diferentes Proveedores

### Azure Web Server Template

```bash
POST /api/provision
{
  "provider": "azure",
  "params": {
    "vm": {
      "vmSize": "Standard_B2s",
      "location": "eastus",
      "resourceGroup": "web-rg",
      "imageReference": "UbuntuServer:20.04-LTS",
      "vcpus": 2,
      "memoryGB": 4
    },
    "network": { ... },
    "disk": { ... }
  }
}

# Registrar
POST /api/prototypes/register
{
  "vmId": "azure-vm-001",
  "templateName": "azure-web-standard"
}

# Clonar
POST /api/prototypes/clone
{ "templateName": "azure-web-standard" }
```

### GCP Database Template

```bash
POST /api/provision
{
  "provider": "gcp",
  "params": {
    "vm": {
      "machineType": "n2-highmem-4",
      "zone": "us-central1-a",
      "project": "my-project",
      "image": "debian-11",
      "vcpus": 4,
      "memoryGB": 32,
      "memoryOptimization": true
    },
    "network": { ... },
    "disk": { ... }
  }
}

# Registrar
POST /api/prototypes/register
{
  "vmId": "gcp-vm-001",
  "templateName": "gcp-database-highmem"
}

# Clonar
POST /api/prototypes/clone
{ "templateName": "gcp-database-highmem" }
```

## Ejemplo: Eliminar Plantilla Obsoleta

```bash
DELETE http://localhost:3000/api/prototypes/aws-web-server-template
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Plantilla \"aws-web-server-template\" eliminada correctamente"
}
```

## Caso de Uso Real: Escalado Rápido

Escenario: Necesitas desplegar 5 servidores web idénticos rápidamente.

```bash
# 1. Crea y configura la VM perfecta
POST /api/provision { ... }

# 2. Regístrala como plantilla
POST /api/prototypes/register
{
  "vmId": "aws-optimized-web",
  "templateName": "production-web-server"
}

# 3. Clona 5 veces
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/prototypes/clone \
    -H "Content-Type: application/json" \
    -d '{"templateName": "production-web-server"}'
done
```

## Ventajas Demostradas

1. **Velocidad:** Clonar es más rápido que crear desde cero
2. **Consistencia:** Todas las VMs tienen la misma configuración probada
3. **Simplicidad:** Una sola petición HTTP para clonar
4. **Flexibilidad:** Diferentes plantillas para diferentes casos de uso
5. **Sin Duplicación:** No necesitas repetir configuraciones complejas

## Integración con Otros Patrones

### Combinar con Builder Pattern

```bash
# 1. Usar Builder para crear VM optimizada
POST /api/provision/builder
{
  "provider": "aws",
  "vmType": "memory-optimized",
  "size": "large",
  "region": "us-west-2",
  "params": { ... }
}

# 2. Registrar como plantilla
POST /api/prototypes/register
{
  "vmId": "aws-builder-vm-001",
  "templateName": "memory-large-template"
}

# 3. Clonar cuando sea necesario
POST /api/prototypes/clone
{ "templateName": "memory-large-template" }
```
