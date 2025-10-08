const { VirtualMachinePackage } = require("../models/VirtualMachinePackage");

class VirtualMachineBuilder {
  constructor(factory) {
    if (new.target === VirtualMachineBuilder) {
      throw new Error("Cannot instantiate abstract class VirtualMachineBuilder");
    }
    this.factory = factory;
    this.reset();
  }

  reset() {
    this.vmConfig = {};
    this.networkConfig = {};
    this.diskConfig = {};
    this.package = new VirtualMachinePackage();
  }

  setVMConfig(instanceType, vcpus, memoryGB, region) {
    this.vmConfig = { instanceType, vcpus, memoryGB, region };
    return this;
  }

  setMemoryOptimization(enabled) {
    this.vmConfig.memoryOptimization = enabled;
    return this;
  }

  setDiskOptimization(enabled) {
    this.vmConfig.diskOptimization = enabled;
    return this;
  }

  setKeyPair(keyPairName) {
    this.vmConfig.keyPairName = keyPairName;
    return this;
  }

  setNetworkConfig(region, config) {
    this.networkConfig = { ...config, region };
    return this;
  }

  setFirewallRules(rules) {
    this.networkConfig.firewallRules = rules;
    return this;
  }

  setPublicIP(enabled) {
    this.networkConfig.publicIP = enabled;
    return this;
  }

  setDiskConfig(sizeGB, region, config) {
    this.diskConfig = { sizeGB, region, ...config };
    return this;
  }

  setIOPS(iops) {
    this.diskConfig.iops = iops;
    return this;
  }

  // Construye el paquete final usando la fábrica concreta
  build() {
    this.package.vm = this.factory.createVirtualMachine(this.vmConfig);
    this.package.network = this.factory.createNetwork(this.networkConfig);
    this.package.disk = this.factory.createDisk(this.diskConfig);
    return this.package;
  }
}

module.exports = { VirtualMachineBuilder };
