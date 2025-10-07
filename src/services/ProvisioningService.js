const supabase = require('../config/database');
const AWSVMFactory = require('../factories/AWSVMFactory');
const AzureVMFactory = require('../factories/AzureVMFactory');
const GCPVMFactory = require('../factories/GCPVMFactory');
const OnPremiseVMFactory = require('../factories/OnPremiseVMFactory');
const ProvisioningResult = require('../models/ProvisioningResult');
const Logger = require('./Logger');

/**
 * Servicio principal de aprovisionamiento de máquinas virtuales
 * Aplica el patrón MVC (Modelo) y principios SOLID:
 * - Single Responsibility: gestiona la lógica de aprovisionamiento
 * - Open/Closed: extensible a nuevos proveedores sin modificación
 * - Dependency Inversion: depende de abstracciones (VMFactory)
 */
class ProvisioningService {
  constructor() {
    this.factories = {
      aws: new AWSVMFactory(),
      azure: new AzureVMFactory(),
      gcp: new GCPVMFactory(),
      onpremise: new OnPremiseVMFactory()
    };
  }

  /**
   * Aprovisiona una máquina virtual en el proveedor especificado
   * @param {string} provider - Proveedor de nube (aws, azure, gcp, onpremise)
   * @param {Object} params - Parámetros específicos del proveedor
   * @returns {Promise<ProvisioningResult>}
   */
  async provision(provider, params) {
    Logger.logRequest(provider, params);

    try {
      const factory = this.factories[provider.toLowerCase()];

      if (!factory) {
        throw new Error(`Proveedor '${provider}' no soportado`);
      }

      const vm = factory.createVM(params);

      await this.saveVMToDatabase(vm);

      const result = new ProvisioningResult(
        'success',
        vm.getId(),
        provider,
        new Date()
      );

      const { data: vmData } = await supabase
        .from('virtual_machines')
        .select('id')
        .eq('vm_id', vm.getId())
        .maybeSingle();

      await Logger.logResult(result, vmData?.id, params);

      return result;

    } catch (error) {
      const result = new ProvisioningResult(
        'error',
        null,
        provider,
        new Date(),
        error.message
      );

      await Logger.logResult(result, null, params);

      return result;
    }
  }

  /**
   * Guarda la máquina virtual en la base de datos
   * @param {IVirtualMachine} vm - Instancia de máquina virtual
   * @private
   */
  async saveVMToDatabase(vm) {
    const { error } = await supabase
      .from('virtual_machines')
      .insert(vm.toJSON());

    if (error) {
      throw new Error(`Error al guardar VM en base de datos: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las máquinas virtuales
   * @returns {Promise<Array>}
   */
  async getAllVMs() {
    const { data, error } = await supabase
      .from('virtual_machines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener VMs: ${error.message}`);
    }

    return data;
  }

  /**
   * Obtiene una máquina virtual por su ID
   * @param {string} vmId - ID de la máquina virtual
   * @returns {Promise<Object>}
   */
  async getVMById(vmId) {
    const { data, error } = await supabase
      .from('virtual_machines')
      .select('*')
      .eq('vm_id', vmId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al obtener VM: ${error.message}`);
    }

    if (!data) {
      throw new Error(`VM con ID '${vmId}' no encontrada`);
    }

    return data;
  }

  /**
   * Obtiene los logs de aprovisionamiento
   * @returns {Promise<Array>}
   */
  async getLogs() {
    const { data, error } = await supabase
      .from('provisioning_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(`Error al obtener logs: ${error.message}`);
    }

    return data;
  }
}

module.exports = ProvisioningService;
