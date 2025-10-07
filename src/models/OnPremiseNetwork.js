const INetwork = require('./INetwork');

/**
 * Implementación concreta de red para infraestructura On-Premise
 * Representa recursos de red en infraestructura local
 */
class OnPremiseNetwork extends INetwork {
  /**
   * @param {string} id - Identificador único de la red
   * @param {string} physicalInterface - Interface física de red
   * @param {number} vlanId - ID de la VLAN
   * @param {string} firewallPolicy - Política de firewall aplicada
   * @param {string} region - Ubicación física
   */
  constructor(id, physicalInterface, vlanId, firewallPolicy, region) {
    super(id, region);
    this.physicalInterface = physicalInterface;
    this.vlanId = vlanId;
    this.firewallPolicy = firewallPolicy;
  }

  getId() {
    return this.id;
  }

  getConfig() {
    return {
      physicalInterface: this.physicalInterface,
      vlanId: this.vlanId,
      firewallPolicy: this.firewallPolicy,
      region: this.region
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      network_id: this.id,
      provider: 'onpremise',
      region: this.region,
      config: {
        physicalInterface: this.physicalInterface,
        vlanId: this.vlanId,
        firewallPolicy: this.firewallPolicy
      },
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = OnPremiseNetwork;
