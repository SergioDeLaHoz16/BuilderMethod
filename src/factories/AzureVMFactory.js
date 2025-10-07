const VMFactory = require('./VMFactory');
const AzureVirtualMachine = require('../models/AzureVirtualMachine');

/**
 * Factory concreto para crear máquinas virtuales de Azure
 * Implementa el patrón Factory Method
 */
class AzureVMFactory extends VMFactory {
  /**
   * Crea una instancia de máquina virtual Azure
   * @param {Object} params - Parámetros de configuración
   * @param {string} params.vmSize - Tamaño de la VM (Standard_B1s, etc.)
   * @param {string} params.resourceGroup - Grupo de recursos
   * @param {string} params.image - Imagen del sistema operativo
   * @param {string} params.virtualNetwork - Red virtual
   * @returns {AzureVirtualMachine}
   */
  createVM(params) {
    const vmId = `azure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new AzureVirtualMachine(
      vmId,
      params.vmSize,
      params.resourceGroup,
      params.image,
      params.virtualNetwork
    );
  }
}

module.exports = AzureVMFactory;
