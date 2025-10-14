
const IDisk = require('../interfaces/IDisk');


/**
 * Implementación concreta de disco para Azure (Managed Disk)
 * Representa discos administrados en Azure
 */
class AzureDisk extends IDisk {
  /**
   * @param {string} id - Identificador único del disco
   * @param {string} diskSku - SKU del disco (Standard_LRS, Premium_LRS)
   * @param {number} sizeGB - Tamaño del disco en GB
   * @param {boolean} managedDisk - Si es un disco administrado
   */
  constructor(id, diskSku, sizeGB, managedDisk, region, iops = null) {
    super(id, sizeGB);
    this.diskSku = diskSku;
    this.managedDisk = managedDisk;
    this.region = region;
    this.iops = iops;
  }

  getId() {
    return this.id;
  }

  getSize() {
    return this.sizeGB;
  }

  getConfig() {
    return {
      diskSku: this.diskSku,
      sizeGB: this.sizeGB,
      managedDisk: this.managedDisk
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      disk_id: this.id,
      provider: 'azure',
      size_gb: this.sizeGB,
      region: this.region,
      config: {
        diskSku: this.diskSku,
        managedDisk: this.managedDisk
      },
      iops: this.iops,
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = AzureDisk;
