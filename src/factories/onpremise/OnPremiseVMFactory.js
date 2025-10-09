const VMFactory = require('../VMFactory');
const OnPremiseVirtualMachine = require('../../models/OnPremiseVirtualMachine');

/**
 * Factory concreto para crear máquinas virtuales On-Premise
 * Implementa el patrón Factory Method
 */
class OnPremiseVMFactory extends VMFactory {
  /**
   * Crea una instancia de máquina virtual On-Premise (VMWare/KVM)
   * @param {Object} params - Parámetros de configuración
   * @param {number} params.cpu - Número de CPUs
   * @param {number} params.ram - Cantidad de RAM en GB
   * @param {string} params.disk - Configuración del disco
   * @param {string} params.network - Configuración de red física
   * @returns {OnPremiseVirtualMachine}
   */
  createVM(params) {
    const vmId = `onpremise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new OnPremiseVirtualMachine(
      vmId,
      params.cpu,
      params.ram,
      params.disk,
      params.network
    );
  }
}

module.exports = OnPremiseVMFactory;
