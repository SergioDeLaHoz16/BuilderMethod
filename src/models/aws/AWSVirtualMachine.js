const IVirtualMachine = require('../interfaces/IVirtualMachine');

/**
 * Implementación concreta de máquina virtual para AWS
 * Representa una instancia EC2 de Amazon Web Services
 */
class AWSVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {string} instanceType - Tipo de instancia (t2.micro, m5.large, etc.)
   * @param {string} region - Región de AWS
   * @param {string} vpcId - ID de la VPC
   * @param {string} ami - Amazon Machine Image ID
   * @param {number} vcpus - Número de vCPUs (obligatorio)
   * @param {number} memoryGB - Memoria RAM en GB (obligatorio)
   * @param {boolean} memoryOptimization - Optimización de memoria (opcional)
   * @param {boolean} diskOptimization - Optimización de disco (opcional)
   * @param {string} keyPairName - Clave SSH (opcional)
   */
  constructor(id, instanceType, region, vpcId, ami, vcpus, memoryGB, memoryOptimization = false, diskOptimization = false, keyPairName = null) {
    super(id, 'active');
    this.instanceType = instanceType;
    this.region = region;
    this.vpcId = vpcId;
    this.ami = ami;
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
   * Convierte la instancia a un objeto plano para persistencia
   * @returns {Object}
   */
  toJSON() {
    return {
      vm_id: this.id,
      provider: 'aws',
      status: this.status,
      instance_type: this.instanceType,
      region: this.region,
      vpc_id: this.vpcId,
      ami: this.ami,
      vcpus: this.vcpus,
      memory_gb: this.memoryGB,
      memory_optimization: this.memoryOptimization,
      disk_optimization: this.diskOptimization,
      key_pair_name: this.keyPairName
    };
  }
}

module.exports = AWSVirtualMachine;
