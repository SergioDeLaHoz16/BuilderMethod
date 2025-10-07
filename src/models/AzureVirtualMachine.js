const IVirtualMachine = require('./IVirtualMachine');

/**
 * Implementación concreta de máquina virtual para Azure
 * Representa una VM de Microsoft Azure
 */
class AzureVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {string} vmSize - Tamaño de la VM (Standard_B1s, etc.)
   * @param {string} location - Ubicación de Azure
   * @param {string} resourceGroup - Grupo de recursos de Azure
   * @param {string} imageReference - Referencia de imagen del sistema operativo
   */
  constructor(id, vmSize, location, resourceGroup, imageReference) {
    super(id, 'active');
    this.vmSize = vmSize;
    this.location = location;
    this.resourceGroup = resourceGroup;
    this.imageReference = imageReference;
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
      provider: 'azure',
      status: this.status,
      vm_size: this.vmSize,
      region: this.location,
      resource_group: this.resourceGroup,
      image: this.imageReference
    };
  }
}

module.exports = AzureVirtualMachine;
