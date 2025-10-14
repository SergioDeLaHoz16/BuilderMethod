/**
 * Registro de prototipos para el patrón Prototype
 * Mantiene un catálogo de plantillas de VMs que pueden ser clonadas
 */
class PrototypeRegistry {
  constructor() {
    this.prototypes = new Map();
  }

  /**
   * Registra un prototipo con una clave única
   * @param {string} key - Clave identificadora del prototipo
   * @param {IPrototype} prototype - Objeto prototipo a registrar
   */
  registerPrototype(key, prototype) {
    if (!prototype || typeof prototype.clone !== 'function') {
      throw new Error('El prototipo debe implementar el método clone()');
    }
    this.prototypes.set(key, prototype);
  }

  /**
   * Clona un prototipo registrado
   * @param {string} key - Clave del prototipo a clonar
   * @returns {IPrototype} - Clon del prototipo
   */
  clonePrototype(key) {
    const prototype = this.prototypes.get(key);
    if (!prototype) {
      throw new Error(`Prototipo con clave "${key}" no encontrado en el registro`);
    }
    return prototype.clone();
  }

  /**
   * Obtiene todas las claves de prototipos registrados
   * @returns {string[]} - Array con las claves de los prototipos
   */
  getPrototypeKeys() {
    return Array.from(this.prototypes.keys());
  }

  /**
   * Verifica si existe un prototipo con la clave especificada
   * @param {string} key - Clave a verificar
   * @returns {boolean}
   */
  hasPrototype(key) {
    return this.prototypes.has(key);
  }

  /**
   * Elimina un prototipo del registro
   * @param {string} key - Clave del prototipo a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  unregisterPrototype(key) {
    return this.prototypes.delete(key);
  }
}

module.exports = PrototypeRegistry;
