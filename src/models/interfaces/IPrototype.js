/**
 * Interfaz para el patrón Prototype
 * Define el contrato para objetos clonables
 */
class IPrototype {
  /**
   * Método abstracto para clonar el objeto actual
   * @returns {IPrototype} - Una copia profunda del objeto
   */
  clone() {
    throw new Error('El método clone() debe ser implementado por la clase derivada');
  }
}

module.exports = IPrototype;
