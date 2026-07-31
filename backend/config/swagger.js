const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'STEMS API Documentation',
      version: '1.0.0',
      description: 'Smart Travel Experience Management System API'
    },
    servers: [
      {
        url: 'https://stems-backend.onrender.com/api',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js').replace(/\\/g, '/')]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;