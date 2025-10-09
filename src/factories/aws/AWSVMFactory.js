const VMFactory = require('../VMFactory');
const AWSVirtualMachine = require('../../models/aws/AWSVirtualMachine');

/**
 * Factory concreto para crear máquinas virtuales de AWS
 * Implementa el patrón Factory Method
 */
class AWSVMFactory extends VMFactory {
  /**
   * Crea una instancia de máquina virtual AWS (EC2)
   * @param {Object} params - Parámetros de configuración
   * @param {string} params.instanceType - Tipo de instancia (t2.micro, m5.large, etc.)
   * @param {string} params.region - Región de AWS
   * @param {string} params.vpcId - ID de la VPC
   * @param {string} params.ami - Amazon Machine Image ID
   * @returns {AWSVirtualMachine}
   */
  createVM(params) {
    const vmId = `aws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AWSVirtualMachine(
      vmId,
      params.instanceType,
      params.region,
      params.vpcId,
      params.ami
    );
  }
}

module.exports = AWSVMFactory;
