const { VirtualMachineBuilder } = require("./VirtualMachineBuilder");

class OnPremiseVirtualMachineBuilder extends VirtualMachineBuilder {
  constructor(factory) {
    super(factory);
  }
}

module.exports = { OnPremiseVirtualMachineBuilder };
