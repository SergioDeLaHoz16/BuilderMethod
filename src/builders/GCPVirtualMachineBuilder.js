const { VirtualMachineBuilder } = require("./VirtualMachineBuilder");

class GCPVirtualMachineBuilder extends VirtualMachineBuilder {
  constructor(factory) {
    super(factory);
  }
}

module.exports = { GCPVirtualMachineBuilder };
