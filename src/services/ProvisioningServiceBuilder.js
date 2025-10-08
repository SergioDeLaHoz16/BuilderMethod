// const supabase = require('../config/database');
// const AWSVirtualMachineBuilder = require('../builders/AWSVirtualMachineBuilder');
// const AzureVirtualMachineBuilder = require('../builders/AzureVirtualMachineBuilder');
// const GCPVirtualMachineBuilder = require('../builders/GCPVirtualMachineBuilder');
// const OnPremiseVirtualMachineBuilder = require('../builders/OnPremiseVirtualMachineBuilder');
// const Director = require('../directors/Director');
// const ProvisioningResult = require('../models/ProvisioningResult');
// const Logger = require('./Logger');

const supabase = require('../config/database');
const { AWSVirtualMachineBuilder } = require('../builders/AWSVirtualMachineBuilder');
const { AzureVirtualMachineBuilder } = require('../builders/AzureVirtualMachineBuilder');
const { GCPVirtualMachineBuilder } = require('../builders/GCPVirtualMachineBuilder');
const { OnPremiseVirtualMachineBuilder } = require('../builders/OnPremiseVirtualMachineBuilder');

const { AWSFactory } = require('../factories/AWSFactory');
const { AzureFactory } = require('../factories/AzureFactory');
const { GCPFactory } = require('../factories/GCPFactory');
const { OnPremiseFactory } = require('../factories/OnPremiseFactory');

const Director = require('../directors/Director');
const ProvisioningResult = require('../models/ProvisioningResult');
const Logger = require('./Logger');


/**
 * Servicio de aprovisionamiento usando Builder + Director
 * Combina múltiples patrones de diseño:
 * - Builder: Construcción paso a paso de recursos complejos
 * - Director: Orquesta la construcción según tipo de VM
 * - Abstract Factory: Garantiza coherencia entre recursos
 * - SOLID: Principios de diseño orientado a objetos
 */
class ProvisioningServiceBuilder {
  constructor() {
    this.builders = {
      aws: new AWSVirtualMachineBuilder(new AWSFactory()),
      azure: new AzureVirtualMachineBuilder(new AzureFactory()),
      gcp: new GCPVirtualMachineBuilder(new GCPFactory()),
      onpremise: new OnPremiseVirtualMachineBuilder(new OnPremiseFactory())
    };
  }
  /**
   * Aprovisiona VM usando Builder + Director
   * El Director determina automáticamente vCPU y RAM según tipo
   *
   * @param {string} provider - Proveedor (aws, azure, gcp, onpremise)
   * @param {string} vmType - Tipo de VM (standard, memory-optimized, compute-optimized)
   * @param {string} size - Tamaño (small, medium, large)
   * @param {string} region - Región
   * @param {Object} additionalParams - Parámetros opcionales
   * @returns {Promise<ProvisioningResult>}
   */
  async provisionWithBuilder(provider, vmType, size, region, additionalParams = {}) {
    Logger.logRequest(provider, { vmType, size, region, ...additionalParams });

    try {
      // Obtener builder del proveedor
      const builder = this.builders[provider.toLowerCase()];
      if (!builder) {
        throw new Error(`Proveedor '${provider}' no soportado`);
      }

      // Crear director con el builder
      const director = new Director(builder);

      // Construir VM según el tipo usando el director
      let vmPackage;
      switch (vmType.toLowerCase()) {
        case 'standard':
          vmPackage = director.constructStandardVM(provider, size, region, additionalParams);
          break;
        case 'memory-optimized':
          vmPackage = director.constructMemoryOptimizedVM(provider, size, region, additionalParams);
          break;
        case 'compute-optimized':
          vmPackage = director.constructComputeOptimizedVM(provider, size, region, additionalParams);
          break;
        default:
          throw new Error(`Tipo de VM '${vmType}' no soportado. Use: standard, memory-optimized, compute-optimized`);
      }

      // Validar el paquete
      if (!vmPackage.isValid()) {
        throw new Error('Paquete de VM inválido');
      }

      // Guardar recursos en base de datos
      await this.saveVMPackage(vmPackage);

      const vm = vmPackage.getVirtualMachine();
      const result = new ProvisioningResult(
        'success',
        vm.getId(),
        provider,
        new Date()
      );

      // Obtener ID de la VM en BD para logging
      const { data: vmData } = await supabase
        .from('virtual_machines')
        .select('id')
        .eq('vm_id', vm.getId())
        .maybeSingle();

      await Logger.logResult(result, vmData?.id, { vmType, size, region });

      return result;

    } catch (error) {
      const result = new ProvisioningResult(
        'error',
        null,
        provider,
        new Date(),
        error.message
      );

      await Logger.logResult(result, null, { vmType, size, region, error: error.message });

      return result;
    }
  }

  /**
   * Guarda el paquete completo de VM en la base de datos
   * @param {VirtualMachinePackage} vmPackage - Paquete de recursos
   * @private
   */
  async saveVMPackage(vmPackage) {
    const vm = vmPackage.getVirtualMachine();
    const network = vmPackage.getNetwork();
    const disk = vmPackage.getDisk();

    // Guardar VM
    const { error: vmError } = await supabase
      .from('virtual_machines')
      .insert(vm.toJSON());

    if (vmError) {
      throw new Error(`Error al guardar VM: ${vmError.message}`);
    }

    // Guardar Network
    const { error: networkError } = await supabase
      .from('networks')
      .insert(network.toJSON());

    if (networkError) {
      throw new Error(`Error al guardar Network: ${networkError.message}`);
    }

    // Guardar Disk
    const { error: diskError } = await supabase
      .from('disks')
      .insert(disk.toJSON());

    if (diskError) {
      throw new Error(`Error al guardar Disk: ${diskError.message}`);
    }
  }

  /**
   * Obtiene todas las VMs
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
   * Obtiene una VM por ID
   * @param {string} vmId - ID de la VM
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
   * Obtiene logs de aprovisionamiento
   * @returns {Promise<Array>}
   */
  async getLogs() {
    const { data, error } = await supabase
      .from('provisioning_logs')
      .select('*')
      .order('timestamp', { ascending: false})
      .limit(100);

    if (error) {
      throw new Error(`Error al obtener logs: ${error.message}`);
    }

    return data;
  }
}

module.exports = ProvisioningServiceBuilder;
