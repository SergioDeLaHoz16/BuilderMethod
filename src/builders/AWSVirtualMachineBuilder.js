const { VirtualMachineBuilder } = require("./VirtualMachineBuilder");

class AWSVirtualMachineBuilder extends VirtualMachineBuilder {
  constructor(factory) {
    super(factory);
  }
}

module.exports = { AWSVirtualMachineBuilder };
