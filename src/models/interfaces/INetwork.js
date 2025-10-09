/**
 * Interface para definir el contrato de los recursos de red
 * Aplica el principio de Dependency Inversion (SOLID)
 * @interface INetwork
 */
class INetwork {
  constructor(id, region) {
    if (this.constructor === INetwork) {
      throw new Error("No se puede instanciar una interfaz");
    }
    this.id = id;
    this.region = region;
  }

  /**
   * Obtiene el ID del recurso de red
   * @returns {string}
   */
  getId() {
    throw new Error("Método getId() debe ser implementado");
  }

  /**
   * Obtiene información de configuración de red
   * @returns {Object}
   */
  getConfig() {
    throw new Error("Método getConfig() debe ser implementado");
  }
}

module.exports = INetwork;
