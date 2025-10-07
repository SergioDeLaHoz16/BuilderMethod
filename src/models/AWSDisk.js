const IDisk = require('./IDisk');

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
   */
  constructor(id, volumeType, sizeGB, encrypted) {
    super(id, sizeGB);
    this.volumeType = volumeType;
    this.encrypted = encrypted;
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
      encrypted: this.encrypted
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
      config: {
        volumeType: this.volumeType,
        encrypted: this.encrypted
      },
      status: 'provisioned',
      created_at: new Date().toISOString()
    };
  }
}

module.exports = AWSDisk;
