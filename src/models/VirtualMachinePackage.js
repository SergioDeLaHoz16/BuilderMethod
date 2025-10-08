/**
 * Clase que encapsula el paquete completo de recursos
 * Contiene VM, Network y Disk construidos por el Builder
 * Representa el producto final del patrón Builder
 */
class VirtualMachinePackage {
  /**
   * @param {IVirtualMachine} virtualMachine - Máquina virtual
   * @param {INetwork} network - Recurso de red
   * @param {IDisk} disk - Recurso de disco
   */
  constructor(virtualMachine, network, disk) {
    this.virtualMachine = virtualMachine;
    this.network = network;
    this.disk = disk;
  }

  /**
   * Obtiene la máquina virtual
   * @returns {IVirtualMachine}
   */
  getVirtualMachine() {
    return this.virtualMachine;
  }

  /**
   * Obtiene el recurso de red
   * @returns {INetwork}
   */
  getNetwork() {
    return this.network;
  }

  /**
   * Obtiene el recurso de disco
   * @returns {IDisk}
   */
  getDisk() {
    return this.disk;
  }

  /**
   * Valida que todos los recursos sean del mismo proveedor
   * @returns {boolean}
   */
  isValid() {
    return this.virtualMachine && this.network && this.disk;
  }
}

module.exports = VirtualMachinePackage;
