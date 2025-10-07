const IVirtualMachine = require('./IVirtualMachine');

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
   */
  constructor(id, instanceType, region, vpcId, ami) {
    super(id, 'active');
    this.instanceType = instanceType;
    this.region = region;
    this.vpcId = vpcId;
    this.ami = ami;
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
      ami: this.ami
    };
  }
}

module.exports = AWSVirtualMachine;
