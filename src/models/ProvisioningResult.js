/**
 * Clase que encapsula el resultado de un aprovisionamiento
 * Aplica el principio de Single Responsibility (SOLID)
 */
class ProvisioningResult {
  /**
   * @param {string} status - Estado del aprovisionamiento (success, error)
   * @param {string} vmId - ID de la VM creada
   * @param {string} provider - Proveedor de nube utilizado
   * @param {Date} timestamp - Marca de tiempo del aprovisionamiento
   * @param {string} errorMessage - Mensaje de error si falla
   */
  constructor(status, vmId, provider, timestamp, errorMessage = null) {
    this.status = status;
    this.vmId = vmId;
    this.provider = provider;
    this.timestamp = timestamp;
    this.errorMessage = errorMessage;
  }

  getStatus() {
    return this.status;
  }

  getVmId() {
    return this.vmId;
  }

  getProvider() {
    return this.provider;
  }

  getErrorMessageId() {
    return this.errorMessage;
  }

  /**
   * Convierte el resultado a formato JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      status: this.status,
      vmId: this.vmId,
      provider: this.provider,
      timestamp: this.timestamp,
      errorMessage: this.errorMessage
    };
  }
}

module.exports = ProvisioningResult;
