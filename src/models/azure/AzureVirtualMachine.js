const IVirtualMachine = require('../interfaces/IVirtualMachine');
const IPrototype = require('../interfaces/IPrototype');

/**
 * Implementación concreta de máquina virtual para Azure
 * Representa una VM de Microsoft Azure
 * Implementa el patrón Prototype para permitir la clonación
 */
class AzureVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {string} vmSize - Tamaño de la VM (Standard_B1s, etc.)
   * @param {string} location - Ubicación de Azure
   * @param {string} resourceGroup - Grupo de recursos de Azure
   * @param {string} imageReference - Referencia de imagen del sistema operativo
   * @param {number} vcpus - Número de vCPUs (obligatorio)
   * @param {number} memoryGB - Memoria RAM en GB (obligatorio)
   * @param {boolean} memoryOptimization - Optimización de memoria (opcional)
   * @param {boolean} diskOptimization - Optimización de disco (opcional)
   * @param {string} keyPairName - Clave SSH (opcional)
   */
  constructor(id, vmSize, location, resourceGroup, imageReference, vcpus, memoryGB, memoryOptimization = false, diskOptimization = false, keyPairName = null) {
    super(id, 'active');
    this.vmSize = vmSize;
    this.location = location;
    this.resourceGroup = resourceGroup;
    this.imageReference = imageReference;
    // Atributos obligatorios según el PDF
    this.vcpus = vcpus;
    this.memoryGB = memoryGB;
    // Atributos opcionales
    this.memoryOptimization = memoryOptimization;
    this.diskOptimization = diskOptimization;
    this.keyPairName = keyPairName;
  }

  getId() {
    return this.id;
  }

  getStatus() {
    return this.status;
  }

  /**
   * Implementación del patrón Prototype
   * Clona la máquina virtual actual creando una nueva instancia con los mismos atributos
   * @returns {AzureVirtualMachine} - Nueva instancia clonada
   */
  clone() {
    const { v4: uuidv4 } = require('crypto').randomUUID ? { v4: () => require('crypto').randomUUID() } : require('uuid');
    const newId = uuidv4 ? uuidv4() : `azure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AzureVirtualMachine(
      newId,
      this.vmSize,
      this.location,
      this.resourceGroup,
      this.imageReference,
      this.vcpus,
      this.memoryGB,
      this.memoryOptimization,
      this.diskOptimization,
      this.keyPairName
    );
  }

  /**
   * Convierte la instancia a un objeto plano para persistencia
   * @returns {Object}
   */
  toJSON() {
    return {
      vm_id: this.id,
      provider: 'azure',
      status: this.status,
      vm_size: this.vmSize,
      region: this.location,
      resource_group: this.resourceGroup,
      image: this.imageReference,
      vcpus: this.vcpus,
      memory_gb: this.memoryGB,
      memory_optimization: this.memoryOptimization,
      disk_optimization: this.diskOptimization,
      key_pair_name: this.keyPairName
    };
  }
}

module.exports = AzureVirtualMachine;
