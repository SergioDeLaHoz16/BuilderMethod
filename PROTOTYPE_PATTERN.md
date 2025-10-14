# Implementación del Patrón Prototype

## Descripción General

Se ha implementado el patrón Prototype en la API de aprovisionamiento de máquinas virtuales, permitiendo la clonación de VMs existentes mediante plantillas reutilizables.

## Arquitectura

### 1. IPrototype (Interfaz)
**Ubicación:** `src/models/interfaces/IPrototype.js`

Define el contrato para objetos clonables:
```javascript
clone() // Método abstracto que debe ser implementado
```

### 2. PrototypeRegistry (Registro de Prototipos)
**Ubicación:** `src/patterns/PrototypeRegistry.js`

Mantiene un catálogo de plantillas de VMs:
- `registerPrototype(key, prototype)` - Registra una plantilla
- `clonePrototype(key)` - Clona una plantilla registrada
- `getPrototypeKeys()` - Lista todas las plantillas
- `hasPrototype(key)` - Verifica existencia
- `unregisterPrototype(key)` - Elimina una plantilla

### 3. Implementación en Máquinas Virtuales

Todas las clases de VM ahora implementan el método `clone()`:

#### AWSVirtualMachine
**Ubicación:** `src/models/aws/AWSVirtualMachine.js`
- Implementa `clone()` para crear copias de instancias EC2
- Genera nuevo ID único para cada clon
- Preserva todos los atributos de configuración

#### AzureVirtualMachine
**Ubicación:** `src/models/azure/AzureVirtualMachine.js`
- Implementa `clone()` para VMs de Azure
- Copia configuración completa incluyendo resourceGroup y imageReference

#### GCPVirtualMachine
**Ubicación:** `src/models/gcp/GCPVirtualMachine.js`
- Implementa `clone()` para Compute Engine
- Preserva configuración de proyecto, zona y tipo de máquina

#### OnPremiseVirtualMachine
**Ubicación:** `src/models/onpremise/OnPremiseVirtualMachine.js`
- Implementa `clone()` para VMs on-premise
- Mantiene configuración de hipervisor y datacenter

### 4. VMReconstructor (Utilidad)
**Ubicación:** `src/utils/VMReconstructor.js`

Reconstruye objetos VM desde datos de base de datos:
- Convierte registros de BD en instancias de clases VM
- Soporta todos los proveedores (AWS, Azure, GCP, OnPremise)
- Preserva todos los atributos incluyendo optimizaciones

### 5. ProvisioningController (Integración)
**Ubicación:** `src/controllers/ProvisioningController.js`

Nuevos endpoints implementados:

#### POST /api/prototypes/register
Registra una VM existente como plantilla
```json
{
  "vmId": "aws-vm-123456",
  "templateName": "aws-web-server-template"
}
```

#### POST /api/prototypes/clone
Clona una VM desde una plantilla
```json
{
  "templateName": "aws-web-server-template"
}
```

#### GET /api/prototypes
Lista todas las plantillas registradas

#### DELETE /api/prototypes/:templateName
Elimina una plantilla del registro

### 6. ProvisioningService (Servicio)
**Ubicación:** `src/services/ProvisioningService.js`

Nuevos métodos:
- `getVMById(vmId)` - Ahora reconstruye objetos VM completos
- `saveVM(vm)` - Persiste VMs clonadas en la base de datos

## Flujo de Uso

### Registrar una Plantilla
1. Aprovisionar una VM usando Abstract Factory o Builder
2. Registrar la VM como plantilla con un nombre único
3. La plantilla queda disponible para clonación

### Clonar desde Plantilla
1. Solicitar clonación especificando nombre de plantilla
2. PrototypeRegistry clona el objeto en memoria
3. Se genera nuevo ID único para el clon
4. El clon se persiste en la base de datos
5. Se retorna confirmación con nuevo vmId

## Ventajas de la Implementación

1. **Reutilización:** Plantillas pre-configuradas para casos de uso comunes
2. **Eficiencia:** Clonación más rápida que creación desde cero
3. **Consistencia:** Las VMs clonadas mantienen configuraciones probadas
4. **Flexibilidad:** Registro dinámico de plantillas sin modificar código
5. **Integración:** Se integra perfectamente con Factory y Builder existentes

## Relaciones según Diagrama de Clases

- **PrototypeRegistry → IPrototype:** Mantiene y clona prototipos
- **ProvisioningController → PrototypeRegistry:** Usa el registro para clonar plantillas
- **Todas las VMs implementan:** Método `clone()` de IPrototype

## Documentación Swagger

Todas las rutas están documentadas en Swagger UI disponible en `/api-docs`
