const { VirtualMachineBuilder } = require("./VirtualMachineBuilder");

class AzureVirtualMachineBuilder extends VirtualMachineBuilder {
  constructor(factory) {
    super(factory);
  }
}

module.exports = { AzureVirtualMachineBuilder };
