const express = require('express');
const ProvisioningController = require('../controllers/ProvisioningController');

const router = express.Router();
const controller = new ProvisioningController();

/**
 * @swagger
 * /api/provision:
 *   post:
 *     summary: Aprovisiona una nueva máquina virtual
 *     tags: [Provisioning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProvisionRequest'
 *           examples:
 *             AWS:
 *               value:
 *                 provider: "aws"
 *                 params:
 *                   instanceType: "t2.micro"
 *                   region: "us-east-1"
 *                   vpcId: "vpc-12345678"
 *                   ami: "ami-0abcdef1234567890"
 *             Azure:
 *               value:
 *                 provider: "azure"
 *                 params:
 *                   vmSize: "Standard_B1s"
 *                   resourceGroup: "my-resource-group"
 *                   image: "Ubuntu-20.04"
 *                   virtualNetwork: "my-vnet"
 *             GCP:
 *               value:
 *                 provider: "gcp"
 *                 params:
 *                   machineType: "n1-standard-1"
 *                   zone: "us-central1-a"
 *                   disk: "100GB-SSD"
 *                   project: "my-gcp-project"
 *             OnPremise:
 *               value:
 *                 provider: "onpremise"
 *                 params:
 *                   cpu: 4
 *                   ram: 16
 *                   disk: "500GB"
 *                   network: "VLAN-100"
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

module.exports = router;
