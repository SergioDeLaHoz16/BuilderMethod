
const IDisk = require('../interfaces/IDisk');

/**
 * Implementación concreta de disco para Google Cloud Platform
 * Representa discos persistentes en GCP
 */
class GCPDisk extends IDisk {
  /**
   * @param {string} id - Identificador único del disco
   * @param {string} diskType - Tipo de disco (pd-standard, pd-ssd)
   * @param {number} sizeGB - Tamaño del disco en GB
   * @param {boolean} autoDelete - Si el disco se elimina automáticamente
   */
  constructor(id, diskType, sizeGB, autoDelete, region, iops = null) {
    super(id, sizeGB);
    this.diskType = diskType;
    this.autoDelete = autoDelete;
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
      diskType: this.diskType,
      sizeGB: this.sizeGB,
      autoDelete: this.autoDelete
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      disk_id: this.id,
      provider: 'gcp',
      size_gb: this.sizeGB,
      region: this.region,
      config: {
        diskType: this.diskType,
        autoDelete: this.autoDelete
      },
      iops: this.iops,
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = GCPDisk;
