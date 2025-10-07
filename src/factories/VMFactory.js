/**
 * Factory Method abstracto para creación de máquinas virtuales
 * Aplica el patrón Factory Method y el principio Open/Closed (SOLID)
 * Permite extender el sistema agregando nuevos proveedores sin modificar código existente
 * @abstract
 */
class VMFactory {
  /**
   * Método factory abstracto que debe ser implementado por las subclases
   * @param {Object} params - Parámetros específicos del proveedor
   * @returns {IVirtualMachine}
   * @abstract
   */
  createVM(params) {
    throw new Error("El método createVM() debe ser implementado por las subclases");
  }
}

module.exports = VMFactory;
