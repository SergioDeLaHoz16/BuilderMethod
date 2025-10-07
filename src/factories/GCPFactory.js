const AbstractFactory = require('./AbstractFactory');
const GCPVirtualMachine = require('../models/GCPVirtualMachine');
const GCPNetwork = require('../models/GCPNetwork');
const GCPDisk = require('../models/GCPDisk');

/**
 * Factory concreto para crear familia completa de recursos Google Cloud Platform
 * Implementa el patrón Abstract Factory para GCP
 *
 * Garantiza consistencia: todos los recursos creados pertenecen a GCP
 * y son compatibles entre sí
 */
class GCPFactory extends AbstractFactory {
  /**
   * Crea una máquina virtual GCP (Compute Engine)
   * @param {Object} params - Parámetros de la VM
   * @param {string} params.machineType - Tipo de máquina GCP
   * @param {string} params.zone - Zona de GCP
   * @param {string} params.project - ID del proyecto
   * @param {string} params.image - Imagen del sistema operativo
   * @returns {GCPVirtualMachine}
   */
  createVirtualMachine(params) {
    const vmId = `gcp-vm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new GCPVirtualMachine(
      vmId,
      params.machineType,
      params.zone,
      params.project,
      params.image
    );
  }

  /**
   * Crea un recurso de red GCP (VPC Network)
   * @param {Object} params - Parámetros de red
   * @param {string} params.networkName - Nombre de la red
   * @param {string} params.subnetworkName - Nombre de la subred
   * @param {string} params.firewallTag - Tag de firewall
   * @param {string} params.region - Región de GCP
   * @returns {GCPNetwork}
   */
  createNetwork(params) {
    const networkId = `gcp-net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new GCPNetwork(
      networkId,
      params.networkName,
      params.subnetworkName,
      params.firewallTag,
      params.region
    );
  }

  /**
   * Crea un disco persistente GCP
   * @param {Object} params - Parámetros del disco
   * @param {string} params.diskType - Tipo de disco (pd-standard, pd-ssd)
   * @param {number} params.sizeGB - Tamaño en GB
   * @param {boolean} params.autoDelete - Si se elimina automáticamente
   * @returns {GCPDisk}
   */
  createDisk(params) {
    const diskId = `gcp-disk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new GCPDisk(
      diskId,
      params.diskType,
      params.sizeGB,
      params.autoDelete
    );
  }
}

module.exports = GCPFactory;
