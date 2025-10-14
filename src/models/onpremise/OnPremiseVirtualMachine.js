const IVirtualMachine = require('../interfaces/IVirtualMachine');
// const IPrototype = require('../interfaces/IPrototype');

const IPrototype = require('../interfaces/IPrototype');
/**
 * Implementación concreta de máquina virtual On-Premise
 * Representa una VM local usando VMWare o KVM
 * Implementa el patrón Prototype para permitir la clonación
 */
class OnPremiseVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {string} instanceType - Tipo de instancia (onprem-std1, etc.)
   * @param {number} vcpus - Número de vCPUs (obligatorio)
   * @param {number} memoryGB - Memoria RAM en GB (obligatorio)
   * @param {string} hypervisor - Hipervisor (KVM, VMWare, etc.)
   * @param {string} datacenter - Centro de datos
   * @param {boolean} memoryOptimization - Optimización de memoria (opcional)
   * @param {boolean} diskOptimization - Optimización de disco (opcional)
   * @param {string} keyPairName - Clave SSH (opcional)
   */
  constructor(id, instanceType, vcpus, memoryGB, hypervisor, datacenter, memoryOptimization = false, diskOptimization = false, keyPairName = null) {
    super(id, 'active');
    this.instanceType = instanceType;
    this.vcpus = vcpus;
    this.memoryGB = memoryGB;
    this.hypervisor = hypervisor;
    this.datacenter = datacenter;
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
   * @returns {OnPremiseVirtualMachine} - Nueva instancia clonada
   */
  clone() {
    const { v4: uuidv4 } = require('crypto').randomUUID ? { v4: () => require('crypto').randomUUID() } : require('uuid');
    const newId = uuidv4 ? uuidv4() : `onprem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new OnPremiseVirtualMachine(
      newId,
      this.instanceType,
      this.vcpus,
      this.memoryGB,
      this.hypervisor,
      this.datacenter,
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
      provider: 'onpremise',
      status: this.status,
      instance_type: this.instanceType,
      vcpus: this.vcpus,
      memory_gb: this.memoryGB,
      hypervisor: this.hypervisor,
      datacenter: this.datacenter,
      memory_optimization: this.memoryOptimization,
      disk_optimization: this.diskOptimization,
      key_pair_name: this.keyPairName
    };
  }
}

module.exports = OnPremiseVirtualMachine;
