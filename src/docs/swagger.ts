import { swaggerUI } from '@hono/swagger-ui';
import type { Hono } from 'hono';

export function setupSwagger(app: Hono) {
  app.get('/docs', swaggerUI({ url: '/docs/openapi.json' }));

  app.get('/docs/openapi.json', (c) => {
    return c.json({
      openapi: '3.0.0',
      info: {
        title: 'Rentrova - Multi-Tenant Vehicle Rental SaaS API',
        version: '1.0.0',
        description: 'Complete multi-tenant vehicle rental management system with role-based access control',
        contact: {
          name: 'Rentrova API Support',
          email: 'support@rentrova.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://api.rentrova.com',
          description: 'Production server',
        },
      ],
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Tenants', description: 'Tenant management (Super Admin only)' },
        { name: 'Vehicles', description: 'Vehicle management' },
        { name: 'Customers', description: 'Customer management' },
        { name: 'Drivers', description: 'Driver management and scheduling' },
        { name: 'Bookings', description: 'Booking management with overlap validation' },
        { name: 'Pricing', description: 'Pricing rules and calculation' },
        { name: 'Finance', description: 'Transaction management' },
        { name: 'Maintenance', description: 'Maintenance log management' },
        { name: 'Users', description: 'User management within tenant' },
        { name: 'Subscriptions', description: 'Subscription management (Super Admin only)' },
        { name: 'Dashboard', description: 'Analytics and statistics' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT token obtained from /auth/login',
          },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: { type: 'string', example: 'Error message' },
              code: { type: 'string', example: 'ERROR_CODE' },
            },
          },
          LoginRequest: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email', example: 'owner1@example.com' },
              password: { type: 'string', format: 'password', example: 'password123' },
            },
          },
          LoginResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                type: 'object',
                properties: {
                  token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string', example: 'John Doe' },
                      email: { type: 'string', example: 'owner1@example.com' },
                      role: { type: 'string', enum: ['SUPER_ADMIN', 'TENANT_OWNER', 'STAFF', 'DRIVER'] },
                      tenantId: { type: 'string', format: 'uuid', nullable: true },
                    },
                  },
                },
              },
            },
          },
          Vehicle: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              tenantId: { type: 'string', format: 'uuid' },
              plateNumber: { type: 'string', example: 'B 1234 ABC' },
              brand: { type: 'string', example: 'Toyota', nullable: true },
              model: { type: 'string', example: 'Avanza', nullable: true },
              year: { type: 'integer', example: 2022, nullable: true },
              color: { type: 'string', example: 'Silver', nullable: true },
              type: { type: 'string', example: 'Minibus' },
              capacity: { type: 'integer', example: 7 },
              pricePerDay: { type: 'number', example: 350000 },
              status: { type: 'string', enum: ['AVAILABLE', 'BOOKED', 'MAINTENANCE'] },
              notes: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          Booking: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              tenantId: { type: 'string', format: 'uuid' },
              customerId: { type: 'string', format: 'uuid' },
              vehicleId: { type: 'string', format: 'uuid' },
              driverId: { type: 'string', format: 'uuid', nullable: true },
              userId: { type: 'string', format: 'uuid' },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              distanceKm: { type: 'number', nullable: true },
              totalPrice: { type: 'number', example: 1000000 },
              notes: { type: 'string', nullable: true },
              status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELED'] },
              cancelReason: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      paths: {
        '/auth/login': {
          post: {
            tags: ['Auth'],
            summary: 'Login to get JWT token',
            description: 'Authenticate user and receive JWT access token. All roles can login: SUPER_ADMIN, TENANT_OWNER, STAFF, DRIVER',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginRequest' },
                },
              },
            },
            responses: {
              '200': {
                description: 'Login successful',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/LoginResponse' },
                  },
                },
              },
              '401': {
                description: 'Invalid credentials',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
        '/tenants': {
          get: {
            tags: ['Tenants'],
            summary: 'List all tenants',
            description: 'Get list of all tenants (Super Admin only)',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of tenants',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              name: { type: 'string' },
                              email: { type: 'string' },
                              phone: { type: 'string' },
                              subscriptionPlan: { type: 'string', enum: ['BASIC', 'PRO', 'ENTERPRISE'] },
                              status: { type: 'string', enum: ['active', 'suspended'] },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              '403': {
                description: 'Forbidden - Super Admin only',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
          post: {
            tags: ['Tenants'],
            summary: 'Create new tenant',
            description: 'Create a new tenant (Super Admin only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'email', 'phone'],
                    properties: {
                      name: { type: 'string', example: 'ABC Rental Company' },
                      email: { type: 'string', format: 'email', example: 'tenant@example.com' },
                      phone: { type: 'string', example: '+62812345678' },
                      address: { type: 'string', example: 'Jl. Sudirman No. 123, Jakarta' },
                      subscriptionPlan: { type: 'string', enum: ['BASIC', 'PRO', 'ENTERPRISE'], default: 'BASIC' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Tenant created successfully',
              },
              '403': {
                description: 'Forbidden - Super Admin only',
              },
            },
          },
        },
        '/tenants/{id}': {
          get: {
            tags: ['Tenants'],
            summary: 'Get tenant by ID',
            description: 'Get tenant details (Super Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Tenant details',
              },
              '404': {
                description: 'Tenant not found',
              },
            },
          },
        },
        '/tenants/{id}/suspend': {
          patch: {
            tags: ['Tenants'],
            summary: 'Suspend tenant',
            description: 'Suspend a tenant (Super Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Tenant suspended successfully',
              },
            },
          },
        },
        '/vehicles': {
          get: {
            tags: ['Vehicles'],
            summary: 'List vehicles',
            description: 'Get list of vehicles for the authenticated tenant',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of vehicles',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Vehicle' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ['Vehicles'],
            summary: 'Create vehicle',
            description: 'Create a new vehicle (Owner only). Subject to subscription limits: BASIC (5), PRO (20), ENTERPRISE (unlimited)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['plateNumber', 'type', 'capacity', 'pricePerDay'],
                    properties: {
                      plateNumber: { type: 'string', example: 'B 1234 ABC' },
                      brand: { type: 'string', example: 'Toyota' },
                      model: { type: 'string', example: 'Avanza' },
                      year: { type: 'integer', example: 2022 },
                      color: { type: 'string', example: 'Silver' },
                      type: { type: 'string', example: 'Minibus' },
                      capacity: { type: 'integer', example: 7 },
                      pricePerDay: { type: 'number', example: 350000 },
                      status: { type: 'string', enum: ['AVAILABLE', 'BOOKED', 'MAINTENANCE'], default: 'AVAILABLE' },
                      notes: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Vehicle created successfully',
              },
              '403': {
                description: 'Vehicle limit reached for subscription plan',
              },
            },
          },
        },
        '/vehicles/{id}': {
          get: {
            tags: ['Vehicles'],
            summary: 'Get vehicle by ID',
            description: 'Get vehicle details',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Vehicle details',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: { $ref: '#/components/schemas/Vehicle' },
                      },
                    },
                  },
                },
              },
            },
          },
          put: {
            tags: ['Vehicles'],
            summary: 'Update vehicle',
            description: 'Update vehicle details (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      plateNumber: { type: 'string' },
                      brand: { type: 'string' },
                      model: { type: 'string' },
                      year: { type: 'integer' },
                      color: { type: 'string' },
                      type: { type: 'string' },
                      capacity: { type: 'integer' },
                      pricePerDay: { type: 'number' },
                      status: { type: 'string', enum: ['AVAILABLE', 'BOOKED', 'MAINTENANCE'] },
                      notes: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Vehicle updated successfully',
              },
            },
          },
          delete: {
            tags: ['Vehicles'],
            summary: 'Delete vehicle',
            description: 'Delete a vehicle (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Vehicle deleted successfully',
              },
            },
          },
        },
        '/customers': {
          get: {
            tags: ['Customers'],
            summary: 'List customers',
            description: 'Get list of customers for the authenticated tenant',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of customers',
              },
            },
          },
          post: {
            tags: ['Customers'],
            summary: 'Create customer',
            description: 'Create a new customer',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'phone'],
                    properties: {
                      name: { type: 'string', example: 'Ahmad Rizki' },
                      phone: { type: 'string', example: '+628123456789' },
                      email: { type: 'string', format: 'email' },
                      identityNumber: { type: 'string' },
                      address: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Customer created successfully',
              },
            },
          },
        },
        '/customers/{id}': {
          get: {
            tags: ['Customers'],
            summary: 'Get customer by ID',
            description: 'Get customer details',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Customer details',
              },
            },
          },
          put: {
            tags: ['Customers'],
            summary: 'Update customer',
            description: 'Update customer details (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      phone: { type: 'string' },
                      email: { type: 'string' },
                      identityNumber: { type: 'string' },
                      address: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Customer updated successfully',
              },
            },
          },
        },
        '/drivers': {
          get: {
            tags: ['Drivers'],
            summary: 'List drivers',
            description: 'Get list of drivers for the authenticated tenant',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of drivers',
              },
            },
          },
          post: {
            tags: ['Drivers'],
            summary: 'Create driver',
            description: 'Create a new driver (Owner only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'phone', 'licenseNumber'],
                    properties: {
                      name: { type: 'string', example: 'Agus Supriadi' },
                      phone: { type: 'string', example: '+628567890123' },
                      licenseNumber: { type: 'string', example: 'A1234567890' },
                      status: { type: 'string', enum: ['AVAILABLE', 'ON_TRIP'], default: 'AVAILABLE' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Driver created successfully',
              },
            },
          },
        },
        '/drivers/{id}': {
          get: {
            tags: ['Drivers'],
            summary: 'Get driver by ID',
            description: 'Get driver details',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Driver details',
              },
            },
          },
          put: {
            tags: ['Drivers'],
            summary: 'Update driver',
            description: 'Update driver details (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      phone: { type: 'string' },
                      licenseNumber: { type: 'string' },
                      status: { type: 'string', enum: ['AVAILABLE', 'ON_TRIP'] },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Driver updated successfully',
              },
            },
          },
        },
        '/drivers/{id}/schedule': {
          get: {
            tags: ['Drivers'],
            summary: 'Get driver schedule',
            description: 'Get upcoming bookings for a driver. Drivers can view their own schedule.',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
                description: 'Driver ID',
              },
            ],
            responses: {
              '200': {
                description: 'Driver schedule',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              startDate: { type: 'string', format: 'date-time' },
                              endDate: { type: 'string', format: 'date-time' },
                              status: { type: 'string' },
                              totalPrice: { type: 'number' },
                              customer: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string' },
                                  name: { type: 'string' },
                                  phone: { type: 'string' },
                                },
                              },
                              vehicle: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string' },
                                  plateNumber: { type: 'string' },
                                  brand: { type: 'string' },
                                  model: { type: 'string' },
                                  type: { type: 'string' },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '/bookings': {
          get: {
            tags: ['Bookings'],
            summary: 'List bookings',
            description: 'Get list of bookings for the authenticated tenant',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of bookings',
              },
            },
          },
          post: {
            tags: ['Bookings'],
            summary: 'Create booking',
            description: 'Create a new booking with automatic overlap validation, price calculation, and transaction creation',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['customerId', 'vehicleId', 'startDate', 'endDate'],
                    properties: {
                      customerId: { type: 'string', format: 'uuid' },
                      vehicleId: { type: 'string', format: 'uuid' },
                      driverId: { type: 'string', format: 'uuid' },
                      startDate: { type: 'string', format: 'date-time', example: '2024-03-20T10:00:00Z' },
                      endDate: { type: 'string', format: 'date-time', example: '2024-03-25T10:00:00Z' },
                      distanceKm: { type: 'number', example: 500 },
                      notes: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Booking created successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: { $ref: '#/components/schemas/Booking' },
                      },
                    },
                  },
                },
              },
              '400': {
                description: 'Vehicle or driver already booked for selected dates',
              },
            },
          },
        },
        '/bookings/{id}': {
          get: {
            tags: ['Bookings'],
            summary: 'Get booking by ID',
            description: 'Get booking details',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Booking details',
              },
            },
          },
        },
        '/bookings/{id}/status': {
          patch: {
            tags: ['Bookings'],
            summary: 'Update booking status',
            description: 'Update booking status with validation of allowed transitions',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                      status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELED'] },
                      cancelReason: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Booking status updated successfully',
              },
              '400': {
                description: 'Invalid status transition',
              },
            },
          },
        },
        '/pricing-rules': {
          get: {
            tags: ['Pricing'],
            summary: 'List pricing rules',
            description: 'Get list of pricing rules for the authenticated tenant',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of pricing rules',
              },
            },
          },
          post: {
            tags: ['Pricing'],
            summary: 'Create pricing rule',
            description: 'Create a new pricing rule (Owner only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['type', 'value'],
                    properties: {
                      type: { type: 'string', enum: ['PER_DAY', 'PER_KM', 'DRIVER', 'AREA'] },
                      value: { type: 'number', example: 300000 },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Pricing rule created successfully',
              },
            },
          },
        },
        '/pricing-rules/{id}': {
          put: {
            tags: ['Pricing'],
            summary: 'Update pricing rule',
            description: 'Update a pricing rule (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', enum: ['PER_DAY', 'PER_KM', 'DRIVER', 'AREA'] },
                      value: { type: 'number' },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Pricing rule updated successfully',
              },
            },
          },
          delete: {
            tags: ['Pricing'],
            summary: 'Delete pricing rule',
            description: 'Delete a pricing rule (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Pricing rule deleted successfully',
              },
            },
          },
        },
        '/pricing-rules/calculate-price': {
          post: {
            tags: ['Pricing'],
            summary: 'Calculate booking price',
            description: 'Calculate total price based on pricing rules',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['vehicleId', 'startDate', 'endDate'],
                    properties: {
                      vehicleId: { type: 'string', format: 'uuid' },
                      startDate: { type: 'string', format: 'date-time' },
                      endDate: { type: 'string', format: 'date-time' },
                      distanceKm: { type: 'number', example: 500 },
                      driverId: { type: 'string', format: 'uuid', nullable: true },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Price calculated',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'object',
                          properties: {
                            totalPrice: { type: 'number', example: 2000000 },
                            breakdown: {
                              type: 'object',
                              properties: {
                                durationDays: { type: 'number', example: 5 },
                                perDayTotal: { type: 'number', example: 1500000 },
                                perKmTotal: { type: 'number', example: 150000 },
                                driverTotal: { type: 'number', example: 300000 },
                                areaFee: { type: 'number', example: 50000 },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '/transactions': {
          get: {
            tags: ['Finance'],
            summary: 'List transactions',
            description: 'Get list of transactions for the authenticated tenant (Owner only)',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of transactions',
              },
            },
          },
        },
        '/transactions/{id}': {
          get: {
            tags: ['Finance'],
            summary: 'Get transaction by ID',
            description: 'Get transaction details (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Transaction details',
              },
            },
          },
        },
        '/transactions/{id}/pay': {
          patch: {
            tags: ['Finance'],
            summary: 'Mark transaction as paid',
            description: 'Mark a transaction as paid (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['paymentMethod'],
                    properties: {
                      paymentMethod: { type: 'string', enum: ['CASH', 'TRANSFER', 'CARD'] },
                      paidAt: { type: 'string', format: 'date-time' },
                      notes: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Transaction marked as paid',
              },
            },
          },
        },
        '/maintenance': {
          get: {
            tags: ['Maintenance'],
            summary: 'List maintenance logs',
            description: 'Get list of maintenance logs for the authenticated tenant (Owner only)',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of maintenance logs',
              },
            },
          },
          post: {
            tags: ['Maintenance'],
            summary: 'Create maintenance log',
            description: 'Create a new maintenance log (Owner only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['vehicleId', 'description', 'maintenanceDate'],
                    properties: {
                      vehicleId: { type: 'string', format: 'uuid' },
                      description: { type: 'string', example: 'Oil change and tire rotation' },
                      cost: { type: 'number', example: 500000 },
                      maintenanceDate: { type: 'string', format: 'date-time' },
                      notes: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Maintenance log created successfully',
              },
            },
          },
        },
        '/maintenance/{id}': {
          get: {
            tags: ['Maintenance'],
            summary: 'Get maintenance log by ID',
            description: 'Get maintenance log details (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'Maintenance log details',
              },
            },
          },
        },
        '/users': {
          get: {
            tags: ['Users'],
            summary: 'List users',
            description: 'Get list of users within the authenticated tenant (Owner only)',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of users',
              },
            },
          },
          post: {
            tags: ['Users'],
            summary: 'Create user',
            description: 'Create a new user within the tenant (Owner only). Can only create STAFF or DRIVER roles.',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'role'],
                    properties: {
                      name: { type: 'string', example: 'Alice Johnson' },
                      email: { type: 'string', format: 'email', example: 'alice@example.com' },
                      password: { type: 'string', format: 'password', minLength: 6 },
                      role: { type: 'string', enum: ['STAFF', 'DRIVER'] },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'User created successfully',
              },
            },
          },
        },
        '/users/{id}': {
          put: {
            tags: ['Users'],
            summary: 'Update user role',
            description: 'Update user role (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['role'],
                    properties: {
                      role: { type: 'string', enum: ['STAFF', 'DRIVER'] },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'User role updated successfully',
              },
            },
          },
          delete: {
            tags: ['Users'],
            summary: 'Delete user',
            description: 'Delete a user (Owner only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            responses: {
              '200': {
                description: 'User deleted successfully',
              },
            },
          },
        },
        '/subscriptions': {
          get: {
            tags: ['Subscriptions'],
            summary: 'List subscriptions',
            description: 'Get list of all subscriptions (Super Admin only)',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of subscriptions',
              },
            },
          },
          post: {
            tags: ['Subscriptions'],
            summary: 'Create subscription',
            description: 'Create a new subscription for a tenant (Super Admin only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['tenantId', 'plan', 'startDate', 'endDate'],
                    properties: {
                      tenantId: { type: 'string', format: 'uuid' },
                      plan: { type: 'string', enum: ['BASIC', 'PRO', 'ENTERPRISE'] },
                      startDate: { type: 'string', format: 'date-time' },
                      endDate: { type: 'string', format: 'date-time' },
                      status: { type: 'string', enum: ['ACTIVE', 'EXPIRED', 'CANCELED'], default: 'ACTIVE' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Subscription created successfully',
              },
            },
          },
        },
        '/subscriptions/{id}': {
          patch: {
            tags: ['Subscriptions'],
            summary: 'Update subscription',
            description: 'Update a subscription (Super Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      plan: { type: 'string', enum: ['BASIC', 'PRO', 'ENTERPRISE'] },
                      endDate: { type: 'string', format: 'date-time' },
                      status: { type: 'string', enum: ['ACTIVE', 'EXPIRED', 'CANCELED'] },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Subscription updated successfully',
              },
            },
          },
        },
        '/dashboard': {
          get: {
            tags: ['Dashboard'],
            summary: 'Get tenant dashboard',
            description: 'Get dashboard statistics for the authenticated tenant',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'Dashboard statistics',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'object',
                          properties: {
                            totalVehicles: { type: 'integer', example: 10 },
                            availableVehicles: { type: 'integer', example: 7 },
                            bookingsToday: { type: 'integer', example: 3 },
                            monthlyRevenue: { type: 'number', example: 15000000 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '/dashboard/admin': {
          get: {
            tags: ['Dashboard'],
            summary: 'Get admin dashboard',
            description: 'Get system-wide statistics (Super Admin only)',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'Admin dashboard statistics',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'object',
                          properties: {
                            totalTenants: { type: 'integer', example: 50 },
                            activeTenants: { type: 'integer', example: 45 },
                            mrr: { type: 'number', example: 25000000 },
                            churnRate: { type: 'number', example: 10 },
                          },
                        },
                      },
                    },
                  },
                },
              },
              '403': {
                description: 'Forbidden - Super Admin only',
              },
            },
          },
        },
      },
    });
  });
}
