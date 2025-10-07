/*
  # Agregar tablas para Network y Disk - Abstract Factory Pattern

  ## Descripci\u00f3n
  Esta migraci\u00f3n extiende el esquema para soportar el patr\u00f3n Abstract Factory,
  permitiendo el aprovisionamiento de familias completas de recursos (VM + Red + Disco).

  ## Nuevas Tablas

  ### `networks`
  Almacena recursos de red para cada proveedor cloud
  - `id` (uuid, primary key) - Identificador \u00fanico interno
  - `network_id` (text, unique, not null) - Identificador de red espec\u00edfico del proveedor
  - `provider` (text, not null) - Proveedor cloud (aws, azure, gcp, onpremise)
  - `region` (text, not null) - Regi\u00f3n o ubicaci\u00f3n del recurso
  - `config` (jsonb, not null) - Configuraci\u00f3n espec\u00edfica del proveedor
    - AWS: vpcId, subnet, securityGroup
    - Azure: virtualNetwork, subnetName, networkSecurityGroup
    - GCP: networkName, subnetworkName, firewallTag
    - On-Premise: physicalInterface, vlanId, firewallPolicy
  - `status` (text, not null) - Estado del recurso (provisioned, deleted)
  - `created_at` (timestamptz) - Fecha de creaci\u00f3n

  ### `disks`
  Almacena recursos de almacenamiento (discos) para cada proveedor
  - `id` (uuid, primary key) - Identificador \u00fanico interno
  - `disk_id` (text, unique, not null) - Identificador de disco espec\u00edfico del proveedor
  - `provider` (text, not null) - Proveedor cloud (aws, azure, gcp, onpremise)
  - `size_gb` (integer, not null) - Tama\u00f1o del disco en GB
  - `config` (jsonb, not null) - Configuraci\u00f3n espec\u00edfica del proveedor
    - AWS: volumeType, encrypted
    - Azure: diskSku, managedDisk
    - GCP: diskType, autoDelete
    - On-Premise: storagePool, raidLevel
  - `status` (text, not null) - Estado del recurso (provisioned, deleted)
  - `created_at` (timestamptz) - Fecha de creaci\u00f3n

  ## Seguridad
  - Habilitar RLS en todas las tablas nuevas
  - Agregar pol\u00edticas para acceso p\u00fablico (demo/desarrollo)

  ## Notas Importantes
  - Las tablas usan JSONB para configuraciones espec\u00edficas de cada proveedor
  - Esto permite flexibilidad sin modificar el esquema para cada proveedor
  - Los \u00edndices mejoran el rendimiento de consultas frecuentes
*/

-- Crear tabla networks
CREATE TABLE IF NOT EXISTS networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id text UNIQUE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('aws', 'azure', 'gcp', 'onpremise')),
  region text NOT NULL,
  config jsonb NOT NULL,
  status text NOT NULL DEFAULT 'provisioned' CHECK (status IN ('provisioned', 'deleted')),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla disks
CREATE TABLE IF NOT EXISTS disks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disk_id text UNIQUE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('aws', 'azure', 'gcp', 'onpremise')),
  size_gb integer NOT NULL CHECK (size_gb > 0),
  config jsonb NOT NULL,
  status text NOT NULL DEFAULT 'provisioned' CHECK (status IN ('provisioned', 'deleted')),
  created_at timestamptz DEFAULT now()
);

-- \u00cdndices para mejorar rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_networks_provider ON networks(provider);
CREATE INDEX IF NOT EXISTS idx_networks_network_id ON networks(network_id);
CREATE INDEX IF NOT EXISTS idx_disks_provider ON disks(provider);
CREATE INDEX IF NOT EXISTS idx_disks_disk_id ON disks(disk_id);

-- Habilitar Row Level Security
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE disks ENABLE ROW LEVEL SECURITY;

-- Pol\u00edticas RLS para tabla networks (acceso p\u00fablico para demo)
CREATE POLICY "Allow public read access to networks"
  ON networks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to networks"
  ON networks
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to networks"
  ON networks
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from networks"
  ON networks
  FOR DELETE
  TO public
  USING (true);

-- Pol\u00edticas RLS para tabla disks (acceso p\u00fablico para demo)
CREATE POLICY "Allow public read access to disks"
  ON disks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to disks"
  ON disks
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to disks"
  ON disks
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from disks"
  ON disks
  FOR DELETE
  TO public
  USING (true);
