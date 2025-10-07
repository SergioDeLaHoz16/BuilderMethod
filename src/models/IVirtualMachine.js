/**
 * Interface para definir el contrato de las máquinas virtuales
 * Aplica el principio de Dependency Inversion (SOLID)
 * @interface IVirtualMachine
 */
class IVirtualMachine {
  constructor(id, status) {
    if (this.constructor === IVirtualMachine) {
      throw new Error("No se puede instanciar una interfaz");
    }
    this.id = id;
    this.status = status;
  }

  /**
   * Obtiene el ID de la máquina virtual
   * @returns {string}
   */
  getId() {
    throw new Error("Método getId() debe ser implementado");
  }

  /**
   * Obtiene el estado de la máquina virtual
   * @returns {string}
   */
  getStatus() {
    throw new Error("Método getStatus() debe ser implementado");
  }
}

module.exports = IVirtualMachine;
