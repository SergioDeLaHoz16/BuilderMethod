const express = require('express');
const ProvisioningController = require('../controllers/ProvisioningController');

const router = express.Router();
const controller = new ProvisioningController();

/**
 * @swagger
 * /api/provision:
 *   post:
 *     summary: Aprovisiona una familia completa de recursos (VM + Red + Disco)
 *     description: |
 *       Utiliza el patrón Abstract Factory para crear una familia de recursos relacionados.
 *       Garantiza consistencia: VM, Red y Disco pertenecen al mismo proveedor.
 *     tags: [Provisioning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProvisionRequest'
 *           examples:
 *             AWS:
 *               summary: Aprovisionar recursos AWS
 *               value:
 *                 provider: "aws"
 *                 params:
 *                   vm:
 *                     instanceType: "t3.medium"
 *                     region: "us-east-1"
 *                     vpcId: "vpc-0123456789abcdef0"
 *                     ami: "ami-0c55b159cbfafe1f0"
 *                   network:
 *                     vpcId: "vpc-0123456789abcdef0"
 *                     subnet: "10.0.1.0/24"
 *                     securityGroup: "sg-0123456789abcdef0"
 *                     region: "us-east-1"
 *                   disk:
 *                     volumeType: "gp3"
 *                     sizeGB: 100
 *                     encrypted: true
 *             Azure:
 *               summary: Aprovisionar recursos Azure
 *               value:
 *                 provider: "azure"
 *                 params:
 *                   vm:
 *                     vmSize: "Standard_D2s_v3"
 *                     location: "eastus"
 *                     resourceGroup: "my-resource-group"
 *                     imageReference: "UbuntuServer:18.04-LTS"
 *                   network:
 *                     virtualNetwork: "my-vnet"
 *                     subnetName: "default"
 *                     networkSecurityGroup: "my-nsg"
 *                     region: "eastus"
 *                   disk:
 *                     diskSku: "Premium_LRS"
 *                     sizeGB: 128
 *                     managedDisk: true
 *             GCP:
 *               summary: Aprovisionar recursos GCP
 *               value:
 *                 provider: "gcp"
 *                 params:
 *                   vm:
 *                     machineType: "n1-standard-2"
 *                     zone: "us-central1-a"
 *                     project: "my-project-12345"
 *                     image: "debian-11-bullseye-v20240110"
 *                   network:
 *                     networkName: "default"
 *                     subnetworkName: "default"
 *                     firewallTag: "web-server"
 *                     region: "us-central1"
 *                   disk:
 *                     diskType: "pd-ssd"
 *                     sizeGB: 50
 *                     autoDelete: true
 *             OnPremise:
 *               summary: Aprovisionar recursos On-Premise
 *               value:
 *                 provider: "onpremise"
 *                 params:
 *                   vm:
 *                     cpu: 4
 *                     ram: 16
 *                     hypervisor: "VMware ESXi"
 *                     network: "vlan-100"
 *                   network:
 *                     physicalInterface: "eth0"
 *                     vlanId: 100
 *                     firewallPolicy: "allow-web-traffic"
 *                     region: "datacenter-1"
 *                   disk:
 *                     storagePool: "SAN-Pool-01"
 *                     sizeGB: 200
 *                     raidLevel: "RAID5"
 *     responses:
 *       201:
 *         description: VM aprovisionada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProvisionResponse'
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/provision', (req, res) => controller.provision(req, res));

/**
 * @swagger
 * /api/vms:
 *   get:
 *     summary: Obtiene todas las máquinas virtuales
 *     tags: [VMs]
 *     responses:
 *       200:
 *         description: Lista de máquinas virtuales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VirtualMachine'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/vms', (req, res) => controller.getAllVMs(req, res));

/**
 * @swagger
 * /api/vms/{vmId}:
 *   get:
 *     summary: Obtiene una máquina virtual por ID
 *     tags: [VMs]
 *     parameters:
 *       - in: path
 *         name: vmId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la máquina virtual
 *     responses:
 *       200:
 *         description: Datos de la máquina virtual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/VirtualMachine'
 *       404:
 *         description: VM no encontrada
 */
router.get('/vms/:vmId', (req, res) => controller.getVMById(req, res));

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Obtiene los logs de aprovisionamiento
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Lista de logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error interno del servidor
 */
router.get('/logs', (req, res) => controller.getLogs(req, res));

/**
 * @swagger
 * /api/provision/builder:
 *   post:
 *     summary: Aprovisiona VM usando Builder + Director
 *     description: |
 *       Utiliza los patrones Builder y Director.
 *       El Director determina automáticamente vCPU y RAM según tipo de VM y tamaño.
 *       Tipos: standard, memory-optimized, compute-optimized.
 *       Tamaños: small, medium, large.
 *     tags: [Provisioning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - vmType
 *               - size
 *               - region
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [aws, azure, gcp, onpremise]
 *               vmType:
 *                 type: string
 *                 enum: [standard, memory-optimized, compute-optimized]
 *               size:
 *                 type: string
 *                 enum: [small, medium, large]
 *               region:
 *                 type: string
 *               params:
 *                 type: object
 *                 properties:
 *                   vm:
 *                     type: object
 *                   network:
 *                     type: object
 *                   disk:
 *                     type: object
 *           examples:
 *             AWS-Standard-Small:
 *               summary: AWS Standard VM Pequeña (t3.medium: 2 vCPU, 4 GB RAM)
 *               value:
 *                 provider: "aws"
 *                 vmType: "standard"
 *                 size: "small"
 *                 region: "us-east-1"
 *                 params:
 *                   vm:
 *                     vpcId: "vpc-default"
 *                     ami: "ami-0c55b159cbfafe1f0"
 *                     keyPairName: "my-key"
 *                   network:
 *                     vpcId: "vpc-default"
 *                     subnet: "10.0.1.0/24"
 *                     securityGroup: "sg-default"
 *                     firewallRules: ["HTTP", "HTTPS", "SSH"]
 *                     publicIP: true
 *                   disk:
 *                     volumeType: "gp3"
 *                     encrypted: true
 *                     iops: 3000
 *             AWS-Memory-Medium:
 *               summary: AWS Memory-Optimized VM Mediana (r5.xlarge: 4 vCPU, 32 GB RAM)
 *               value:
 *                 provider: "aws"
 *                 vmType: "memory-optimized"
 *                 size: "medium"
 *                 region: "us-east-1"
 *                 params:
 *                   vm:
 *                     vpcId: "vpc-123456"
 *                     ami: "ami-database"
 *                   network:
 *                     vpcId: "vpc-123456"
 *                     subnet: "10.0.2.0/24"
 *                     securityGroup: "sg-database"
 *                     publicIP: false
 *                   disk:
 *                     volumeType: "io1"
 *                     encrypted: true
 *                     iops: 5000
 *             Azure-Compute-Large:
 *               summary: Azure Compute-Optimized VM Grande (F8s_v2: 8 vCPU, 16 GB RAM)
 *               value:
 *                 provider: "azure"
 *                 vmType: "compute-optimized"
 *                 size: "large"
 *                 region: "eastus"
 *                 params:
 *                   vm:
 *                     resourceGroup: "compute-rg"
 *                     imageReference: "UbuntuServer:20.04-LTS"
 *                   network:
 *                     virtualNetwork: "compute-vnet"
 *                     subnetName: "compute-subnet"
 *                     networkSecurityGroup: "compute-nsg"
 *                     firewallRules: ["SSH"]
 *                   disk:
 *                     diskSku: "Premium_LRS"
 *                     managedDisk: true
 *             GCP-Standard-Medium:
 *               summary: GCP Standard VM Mediana (e2-standard-4: 4 vCPU, 16 GB RAM)
 *               value:
 *                 provider: "gcp"
 *                 vmType: "standard"
 *                 size: "medium"
 *                 region: "us-central1"
 *                 params:
 *                   vm:
 *                     project: "my-project-123"
 *                     image: "debian-11"
 *                   network:
 *                     networkName: "default"
 *                     subnetworkName: "default"
 *                     firewallTag: "web-server"
 *                     publicIP: true
 *                   disk:
 *                     diskType: "pd-ssd"
 *                     autoDelete: true
 *                     iops: 3000
 *             OnPremise-Memory-Small:
 *               summary: On-Premise Memory-Optimized VM Pequeña (2 vCPU, 16 GB RAM)
 *               value:
 *                 provider: "onpremise"
 *                 vmType: "memory-optimized"
 *                 size: "small"
 *                 region: "datacenter-1"
 *                 params:
 *                   vm:
 *                     hypervisor: "VMware ESXi"
 *                     keyPairName: "ssh-key-1"
 *                   network:
 *                     physicalInterface: "eth0"
 *                     vlanId: 100
 *                     firewallPolicy: "allow-internal"
 *                   disk:
 *                     storagePool: "SAN-Pool-01"
 *                     raidLevel: "RAID10"
 *                     iops: 2000
 *     responses:
 *       201:
 *         description: VM aprovisionada exitosamente
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error en el aprovisionamiento
 */
router.post('/provision/builder', (req, res) => controller.provisionWithBuilder(req, res));

module.exports = router;
