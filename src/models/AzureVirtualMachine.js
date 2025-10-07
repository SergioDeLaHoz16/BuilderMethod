const IVirtualMachine = require('./IVirtualMachine');

/**
 * Implementación concreta de máquina virtual para Azure
 * Representa una VM de Microsoft Azure
 */
class AzureVirtualMachine extends IVirtualMachine {
  /**
   * @param {string} id - Identificador único de la VM
   * @param {string} vmSize - Tamaño de la VM (Standard_B1s, etc.)
   * @param {string} resourceGroup - Grupo de recursos de Azure
   * @param {string} image - Imagen del sistema operativo
   * @param {string} virtualNetwork - Red virtual de Azure
   */
  constructor(id, vmSize, resourceGroup, image, virtualNetwork) {
    super(id, 'active');
    this.vmSize = vmSize;
    this.resourceGroup = resourceGroup;
    this.image = image;
    this.virtualNetwork = virtualNetwork;
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
      resource_group: this.resourceGroup,
      image: this.image,
      virtual_network: this.virtualNetwork
    };
  }
}

module.exports = AzureVirtualMachine;
