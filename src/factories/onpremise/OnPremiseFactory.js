const AbstractFactory = require('../AbstractFactory');
const OnPremiseVirtualMachine = require('../../models/onpremise/OnPremiseVirtualMachine');
const OnPremiseNetwork = require('../../models/onpremise/OnPremiseNetwork');
const OnPremiseDisk = require('../../models/onpremise/OnPremiseDisk');

/**
 * Factory concreto para crear familia completa de recursos On-Premise
 * Implementa el patrón Abstract Factory para infraestructura local
 *
 * Garantiza consistencia: todos los recursos creados pertenecen a la
 * infraestructura on-premise y son compatibles entre sí
 */
class OnPremiseFactory extends AbstractFactory {
  /**
   * Crea una máquina virtual en infraestructura local
   * @param {Object} params - Parámetros de la VM
   * @param {number} params.cpu - Número de CPUs
   * @param {number} params.ram - Memoria RAM en GB
   * @param {string} params.hypervisor - Tipo de hipervisor (VMware, Hyper-V, KVM)
   * @param {string} params.network - Red asignada
   * @returns {OnPremiseVirtualMachine}
   */
  createVirtualMachine(params) {
    const vmId = `onprem-vm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new OnPremiseVirtualMachine(
      vmId,
      params.cpu,
      params.ram,
      params.hypervisor,
      params.network
    );
  }

  /**
   * Crea un recurso de red on-premise (VLAN, interfaces físicas)
   * @param {Object} params - Parámetros de red
   * @param {string} params.physicalInterface - Interface física
   * @param {number} params.vlanId - ID de VLAN
   * @param {string} params.firewallPolicy - Política de firewall
   * @param {string} params.region - Ubicación física
   * @returns {OnPremiseNetwork}
   */
  createNetwork(params) {
    const networkId = `onprem-net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new OnPremiseNetwork(
      networkId,
      params.physicalInterface,
      params.vlanId,
      params.firewallPolicy,
      params.region
    );
  }

  /**
   * Crea un disco en storage local o SAN
   * @param {Object} params - Parámetros del disco
   * @param {string} params.storagePool - Pool de almacenamiento
   * @param {number} params.sizeGB - Tamaño en GB
   * @param {string} params.raidLevel - Nivel de RAID
   * @returns {OnPremiseDisk}
   */
  createDisk(params) {
    const diskId = `onprem-disk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new OnPremiseDisk(
      diskId,
      params.storagePool,
      params.sizeGB,
      params.raidLevel
    );
  }
}

module.exports = OnPremiseFactory;
