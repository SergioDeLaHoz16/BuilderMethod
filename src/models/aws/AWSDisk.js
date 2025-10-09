const IDisk = require('../interfaces/IDisk');

/**
 * Implementación concreta de disco para AWS (EBS Volume)
 * Representa volúmenes de almacenamiento en AWS
 */
class AWSDisk extends IDisk {
  /**
   * @param {string} id - Identificador único del disco
   * @param {string} volumeType - Tipo de volumen (gp2, io1, etc.)
   * @param {number} sizeGB - Tamaño del disco en GB
   * @param {boolean} encrypted - Si el disco está encriptado
   * @param {string} region - Región de AWS (obligatorio)
   * @param {number} iops - IOPS del disco (opcional)
   */
  constructor(id, volumeType, sizeGB, encrypted, region, iops = null) {
    super(id, sizeGB);
    this.volumeType = volumeType;
    this.encrypted = encrypted;
    // Atributos obligatorios según el PDF
    this.region = region;
    // Atributos opcionales
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
      volumeType: this.volumeType,
      sizeGB: this.sizeGB,
      encrypted: this.encrypted,
      region: this.region,
      iops: this.iops
    };
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      disk_id: this.id,
      provider: 'aws',
      size_gb: this.sizeGB,
      region: this.region,
      config: {
        volumeType: this.volumeType,
        encrypted: this.encrypted
      },
      iops: this.iops,
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = AWSDisk;
