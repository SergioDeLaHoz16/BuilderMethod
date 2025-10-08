/*
  # Agregar nuevos atributos a máquinas virtuales

  1. Cambios en tabla `virtual_machines`
    - Agregar columna `vcpus` (número de vCPUs - obligatorio)
    - Agregar columna `memory_gb` (memoria RAM en GB - obligatorio)
    - Agregar columna `memory_optimization` (optimización de memoria - opcional)
    - Agregar columna `disk_optimization` (optimización de disco - opcional)
    - Agregar columna `key_pair_name` (clave SSH - opcional)

  2. Cambios en tabla `networks`
    - Agregar columna `firewall_rules` (reglas de firewall - opcional)
    - Agregar columna `public_ip` (IP pública asignada - opcional)

  3. Cambios en tabla `disks`
    - Agregar columna `region` (región del almacenamiento - obligatorio)
    - Agregar columna `iops` (rendimiento del disco - opcional)
*/

-- Agregar columnas a virtual_machines
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'virtual_machines' AND column_name = 'vcpus'
  ) THEN
    ALTER TABLE virtual_machines ADD COLUMN vcpus INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'virtual_machines' AND column_name = 'memory_gb'
  ) THEN
    ALTER TABLE virtual_machines ADD COLUMN memory_gb INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'virtual_machines' AND column_name = 'memory_optimization'
  ) THEN
    ALTER TABLE virtual_machines ADD COLUMN memory_optimization BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'virtual_machines' AND column_name = 'disk_optimization'
  ) THEN
    ALTER TABLE virtual_machines ADD COLUMN disk_optimization BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'virtual_machines' AND column_name = 'key_pair_name'
  ) THEN
    ALTER TABLE virtual_machines ADD COLUMN key_pair_name TEXT;
  END IF;
END $$;

-- Agregar columnas a networks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'networks' AND column_name = 'firewall_rules'
  ) THEN
    ALTER TABLE networks ADD COLUMN firewall_rules TEXT[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'networks' AND column_name = 'public_ip'
  ) THEN
    ALTER TABLE networks ADD COLUMN public_ip BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Agregar columnas a disks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'disks' AND column_name = 'region'
  ) THEN
    ALTER TABLE disks ADD COLUMN region TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'disks' AND column_name = 'iops'
  ) THEN
    ALTER TABLE disks ADD COLUMN iops INTEGER;
  END IF;
END $$;
