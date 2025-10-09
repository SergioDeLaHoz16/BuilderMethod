/**
 * Interface para definir el contrato de los recursos de almacenamiento (discos)
 * Aplica el principio de Dependency Inversion (SOLID)
 * @interface IDisk
 */
class IDisk {
  constructor(id, sizeGB) {
    if (this.constructor === IDisk) {
      throw new Error("No se puede instanciar una interfaz");
    }
    this.id = id;
    this.sizeGB = sizeGB;
  }

  /**
   * Obtiene el ID del disco
   * @returns {string}
   */
  getId() {
    throw new Error("Método getId() debe ser implementado");
  }

  /**
   * Obtiene el tamaño del disco en GB
   * @returns {number}
   */
  getSize() {
    throw new Error("Método getSize() debe ser implementado");
  }

  /**
   * Obtiene información de configuración del disco
   * @returns {Object}
   */
  getConfig() {
    throw new Error("Método getConfig() debe ser implementado");
  }
}

module.exports = IDisk;
