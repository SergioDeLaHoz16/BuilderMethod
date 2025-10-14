const IVirtualMachine = require('../interfaces/IVirtualMachine');
const IPrototype = require('../interfaces/IPrototype');

/**
 * Implementación concreta de máquina virtual para Google Cloud Platform
 * Representa una instancia de Compute Engine
 * Implementa el patrón Prototype para permitir la clonación
 */
class GCPVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {string} machineType - Tipo de máquina (n1-standard-1, etc.)
   * @param {string} zone - Zona de GCP
   * @param {string} disk - Configuración del disco
   * @param {string} project - Proyecto de GCP
   * @param {number} vcpus - Número de vCPUs (obligatorio)
   * @param {number} memoryGB - Memoria RAM en GB (obligatorio)
   * @param {boolean} memoryOptimization - Optimización de memoria (opcional)
   * @param {boolean} diskOptimization - Optimización de disco (opcional)
   * @param {string} keyPairName - Clave SSH (opcional)
   */
  constructor(id, machineType, zone, disk, project, vcpus, memoryGB, memoryOptimization = false, diskOptimization = false, keyPairName = null) {
    super(id, 'active');
    this.machineType = machineType;
    this.zone = zone;
    this.disk = disk;
    this.project = project;
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
   * @returns {GCPVirtualMachine} - Nueva instancia clonada
   */
  clone() {
    const { v4: uuidv4 } = require('crypto').randomUUID ? { v4: () => require('crypto').randomUUID() } : require('uuid');
    const newId = uuidv4 ? uuidv4() : `gcp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new GCPVirtualMachine(
      newId,
      this.machineType,
      this.zone,
      this.disk,
      this.project,
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
      provider: 'gcp',
      status: this.status,
      machine_type: this.machineType,
      zone: this.zone,
      disk: this.disk,
      project: this.project,
      vcpus: this.vcpus,
      memory_gb: this.memoryGB,
      memory_optimization: this.memoryOptimization,
      disk_optimization: this.diskOptimization,
      key_pair_name: this.keyPairName
    };
  }
}

module.exports = GCPVirtualMachine;
