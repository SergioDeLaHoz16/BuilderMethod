const INetwork = require('./INetwork');

/**
 * Implementación concreta de red para Google Cloud Platform
 * Representa recursos de red en GCP con VPC Network
 */
class GCPNetwork extends INetwork {
  /**
   * @param {string} id - Identificador único de la red
   * @param {string} networkName - Nombre de la red en GCP
   * @param {string} subnetworkName - Nombre de la subred
   * @param {string} firewallTag - Tag de firewall
   * @param {string} region - Región de GCP
   */
  constructor(id, networkName, subnetworkName, firewallTag, region) {
    super(id, region);
    this.networkName = networkName;
    this.subnetworkName = subnetworkName;
    this.firewallTag = firewallTag;
  }

  getId() {
    return this.id;
  }

  getConfig() {
    return {
      networkName: this.networkName,
      subnetworkName: this.subnetworkName,
      firewallTag: this.firewallTag,
      region: this.region
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      network_id: this.id,
      provider: 'gcp',
      region: this.region,
      config: {
        networkName: this.networkName,
        subnetworkName: this.subnetworkName,
        firewallTag: this.firewallTag
      },
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = GCPNetwork;
