const IVirtualMachine = require('./IVirtualMachine');

/**
 * Implementación concreta de máquina virtual On-Premise
 * Representa una VM local usando VMWare o KVM
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
