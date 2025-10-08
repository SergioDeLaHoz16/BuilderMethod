const INetwork = require('./INetwork');

/**
 * Implementación concreta de red para Azure
 * Representa recursos de red en Azure con Virtual Network
 */
class AzureNetwork extends INetwork {
  /**
   * @param {string} id - Identificador único de la red
   * @param {string} virtualNetwork - Nombre de la red virtual
   * @param {string} subnetName - Nombre de la subnet
   * @param {string} networkSecurityGroup - Nombre del NSG
   * @param {string} region - Región de Azure
   */
  constructor(id, virtualNetwork, subnetName, networkSecurityGroup, region, firewallRules = [], publicIP = false) {
    super(id, region);
    this.virtualNetwork = virtualNetwork;
    this.subnetName = subnetName;
    this.networkSecurityGroup = networkSecurityGroup;
    this.firewallRules = firewallRules;
    this.publicIP = publicIP;
  }

  getId() {
    return this.id;
  }

  getConfig() {
    return {
      virtualNetwork: this.virtualNetwork,
      subnetName: this.subnetName,
      networkSecurityGroup: this.networkSecurityGroup,
      region: this.region
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      network_id: this.id,
      provider: 'azure',
      region: this.region,
      config: {
        virtualNetwork: this.virtualNetwork,
        subnetName: this.subnetName,
        networkSecurityGroup: this.networkSecurityGroup
      },
      firewall_rules: this.firewallRules,
      public_ip: this.publicIP,
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = AzureNetwork;
