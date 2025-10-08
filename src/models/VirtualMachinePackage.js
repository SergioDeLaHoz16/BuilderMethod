/**
 * Clase que encapsula el paquete completo de recursos
 * Representa el producto final del patrón Builder
 * Contiene la VM, Red y Disco construidos mediante la Abstract Factory
 */
class VirtualMachinePackage {
  constructor() {
    /** @type {IVirtualMachine | null} */
    this.vm = null;
    /** @type {INetwork | null} */
    this.network = null;
    /** @type {IDisk | null} */
    this.disk = null;
  }

  /**
   * Retorna la máquina virtual
   * @returns {IVirtualMachine}
   */
  getVirtualMachine() {
    return this.vm;
  }

  /**
   * Retorna la red
   * @returns {INetwork}
   */
  getNetwork() {
    return this.network;
  }

  /**
   * Retorna el disco
   * @returns {IDisk}
   */
  getDisk() {
    return this.disk;
  }

  /**
   * Verifica si el paquete está completamente construido
   * @returns {boolean}
   */
  isValid() {
    return this.vm !== null && this.network !== null && this.disk !== null;
  }
}

module.exports = { VirtualMachinePackage };
