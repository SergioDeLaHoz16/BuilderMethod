const INetwork = require('./INetwork');

/**
 * Implementación concreta de red para AWS
 * Representa recursos de red en AWS con VPC, subnet y security groups
 */
class AWSNetwork extends INetwork {
  /**
   * @param {string} id - Identificador único de la red
   * @param {string} vpcId - ID de la VPC en AWS
   * @param {string} subnet - Subnet de la red
   * @param {string} securityGroup - ID del security group
   * @param {string} region - Región de AWS
   */
  constructor(id, vpcId, subnet, securityGroup, region) {
    super(id, region);
    this.vpcId = vpcId;
    this.subnet = subnet;
    this.securityGroup = securityGroup;
  }

  getId() {
    return this.id;
  }

  getConfig() {
    return {
      vpcId: this.vpcId,
      subnet: this.subnet,
      securityGroup: this.securityGroup,
      region: this.region
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      network_id: this.id,
      provider: 'aws',
      region: this.region,
      config: {
        vpcId: this.vpcId,
        subnet: this.subnet,
        securityGroup: this.securityGroup
      },
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = AWSNetwork;
