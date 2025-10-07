const VMFactory = require('./VMFactory');
const GCPVirtualMachine = require('../models/GCPVirtualMachine');

/**
 * Factory concreto para crear máquinas virtuales de Google Cloud Platform
 * Implementa el patrón Factory Method
 */
class GCPVMFactory extends VMFactory {
  /**
   * Crea una instancia de máquina virtual GCP (Compute Engine)
   * @param {Object} params - Parámetros de configuración
   * @param {string} params.machineType - Tipo de máquina (n1-standard-1, etc.)
   * @param {string} params.zone - Zona de GCP
   * @param {string} params.disk - Configuración del disco
   * @param {string} params.project - Proyecto de GCP
   * @returns {GCPVirtualMachine}
   */
  createVM(params) {
    const vmId = `gcp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new GCPVirtualMachine(
      vmId,
      params.machineType,
      params.zone,
      params.disk,
      params.project
    );
  }
}

module.exports = GCPVMFactory;
