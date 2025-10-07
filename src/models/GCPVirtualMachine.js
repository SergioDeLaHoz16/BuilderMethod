const IVirtualMachine = require('./IVirtualMachine');

/**
 * Implementación concreta de máquina virtual para Google Cloud Platform
 * Representa una instancia de Compute Engine
 */
class GCPVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {string} machineType - Tipo de máquina (n1-standard-1, etc.)
   * @param {string} zone - Zona de GCP
   * @param {string} disk - Configuración del disco
   * @param {string} project - Proyecto de GCP
   */
  constructor(id, machineType, zone, disk, project) {
    super(id, 'active');
    this.machineType = machineType;
    this.zone = zone;
    this.disk = disk;
    this.project = project;
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
      provider: 'gcp',
      status: this.status,
      machine_type: this.machineType,
      zone: this.zone,
      disk: this.disk,
      project: this.project
    };
  }
}

module.exports = GCPVirtualMachine;
