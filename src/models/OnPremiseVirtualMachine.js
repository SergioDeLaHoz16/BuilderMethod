const IVirtualMachine = require('./IVirtualMachine');

/**
 * Implementación concreta de máquina virtual On-Premise
 * Representa una VM local usando VMWare o KVM
 */
class OnPremiseVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {number} cpu - Número de CPUs
   * @param {number} ram - Cantidad de RAM en GB
   * @param {string} disk - Configuración del disco
   * @param {string} network - Configuración de red física
   */
  constructor(id, cpu, ram, disk, network) {
    super(id, 'active');
    this.cpu = cpu;
    this.ram = ram;
    this.disk = disk;
    this.network = network;
  }

  getId() {
    return this.id;
  }

  getStatus() {
    return this.status;
  }

  /**
   * Convierte la instancia a un objeto plano para persistencia
   * @returns {Object}
   */
  toJSON() {
    return {
      vm_id: this.id,
      provider: 'onpremise',
      status: this.status,
      cpu: this.cpu,
      ram: this.ram,
      disk: this.disk,
      network: this.network
    };
  }
}

module.exports = OnPremiseVirtualMachine;
