const ProvisioningService = require('../services/ProvisioningService');
const ProvisioningServiceBuilder = require('../services/ProvisioningServiceBuilder');
const PrototypeRegistry = require('../patterns/PrototypeRegistry');

/**
 * Controlador REST para gestionar operaciones de aprovisionamiento
 * Aplica el patrón MVC (Controlador)
 * Soporta tres modos de aprovisionamiento:
 * - Abstract Factory (aprovisionamiento directo)
 * - Builder + Director (aprovisionamiento con tipos predefinidos)
 * - Prototype (clonación de plantillas pre-registradas)
 */
class ProvisioningController {
  constructor() {
    this.service = new ProvisioningService();
    this.serviceBuilder = new ProvisioningServiceBuilder();
    this.prototypeRegistry = new PrototypeRegistry();
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

  /**
   * Aprovisiona VM usando Builder + Director
   * POST /api/provision/builder
   * El Director asigna automáticamente vCPU y RAM según tipo y tamaño
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
  */
  async provisionWithBuilder(req, res) {
    try {
      const { provider, vmType, size, region, params } = req.body;

      // Validar parámetros requeridos
      if (!provider || !vmType || !size || !region) {
        return res.status(400).json({
          error: 'Parámetros inválidos',
          message: 'Se requieren: provider, vmType, size, region'
        });
      }

      // 🔹 Desempaquetar los parámetros correctamente
      const additionalParams = {
        ...(params?.vm && { vm: params.vm }),
        ...(params?.network && { network: params.network }),
        ...(params?.disk && { disk: params.disk }),
      };

      // 🔹 Llamar al servicio Builder + Director
      const result = await this.serviceBuilder.provisionWithBuilder(
        provider,
        vmType,
        size,
        region,
        additionalParams
      );

      // Manejo de errores del resultado
      if (result.status === 'error') {
        return res.status(500).json({
          status: 'error',
          message: result.errorMessage,
          provider: result.provider,
          timestamp: result.timestamp
        });
      }

      // Éxito
      return res.status(201).json({
        status: 'success',
        vmId: result.vmId,
        provider: result.provider,
        timestamp: result.timestamp
      });

    } catch (error) {
      console.error('❌ Error en provisionWithBuilder:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Registra una VM existente como plantilla prototype
   * POST /api/prototypes/register
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async registerPrototype(req, res) {
    try {
      const { vmId, templateName } = req.body;

      if (!vmId || !templateName) {
        return res.status(400).json({
          error: 'Parámetros inválidos',
          message: 'Se requieren "vmId" y "templateName"'
        });
      }

      const vm = await this.service.getVMById(vmId);
      this.prototypeRegistry.registerPrototype(templateName, vm);

      return res.status(201).json({
        status: 'success',
        message: `Plantilla "${templateName}" registrada correctamente`,
        templateName,
        vmId
      });

    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Clona una VM desde una plantilla prototype registrada
   * POST /api/prototypes/clone
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async cloneFromPrototype(req, res) {
    try {
      const { templateName } = req.body;

      if (!templateName) {
        return res.status(400).json({
          error: 'Parámetros inválidos',
          message: 'Se requiere "templateName"'
        });
      }

      const clonedVM = this.prototypeRegistry.clonePrototype(templateName);

      const result = await this.service.saveVM(clonedVM);

      return res.status(201).json({
        status: 'success',
        message: `VM clonada desde plantilla "${templateName}"`,
        vmId: result.vmId,
        templateName,
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
   * Lista todas las plantillas prototype registradas
   * GET /api/prototypes
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async listPrototypes(req, res) {
    try {
      const templates = this.prototypeRegistry.getPrototypeKeys();

      return res.status(200).json({
        status: 'success',
        count: templates.length,
        data: templates
      });

    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Elimina una plantilla prototype registrada
   * DELETE /api/prototypes/:templateName
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  async unregisterPrototype(req, res) {
    try {
      const { templateName } = req.params;

      if (!this.prototypeRegistry.hasPrototype(templateName)) {
        return res.status(404).json({
          status: 'error',
          message: `Plantilla "${templateName}" no encontrada`
        });
      }

      this.prototypeRegistry.unregisterPrototype(templateName);

      return res.status(200).json({
        status: 'success',
        message: `Plantilla "${templateName}" eliminada correctamente`
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
