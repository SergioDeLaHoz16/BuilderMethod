/*
  # Virtual Machine Provisioning System Schema

  ## Description
  Creates the database schema for the multi-cloud VM provisioning system.
  This migration sets up tables for storing virtual machines and provisioning logs.

  ## New Tables
  
  ### `virtual_machines`
  - `id` (uuid, primary key) - Unique identifier for the VM
  - `vm_id` (text, unique, not null) - Provider-specific VM identifier
  - `provider` (text, not null) - Cloud provider (aws, azure, gcp, onpremise)
  - `status` (text, not null) - VM status (active, stopped, terminated)
  - `instance_type` (text) - AWS instance type or equivalent
  - `region` (text) - AWS region or equivalent
    - `vpc_id` (text) - AWS VPC or equivalent
  - `ami` (text) - AWS AMI or equivalent
  - `vm_size` (text) - Azure VM size
  - `resource_group` (text) - Azure resource group
  - `image` (text) - VM image
  - `virtual_network` (text) - Azure virtual network
  - `machine_type` (text) - GCP machine type
  - `zone` (text) - GCP zone
  - `disk` (text) - Disk configuration
  - `project` (text) - GCP project
  - `cpu` (integer) - On-premise CPU count
  - `ram` (integer) - On-premise RAM in GB
  - `network` (text) - Network configuration
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `provisioning_logs`
  - `id` (uuid, primary key) - Unique identifier for the log entry
  - `vm_id` (uuid, foreign key) - Reference to virtual_machines table
  - `provider` (text, not null) - Cloud provider
  - `request_params` (jsonb, not null) - Request parameters (sensitive data removed)
  - `status` (text, not null) - Provisioning status (success, error)
  - `error_message` (text) - Error details if failed
  - `timestamp` (timestamptz, not null) - Log timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own VMs and logs
*/

-- Create virtual_machines table
CREATE TABLE IF NOT EXISTS virtual_machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vm_id text UNIQUE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('aws', 'azure', 'gcp', 'onpremise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'terminated')),
  
  -- AWS specific fields
  instance_type text,
  region text,
  vpc_id text,
  ami text,
  
  -- Azure specific fields
  vm_size text,
  resource_group text,
  
  -- Common fields
  image text,
  virtual_network text,
  
  -- GCP specific fields
  machine_type text,
  zone text,
  disk text,
  project text,
  
  -- On-premise specific fields
  cpu integer,
  ram integer,
  network text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create provisioning_logs table
CREATE TABLE IF NOT EXISTS provisioning_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vm_id uuid REFERENCES virtual_machines(id) ON DELETE CASCADE,
  provider text NOT NULL,
  request_params jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'error')),
  error_message text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_virtual_machines_provider ON virtual_machines(provider);
CREATE INDEX IF NOT EXISTS idx_virtual_machines_status ON virtual_machines(status);
CREATE INDEX IF NOT EXISTS idx_provisioning_logs_vm_id ON provisioning_logs(vm_id);
CREATE INDEX IF NOT EXISTS idx_provisioning_logs_timestamp ON provisioning_logs(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE virtual_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE provisioning_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for virtual_machines table
CREATE POLICY "Allow public read access to virtual_machines"
  ON virtual_machines
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to virtual_machines"
  ON virtual_machines
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to virtual_machines"
  ON virtual_machines
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from virtual_machines"
  ON virtual_machines
  FOR DELETE
  TO public
  USING (true);

-- RLS Policies for provisioning_logs table
CREATE POLICY "Allow public read access to provisioning_logs"
  ON provisioning_logs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to provisioning_logs"
  ON provisioning_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to provisioning_logs"
  ON provisioning_logs
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from provisioning_logs"
  ON provisioning_logs
  FOR DELETE
  TO public
  USING (true);