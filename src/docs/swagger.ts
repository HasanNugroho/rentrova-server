import { swaggerUI } from '@hono/swagger-ui';
import { Hono } from 'hono';

const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Rentrova Server API',
    version: '1.0.0',
    description: 'Production-ready backend API built with Bun and Hono',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          code: { type: 'number' },
          errors: { type: 'array', items: { type: 'string' } },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '409': { description: 'User already exists' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v1/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Token refreshed successfully' },
          '401': { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/v1/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Get user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Profile retrieved successfully' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users (paginated)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': { description: 'Users retrieved successfully' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a new user (Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                  role: { type: 'string', enum: ['USER', 'ADMIN'] },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created successfully' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/v1/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'User retrieved successfully' },
          '404': { description: 'User not found' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  name: { type: 'string' },
                  role: { type: 'string', enum: ['USER', 'ADMIN'] },
                  isActive: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'User updated successfully' },
          '403': { description: 'Forbidden' },
          '404': { description: 'User not found' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'User deleted successfully' },
          '403': { description: 'Forbidden' },
          '404': { description: 'User not found' },
        },
      },
    },
  },
};

export function setupSwagger(app: Hono) {
  app.get('/docs/openapi.json', (c) => c.json(swaggerDoc));
  app.get('/docs', swaggerUI({ url: '/docs/openapi.json' }));
}
