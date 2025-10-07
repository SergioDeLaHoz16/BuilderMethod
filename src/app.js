const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const provisioningRoutes = require('./routes/provisioning.routes');
require('dotenv').config();

/**
 * Aplicación principal Express
 * Configura middleware y rutas
 */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'API de Aprovisionamiento Multi-Cloud',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', provisioningRoutes);

module.exports = app;
