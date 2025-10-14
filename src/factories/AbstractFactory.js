/**
 * Abstract Factory para crear familias de recursos relacionados
 * Patrón Abstract Factory: Proporciona una interfaz para crear familias de objetos relacionados
 * sin especificar sus clases concretas
 *
 * Aplica principios SOLID:
 * - Open/Closed: Permite agregar nuevos proveedores sin modificar código existente
 * - Dependency Inversion: Las clases dependen de abstracciones, no de implementaciones concretas
 *
 * @abstract
 */
class AbstractFactory {
  /**
   * Crea una máquina virtual con parámetros específicos del proveedor
   * @param {Object} params - Parámetros de configuración de la VM
   * @returns {IVirtualMachine}
   * @abstract
   */
  createVirtualMachine(params) {
    throw new Error("El método createVirtualMachine() debe ser implementado por las subclases");
  }

  /**
   * Crea un recurso de red con parámetros específicos del proveedor
   * @param {Object} params - Parámetros de configuración de la red
   * @returns {INetwork}
   * @abstract
   */
  createNetwork(params) {
    throw new Error("El método createNetwork() debe ser implementado por las subclases");
  }

  /**
   * Crea un disco de almacenamiento con parámetros específicos del proveedor
   * @param {Object} params - Parámetros de configuración del disco
   * @returns {IDisk}
   * @abstract
   */
  createDisk(params) {
    throw new Error("El método createDisk() debe ser implementado por las subclases");
  }
}

module.exports =  AbstractFactory ;
