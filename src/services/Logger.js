const supabase = require('../config/database');

/**
 * Servicio de logging para registrar operaciones de aprovisionamiento
 * Aplica el principio de Single Responsibility (SOLID)
 * No expone información sensible en los logs (RNF3)
 */
class Logger {
  /**
   * Registra una solicitud de aprovisionamiento
   * @param {string} provider - Proveedor de nube
   * @param {Object} params - Parámetros de la solicitud (sin datos sensibles)
   */
  static logRequest(provider, params) {
    const sanitizedParams = this.sanitizeParams(params);
    console.log(`[${new Date().toISOString()}] Solicitud de aprovisionamiento`, {
      provider,
      params: sanitizedParams
    });
  }

  /**
   * Registra el resultado de un aprovisionamiento en la base de datos
   * @param {Object} result - Resultado del aprovisionamiento
   * @param {string} vmId - ID de la VM creada (puede ser null si hay error)
   * @param {Object} params - Parámetros utilizados
   */
  static async logResult(result, vmId, params) {
    const sanitizedParams = this.sanitizeParams(params);

    try {
      const { error } = await supabase
        .from('provisioning_logs')
        .insert({
          vm_id: vmId || null,
          provider: result.provider,
          request_params: sanitizedParams,
          status: result.status,
          error_message: result.errorMessage,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error al guardar log en base de datos:', error);
      }

      console.log(`[${new Date().toISOString()}] Resultado del aprovisionamiento`, {
        status: result.status,
        provider: result.provider,
        vmId: result.vmId,
        error: result.errorMessage
      });
    } catch (err) {
      console.error('Error inesperado al registrar log:', err);
    }
  }

  /**
   * Sanitiza parámetros removiendo información sensible
   * Cumple con RNF3 (Seguridad)
   * @param {Object} params - Parámetros a sanitizar
   * @returns {Object} - Parámetros sanitizados
   * @private
   */
  static sanitizeParams(params) {
    const sensitive = ['apiKey', 'secretKey', 'password', 'token', 'credentials'];
    const sanitized = { ...params };

    sensitive.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}

module.exports = Logger;
