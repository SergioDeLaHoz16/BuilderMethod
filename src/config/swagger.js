const swaggerJSDoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger para documentación de la API
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Aprovisionamiento de Máquinas Virtuales Multi-Cloud',
      version: '1.0.0',
      description: 'API REST para aprovisionar máquinas virtuales en múltiples proveedores de nube (AWS, Azure, GCP, On-Premise)',
      contact: {
        name: 'Universidad Popular del Cesar',
        email: 'soporte@unicesar.edu.co'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Provisioning',
        description: 'Operaciones de aprovisionamiento de VMs'
      },
      {
        name: 'VMs',
        description: 'Gestión de máquinas virtuales'
      },
      {
        name: 'Logs',
        description: 'Registros de aprovisionamiento'
      }
    ],
    components: {
      schemas: {
        ProvisionRequest: {
          type: 'object',
          required: ['provider', 'params'],
          properties: {
            provider: {
              type: 'string',
              enum: ['aws', 'azure', 'gcp', 'onpremise'],
              description: 'Proveedor de nube'
            },
            params: {
              type: 'object',
              description: 'Parámetros específicos del proveedor'
            }
          }
        },
        AWSParams: {
          type: 'object',
          properties: {
            instanceType: {
              type: 'string',
              example: 't2.micro'
            },
            region: {
              type: 'string',
              example: 'us-east-1'
            },
            vpcId: {
              type: 'string',
              example: 'vpc-12345678'
            },
            ami: {
              type: 'string',
              example: 'ami-0abcdef1234567890'
            }
          }
        },
        AzureParams: {
          type: 'object',
          properties: {
            vmSize: {
              type: 'string',
              example: 'Standard_B1s'
            },
            resourceGroup: {
              type: 'string',
              example: 'my-resource-group'
            },
            image: {
              type: 'string',
              example: 'Ubuntu-20.04'
            },
            virtualNetwork: {
              type: 'string',
              example: 'my-vnet'
            }
          }
        },
        GCPParams: {
          type: 'object',
          properties: {
            machineType: {
              type: 'string',
              example: 'n1-standard-1'
            },
            zone: {
              type: 'string',
              example: 'us-central1-a'
            },
            disk: {
              type: 'string',
              example: '100GB-SSD'
            },
            project: {
              type: 'string',
              example: 'my-gcp-project'
            }
          }
        },
        OnPremiseParams: {
          type: 'object',
          properties: {
            cpu: {
              type: 'integer',
              example: 4
            },
            ram: {
              type: 'integer',
              example: 16
            },
            disk: {
              type: 'string',
              example: '500GB'
            },
            network: {
              type: 'string',
              example: 'VLAN-100'
            }
          }
        },
        ProvisionResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            vmId: {
              type: 'string',
              example: 'aws-1234567890-abc123'
            },
            provider: {
              type: 'string',
              example: 'aws'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Error al aprovisionar la VM'
            }
          }
        },
        VirtualMachine: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            vm_id: {
              type: 'string'
            },
            provider: {
              type: 'string'
            },
            status: {
              type: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
