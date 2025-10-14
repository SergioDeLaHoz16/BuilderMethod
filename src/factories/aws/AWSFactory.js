const AbstractFactory = require('../AbstractFactory');
const AWSVirtualMachine = require('../../models/aws/AWSVirtualMachine');
const AWSNetwork = require('../../models/aws/AWSNetwork');
const AWSDisk = require('../../models/aws/AWSDisk');

/**
 * Factory concreto para crear familia completa de recursos AWS
 * Implementa el patrón Abstract Factory para AWS
 *
 * Garantiza consistencia: todos los recursos creados pertenecen a AWS
 * y son compatibles entre sí
 */
class AWSFactory extends AbstractFactory {
  /**
   * Crea una máquina virtual AWS EC2
   * @param {Object} params - Parámetros de la VM
   * @param {string} params.instanceType - Tipo de instancia EC2
   * @param {string} params.region - Región de AWS
   * @param {string} params.vpcId - ID de la VPC
   * @param {string} params.ami - Amazon Machine Image
   * @returns {AWSVirtualMachine}
   */
  createVirtualMachine(params) {
    const vmId = `aws-vm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AWSVirtualMachine(
      vmId,
      params.instanceType,
      params.region,
      params.vpcId,
      params.ami
    );
  }

  /**
   * Crea un recurso de red AWS (VPC, subnet, security group)
   * @param {Object} params - Parámetros de red
   * @param {string} params.vpcId - ID de la VPC
   * @param {string} params.subnet - Subnet CIDR
   * @param {string} params.securityGroup - ID del security group
   * @param {string} params.region - Región de AWS
   * @returns {AWSNetwork}
   */
  createNetwork(params) {
    const networkId = `aws-net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AWSNetwork(
      networkId,
      params.vpcId,
      params.subnet,
      params.securityGroup,
      params.region
    );
  }

  /**
   * Crea un disco AWS EBS
   * @param {Object} params - Parámetros del disco
   * @param {string} params.volumeType - Tipo de volumen (gp2, io1, etc.)
   * @param {number} params.sizeGB - Tamaño en GB
   * @param {boolean} params.encrypted - Si está encriptado
   * @returns {AWSDisk}
   */
  createDisk(params) {
    const diskId = `aws-disk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AWSDisk(
      diskId,
      params.volumeType,
      params.sizeGB,
      params.encrypted
    );
  }
}

module.exports = AWSFactory;
