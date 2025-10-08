/**
 * Director que orquesta el proceso de construcción de VMs
 * Patrón Director: Define el orden y la lógica de construcción
 *
 * Responsable de:
 * - Determinar los valores de vCPU y RAM según el tipo de máquina
 * - Coordinar la llamada a los métodos del Builder en el orden correcto
 * - Aplicar políticas de construcción por proveedor y tipo de VM
 *
 * Tipos de VM soportados:
 * - standard: Máquinas de propósito general
 * - memory-optimized: Optimizadas para memoria
 * - compute-optimized: Optimizadas para cómputo
 */
class Director {
  /**
   * @param {VirtualMachineBuilder} builder - Builder a utilizar
   */
  constructor(builder) {
    this.builder = builder;
  }

  /**
   * Cambia el builder que usa el director
   * @param {VirtualMachineBuilder} builder - Nuevo builder
   */
  setBuilder(builder) {
    this.builder = builder;
  }

  /**
   * Construye una VM estándar (propósito general)
   * @param {string} provider - Proveedor cloud
   * @param {string} size - Tamaño (small, medium, large)
   * @param {string} region - Región
   * @param {Object} additionalParams - Parámetros adicionales
   * @returns {VirtualMachinePackage}
   */
  constructStandardVM(provider, size, region, additionalParams = {}) {
    const config = this._getStandardConfig(provider, size);

    this.builder.reset();
    this.builder
      .setVMConfig(config.instanceType, config.vcpus, config.memoryGB, region)
      .setMemoryOptimization(false)
      .setDiskOptimization(false);

    // Aplicar configuraciones adicionales
    this._applyAdditionalConfig(provider, region, additionalParams);

    return this.builder.build();
  }

  /**
   * Construye una VM optimizada para memoria
   * @param {string} provider - Proveedor cloud
   * @param {string} size - Tamaño (small, medium, large)
   * @param {string} region - Región
   * @param {Object} additionalParams - Parámetros adicionales
   * @returns {VirtualMachinePackage}
   */
  constructMemoryOptimizedVM(provider, size, region, additionalParams = {}) {
    const config = this._getMemoryOptimizedConfig(provider, size);

    this.builder.reset();
    this.builder
      .setVMConfig(config.instanceType, config.vcpus, config.memoryGB, region)
      .setMemoryOptimization(true)
      .setDiskOptimization(false);

    // Aplicar configuraciones adicionales
    this._applyAdditionalConfig(provider, region, additionalParams);

    return this.builder.build();
  }

  /**
   * Construye una VM optimizada para cómputo (disco)
   * @param {string} provider - Proveedor cloud
   * @param {string} size - Tamaño (small, medium, large)
   * @param {string} region - Región
   * @param {Object} additionalParams - Parámetros adicionales
   * @returns {VirtualMachinePackage}
   */
  constructComputeOptimizedVM(provider, size, region, additionalParams = {}) {
    const config = this._getComputeOptimizedConfig(provider, size);

    this.builder.reset();
    this.builder
      .setVMConfig(config.instanceType, config.vcpus, config.memoryGB, region)
      .setMemoryOptimization(false)
      .setDiskOptimization(true);

    // Aplicar configuraciones adicionales
    this._applyAdditionalConfig(provider, region, additionalParams);

    return this.builder.build();
  }

  /**
   * Aplica configuraciones adicionales al builder
   * @private
   */
  _applyAdditionalConfig(provider, region, params) {
    // Configuración de VM
    if (params.keyPairName) {
      this.builder.setKeyPair(params.keyPairName);
    }

    // Configurar valores específicos del proveedor para VM
    Object.assign(this.builder.vmConfig, params.vm || {});

    // Configuración de Red
    const networkParams = params.network || {};
    this.builder.setNetworkConfig(region, this._getNetworkDefaults(provider, networkParams));

    if (networkParams.firewallRules) {
      this.builder.setFirewallRules(networkParams.firewallRules);
    }
    if (networkParams.publicIP !== undefined) {
      this.builder.setPublicIP(networkParams.publicIP);
    }

    // Configuración de Disco
    const diskParams = params.disk || {};
    const diskSize = diskParams.sizeGB || this._getDefaultDiskSize(params.vmType || 'standard');
    this.builder.setDiskConfig(diskSize, region, this._getDiskDefaults(provider, diskParams));

    if (diskParams.iops) {
      this.builder.setIOPS(diskParams.iops);
    }
  }

  /**
   * Obtiene configuración para VM estándar
   * @private
   */
  _getStandardConfig(provider, size) {
    const configs = {
      aws: {
        small: { instanceType: 't3.medium', vcpus: 2, memoryGB: 4 },
        medium: { instanceType: 'm5.large', vcpus: 2, memoryGB: 8 },
        large: { instanceType: 'm5.xlarge', vcpus: 4, memoryGB: 16 }
      },
      azure: {
        small: { instanceType: 'D2s_v3', vcpus: 2, memoryGB: 8 },
        medium: { instanceType: 'D4s_v3', vcpus: 4, memoryGB: 16 },
        large: { instanceType: 'D8s_v3', vcpus: 8, memoryGB: 32 }
      },
      gcp: {
        small: { instanceType: 'e2-standard-2', vcpus: 2, memoryGB: 8 },
        medium: { instanceType: 'e2-standard-4', vcpus: 4, memoryGB: 16 },
        large: { instanceType: 'e2-standard-8', vcpus: 8, memoryGB: 32 }
      },
      onpremise: {
        small: { instanceType: 'onprem-std1', vcpus: 2, memoryGB: 4 },
        medium: { instanceType: 'onprem-std2', vcpus: 4, memoryGB: 8 },
        large: { instanceType: 'onprem-std3', vcpus: 8, memoryGB: 16 }
      }
    };

    return configs[provider][size] || configs[provider]['small'];
  }

  /**
   * Obtiene configuración para VM optimizada en memoria
   * @private
   */
  _getMemoryOptimizedConfig(provider, size) {
    const configs = {
      aws: {
        small: { instanceType: 'r5.large', vcpus: 2, memoryGB: 16 },
        medium: { instanceType: 'r5.xlarge', vcpus: 4, memoryGB: 32 },
        large: { instanceType: 'r5.2xlarge', vcpus: 8, memoryGB: 64 }
      },
      azure: {
        small: { instanceType: 'E2s_v3', vcpus: 2, memoryGB: 16 },
        medium: { instanceType: 'E4s_v3', vcpus: 4, memoryGB: 32 },
        large: { instanceType: 'E8s_v3', vcpus: 8, memoryGB: 64 }
      },
      gcp: {
        small: { instanceType: 'n2-highmem-2', vcpus: 2, memoryGB: 16 },
        medium: { instanceType: 'n2-highmem-4', vcpus: 4, memoryGB: 32 },
        large: { instanceType: 'n2-highmem-8', vcpus: 8, memoryGB: 64 }
      },
      onpremise: {
        small: { instanceType: 'onprem-mem1', vcpus: 2, memoryGB: 16 },
        medium: { instanceType: 'onprem-mem2', vcpus: 4, memoryGB: 32 },
        large: { instanceType: 'onprem-mem3', vcpus: 8, memoryGB: 64 }
      }
    };

    return configs[provider][size] || configs[provider]['small'];
  }

  /**
   * Obtiene configuración para VM optimizada en cómputo
   * @private
   */
  _getComputeOptimizedConfig(provider, size) {
    const configs = {
      aws: {
        small: { instanceType: 'c5.large', vcpus: 2, memoryGB: 4 },
        medium: { instanceType: 'c5.xlarge', vcpus: 4, memoryGB: 8 },
        large: { instanceType: 'c5.2xlarge', vcpus: 8, memoryGB: 16 }
      },
      azure: {
        small: { instanceType: 'F2s_v2', vcpus: 2, memoryGB: 4 },
        medium: { instanceType: 'F4s_v2', vcpus: 4, memoryGB: 8 },
        large: { instanceType: 'F8s_v2', vcpus: 8, memoryGB: 16 }
      },
      gcp: {
        small: { instanceType: 'n2-highcpu-2', vcpus: 2, memoryGB: 2 },
        medium: { instanceType: 'n2-highcpu-4', vcpus: 4, memoryGB: 4 },
        large: { instanceType: 'n2-highcpu-8', vcpus: 8, memoryGB: 8 }
      },
      onpremise: {
        small: { instanceType: 'onprem-cpu1', vcpus: 2, memoryGB: 2 },
        medium: { instanceType: 'onprem-cpu2', vcpus: 4, memoryGB: 4 },
        large: { instanceType: 'onprem-cpu3', vcpus: 8, memoryGB: 8 }
      }
    };

    return configs[provider][size] || configs[provider]['small'];
  }

  /**
   * Obtiene valores por defecto de red según proveedor
   * @private
   */
  _getNetworkDefaults(provider, params) {
    const defaults = {
      aws: {
        vpcId: params.vpcId || 'vpc-default',
        subnet: params.subnet || '10.0.0.0/24',
        securityGroup: params.securityGroup || 'sg-default'
      },
      azure: {
        virtualNetwork: params.virtualNetwork || 'default-vnet',
        subnetName: params.subnetName || 'default-subnet',
        networkSecurityGroup: params.networkSecurityGroup || 'default-nsg'
      },
      gcp: {
        networkName: params.networkName || 'default',
        subnetworkName: params.subnetworkName || 'default',
        firewallTag: params.firewallTag || 'default-tag'
      },
      onpremise: {
        physicalInterface: params.physicalInterface || 'eth0',
        vlanId: params.vlanId || 100,
        firewallPolicy: params.firewallPolicy || 'default-policy'
      }
    };

    return defaults[provider] || {};
  }

  /**
   * Obtiene valores por defecto de disco según proveedor
   * @private
   */
  _getDiskDefaults(provider, params) {
    const defaults = {
      aws: {
        volumeType: params.volumeType || 'gp3',
        encrypted: params.encrypted !== false
      },
      azure: {
        diskSku: params.diskSku || 'Standard_LRS',
        managedDisk: params.managedDisk !== false
      },
      gcp: {
        diskType: params.diskType || 'pd-standard',
        autoDelete: params.autoDelete !== false
      },
      onpremise: {
        storagePool: params.storagePool || 'default-pool',
        raidLevel: params.raidLevel || 'RAID5'
      }
    };

    return defaults[provider] || {};
  }

  /**
   * Obtiene tamaño por defecto de disco según tipo de VM
   * @private
   */
  _getDefaultDiskSize(vmType) {
    const sizes = {
      'standard': 100,
      'memory-optimized': 200,
      'compute-optimized': 150
    };

    return sizes[vmType] || 100;
  }
}

module.exports = Director;
