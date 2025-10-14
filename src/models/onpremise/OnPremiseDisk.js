
const IDisk = require('../interfaces/IDisk');

/**
 * Implementación concreta de disco para infraestructura On-Premise
 * Representa discos en storage local o SAN
 */
class OnPremiseDisk extends IDisk {
  /**
   * @param {string} id - Identificador único del disco
   * @param {string} storagePool - Pool de almacenamiento
   * @param {number} sizeGB - Tamaño del disco en GB
   * @param {string} raidLevel - Nivel de RAID (RAID0, RAID1, RAID5, etc.)
   */
  constructor(id, storagePool, sizeGB, raidLevel, region, iops = null) {
    super(id, sizeGB);
    this.storagePool = storagePool;
    this.raidLevel = raidLevel;
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
      storagePool: this.storagePool,
      sizeGB: this.sizeGB,
      raidLevel: this.raidLevel
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      disk_id: this.id,
      provider: 'onpremise',
      size_gb: this.sizeGB,
      region: this.region,
      config: {
        storagePool: this.storagePool,
        raidLevel: this.raidLevel
      },
      iops: this.iops,
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = OnPremiseDisk;
