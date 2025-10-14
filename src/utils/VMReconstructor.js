const AWSVirtualMachine = require('../models/aws/AWSVirtualMachine');
const AzureVirtualMachine = require('../models/azure/AzureVirtualMachine');
const GCPVirtualMachine = require('../models/gcp/GCPVirtualMachine');
const OnPremiseVirtualMachine = require('../models/onpremise/OnPremiseVirtualMachine');

class VMReconstructor {
  static reconstructVM(vmData) {
    const provider = vmData.provider.toLowerCase();

    switch (provider) {
      case 'aws':
        return new AWSVirtualMachine(
          vmData.vm_id,
          vmData.instance_type,
          vmData.region,
          vmData.vpc_id,
          vmData.ami,
          vmData.vcpus,
          vmData.memory_gb,
          vmData.memory_optimization || false,
          vmData.disk_optimization || false,
          vmData.key_pair_name
        );

      case 'azure':
        return new AzureVirtualMachine(
          vmData.vm_id,
          vmData.vm_size,
          vmData.region,
          vmData.resource_group,
          vmData.image,
          vmData.vcpus,
          vmData.memory_gb,
          vmData.memory_optimization || false,
          vmData.disk_optimization || false,
          vmData.key_pair_name
        );

      case 'gcp':
        return new GCPVirtualMachine(
          vmData.vm_id,
          vmData.machine_type,
          vmData.zone,
          vmData.disk,
          vmData.project,
          vmData.vcpus,
          vmData.memory_gb,
          vmData.memory_optimization || false,
          vmData.disk_optimization || false,
          vmData.key_pair_name
        );

      case 'onpremise':
        return new OnPremiseVirtualMachine(
          vmData.vm_id,
          vmData.instance_type,
          vmData.vcpus,
          vmData.memory_gb,
          vmData.hypervisor,
          vmData.datacenter,
          vmData.memory_optimization || false,
          vmData.disk_optimization || false,
          vmData.key_pair_name
        );

      default:
        throw new Error(`Proveedor '${provider}' no soportado para reconstrucción`);
    }
  }
}

module.exports = VMReconstructor;
