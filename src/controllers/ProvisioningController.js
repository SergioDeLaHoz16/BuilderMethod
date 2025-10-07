const ProvisioningService = require('../services/ProvisioningService');

/**
 * Controlador REST para gestionar operaciones de aprovisionamiento
 * Aplica el patrón MVC (Controlador)
 * Aplica el principio de Single Responsibility: maneja HTTP y delega lógica al servicio
 */
class ProvisioningController {
  constructor() {
    this.service = new ProvisioningService();
  }

  /**
   * Aprovisiona una nueva máquina virtual
   * POST /api/provision
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async provision(req, res) {
    try {
      const { provider, params } = req.body;

      if (!provider || !params) {
        return res.status(400).json({
          error: 'Parámetros inválidos',
          message: 'Se requieren "provider" y "params"'
        });
      }

      const result = await this.service.provision(provider, params);

      if (result.status === 'error') {
        return res.status(500).json({
          status: 'error',
          message: result.errorMessage,
          provider: result.provider,
          timestamp: result.timestamp
        });
      }

      return res.status(201).json({
        status: 'success',
        vmId: result.vmId,
        provider: result.provider,
        timestamp: result.timestamp
      });

    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Obtiene todas las máquinas virtuales
   * GET /api/vms
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async getAllVMs(req, res) {
    try {
      const vms = await this.service.getAllVMs();
      return res.status(200).json({
        status: 'success',
        count: vms.length,
        data: vms
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Obtiene una máquina virtual por ID
   * GET /api/vms/:vmId
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async getVMById(req, res) {
    try {
      const { vmId } = req.params;
      const vm = await this.service.getVMById(vmId);
      return res.status(200).json({
        status: 'success',
        data: vm
      });
    } catch (error) {
      return res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Obtiene los logs de aprovisionamiento
   * GET /api/logs
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async getLogs(req, res) {
    try {
      const logs = await this.service.getLogs();
      return res.status(200).json({
        status: 'success',
        count: logs.length,
        data: logs
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = ProvisioningController;
