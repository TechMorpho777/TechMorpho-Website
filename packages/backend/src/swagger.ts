import swaggerJsdoc from 'swagger-jsdoc'
import { Express } from 'express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechMorpho API',
      version: '1.0.0',
      description: 'API documentation for TechMorpho website backend',
      contact: {
        name: 'TechMorpho Support',
        email: 'info@techmorpho.in'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Service ID'
            },
            title: {
              type: 'string',
              description: 'Service title'
            },
            slug: {
              type: 'string',
              description: 'Service slug (URL-friendly identifier)'
            },
            description: {
              type: 'string',
              description: 'Service description'
            },
            icon: {
              type: 'string',
              nullable: true,
              description: 'Service icon (SVG path or icon name)'
            },
            features: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of service features'
            },
            tag: {
              type: 'string',
              nullable: true,
              description: 'Service tag (e.g., Popular, Trending)'
            },
            featured: {
              type: 'boolean',
              description: 'Whether the service is featured'
            },
            order: {
              type: 'integer',
              description: 'Display order'
            },
            active: {
              type: 'boolean',
              description: 'Whether the service is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Contact: {
          type: 'object',
          required: ['name', 'email', 'service', 'message'],
          properties: {
            name: {
              type: 'string',
              description: 'Contact name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact email'
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Contact phone number'
            },
            service: {
              type: 'string',
              description: 'Selected service'
            },
            message: {
              type: 'string',
              description: 'Contact message'
            }
          }
        },
        ContactResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            phone: {
              type: 'string',
              nullable: true
            },
            service: {
              type: 'string'
            },
            message: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['new', 'contacted', 'resolved', 'archived']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for admin authentication'
        }
      }
    },
    tags: [
      {
        name: 'Services',
        description: 'Public service endpoints'
      },
      {
        name: 'Contact',
        description: 'Contact form endpoints'
      },
      {
        name: 'Admin - Services',
        description: 'Admin service management endpoints'
      },
      {
        name: 'Admin - Enquiries',
        description: 'Admin enquiry management endpoints'
      },
      {
        name: 'Admin - Settings',
        description: 'Admin settings management endpoints'
      },
      {
        name: 'Admin - Auth',
        description: 'Admin authentication endpoints'
      }
    ]
  },
  apis: ['./src/routes/**/*.ts', './src/index.ts']
}

export const swaggerSpec = swaggerJsdoc(options)

