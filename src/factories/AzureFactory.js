const AbstractFactory = require('./AbstractFactory');
const AzureVirtualMachine = require('../models/AzureVirtualMachine');
const AzureNetwork = require('../models/AzureNetwork');
const AzureDisk = require('../models/AzureDisk');

/**
 * Factory concreto para crear familia completa de recursos Azure
 * Implementa el patrón Abstract Factory para Azure
 *
 * Garantiza consistencia: todos los recursos creados pertenecen a Azure
 * y son compatibles entre sí
 */
class AzureFactory extends AbstractFactory {
  /**
   * Crea una máquina virtual Azure
   * @param {Object} params - Parámetros de la VM
   * @param {string} params.vmSize - Tamaño de VM Azure
   * @param {string} params.location - Ubicación de Azure
   * @param {string} params.resourceGroup - Grupo de recursos
   * @param {string} params.imageReference - Referencia de imagen
   * @returns {AzureVirtualMachine}
   */
  createVirtualMachine(params) {
    const vmId = `azure-vm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AzureVirtualMachine(
      vmId,
      params.vmSize,
      params.location,
      params.resourceGroup,
      params.imageReference
    );
  }

  /**
   * Crea un recurso de red Azure (Virtual Network)
   * @param {Object} params - Parámetros de red
   * @param {string} params.virtualNetwork - Nombre de la red virtual
   * @param {string} params.subnetName - Nombre de la subnet
   * @param {string} params.networkSecurityGroup - NSG
   * @param {string} params.region - Región de Azure
   * @returns {AzureNetwork}
   */
  createNetwork(params) {
    const networkId = `azure-net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AzureNetwork(
      networkId,
      params.virtualNetwork,
      params.subnetName,
      params.networkSecurityGroup,
      params.region
    );
  }

  /**
   * Crea un disco administrado Azure
   * @param {Object} params - Parámetros del disco
   * @param {string} params.diskSku - SKU del disco (Standard_LRS, Premium_LRS)
   * @param {number} params.sizeGB - Tamaño en GB
   * @param {boolean} params.managedDisk - Si es disco administrado
   * @returns {AzureDisk}
   */
  createDisk(params) {
    const diskId = `azure-disk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AzureDisk(
      diskId,
      params.diskSku,
      params.sizeGB,
      params.managedDisk
    );
  }
}

module.exports = AzureFactory;
