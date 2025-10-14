const supabase = require('../config/database');
const AWSFactory = require('../factories/aws/AWSFactory');
const AzureFactory = require('../factories/azure/AzureFactory');
const GCPFactory = require('../factories/gcp/GCPFactory');
const OnPremiseFactory = require('../factories/onpremise/OnPremiseFactory');
const ProvisioningResult = require('../models/ProvisioningResult');
const Logger = require('./Logger');
const VMReconstructor = require('../utils/VMReconstructor');


/**
 * Servicio principal de aprovisionamiento de recursos cloud
 * Aplica patrones de diseño y principios SOLID:
 * - Patrón Abstract Factory: crea familias de recursos relacionados (VM + Red + Disco)
 * - Patrón MVC: gestiona la lógica de negocio (capa de servicio)
 * - Single Responsibility: gestiona únicamente el aprovisionamiento
 * - Open/Closed: extensible a nuevos proveedores sin modificar código existente
 * - Dependency Inversion: depende de abstracciones (AbstractFactory)
 */
class ProvisioningService {
  constructor() {
    // Registro de factories concretos para cada proveedor
    // Cada factory crea una familia completa de recursos (VM + Red + Disco)
    this.factories = {
      aws: new AWSFactory(),
      azure: new AzureFactory(),
      gcp: new GCPFactory(),
      onpremise: new OnPremiseFactory()
    };
  }

  /**
   * Aprovisiona una familia completa de recursos (VM + Red + Disco)
   * Garantiza consistencia: todos los recursos pertenecen al mismo proveedor
   *
   * @param {string} provider - Proveedor de nube (aws, azure, gcp, onpremise)
   * @param {Object} params - Parámetros para VM, red y disco
   * @param {Object} params.vm - Parámetros de la máquina virtual
   * @param {Object} params.network - Parámetros de red
   * @param {Object} params.disk - Parámetros de disco
   * @returns {Promise<ProvisioningResult>}
   */
  async provision(provider, params) {
    Logger.logRequest(provider, params);

    try {
      const factory = this.factories[provider.toLowerCase()];

      if (!factory) {
        throw new Error(`Proveedor '${provider}' no soportado`);
      }

      // Validar que existan los parámetros para los tres recursos
      if (!params.vm || !params.network || !params.disk) {
        throw new Error('Se requieren parámetros para VM, Network y Disk');
      }

      // Crear familia de recursos usando Abstract Factory
      // Garantiza que VM, red y disco sean compatibles entre sí
      const vm = factory.createVirtualMachine(params.vm);
      const network = factory.createNetwork(params.network);
      const disk = factory.createDisk(params.disk);

      // Guardar todos los recursos en la base de datos
      await this.saveResourceFamily(vm, network, disk);

      const result = new ProvisioningResult(
        'success',
        vm.getId(),
        provider,
        new Date()
      );

      // Obtener ID de la VM en la base de datos para logging
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
   * Guarda la familia completa de recursos en la base de datos
   * Garantiza atomicidad: si falla alguna inserción, se lanza error
   *
   * @param {IVirtualMachine} vm - Instancia de máquina virtual
   * @param {INetwork} network - Instancia de red
   * @param {IDisk} disk - Instancia de disco
   * @private
   */
  async saveResourceFamily(vm, network, disk) {
    // Insertar máquina virtual
    const { error: vmError } = await supabase
      .from('virtual_machines')
      .insert(vm.toJSON());

    if (vmError) {
      throw new Error(`Error al guardar VM: ${vmError.message}`);
    }

    // Insertar red
    const { error: networkError } = await supabase
      .from('networks')
      .insert(network.toJSON());

    if (networkError) {
      throw new Error(`Error al guardar Network: ${networkError.message}`);
    }

    // Insertar disco
    const { error: diskError } = await supabase
      .from('disks')
      .insert(disk.toJSON());

    if (diskError) {
      throw new Error(`Error al guardar Disk: ${diskError.message}`);
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
   * Obtiene una máquina virtual por su ID y la reconstruye como objeto
   * @param {string} vmId - ID de la máquina virtual
   * @returns {Promise<IVirtualMachine>}
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

    return VMReconstructor.reconstructVM(data);
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

  /**
   * Guarda una VM clonada en la base de datos
   * Usado por el patrón Prototype para persistir VMs clonadas
   * @param {IVirtualMachine} vm - Instancia de máquina virtual
   * @returns {Promise<ProvisioningResult>}
   */
  async saveVM(vm) {
    try {
      const { error: vmError } = await supabase
        .from('virtual_machines')
        .insert(vm.toJSON());

      if (vmError) {
        throw new Error(`Error al guardar VM: ${vmError.message}`);
      }

      const result = new ProvisioningResult(
        'success',
        vm.getId(),
        vm.toJSON().provider,
        new Date()
      );

      const { data: vmData } = await supabase
        .from('virtual_machines')
        .select('id')
        .eq('vm_id', vm.getId())
        .maybeSingle();

      await Logger.logResult(result, vmData?.id, { source: 'prototype-clone' });

      return result;

    } catch (error) {
      throw new Error(`Error al guardar VM clonada: ${error.message}`);
    }
  }
}

module.exports = ProvisioningService;
