# 🚗 Rentrova - Multi-Tenant Vehicle Rental SaaS Setup Guide

## 📋 Prerequisites

- **Bun** >= 1.0.0 ([Install Bun](https://bun.sh))
- **PostgreSQL** >= 14
- **Redis** >= 6.0
- **Docker** (optional, for containerized setup)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=rentrova-server

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rentrova_db?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
```

### 3. Database Setup

Generate Prisma client and push schema to database:

```bash
bun run db:generate
bun run db:push
```

Or use migrations (recommended for production):

```bash
bun run db:migrate
```

### 4. Seed Database

Populate the database with sample data:

```bash
bun run db:seed
```

This creates:
- 1 Super Admin
- 2 Tenants (BASIC and PRO plans)
- 2 Tenant Owners
- 2 Staff members
- 6 Vehicles (3 per tenant)
- 4 Customers (2 per tenant)
- 2 Drivers (1 per tenant)
- Pricing rules for each tenant
- Active subscriptions

### 5. Start Development Server

```bash
bun run dev
```

The API will be available at `http://localhost:3000`

## 🐳 Docker Setup

### Using Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Application server

## 📝 Test Credentials

After seeding, you can login with these credentials:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@rentrova.com | password123 |
| Tenant 1 Owner | owner1@example.com | password123 |
| Tenant 2 Owner | owner2@example.com | password123 |
| Staff 1 | staff1@example.com | password123 |
| Staff 2 | staff2@example.com | password123 |

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - Login with email and password

### Tenants (Super Admin only)
- `GET /tenants` - List all tenants
- `POST /tenants` - Create new tenant
- `GET /tenants/:id` - Get tenant details
- `PATCH /tenants/:id/suspend` - Suspend tenant

### Vehicles
- `GET /vehicles` - List vehicles (tenant-scoped)
- `POST /vehicles` - Create vehicle (Owner only)
- `GET /vehicles/:id` - Get vehicle details
- `PUT /vehicles/:id` - Update vehicle (Owner only)
- `DELETE /vehicles/:id` - Delete vehicle (Owner only)

### Customers
- `GET /customers` - List customers
- `POST /customers` - Create customer
- `GET /customers/:id` - Get customer details
- `PUT /customers/:id` - Update customer (Owner only)

### Drivers
- `GET /drivers` - List drivers
- `POST /drivers` - Create driver (Owner only)
- `GET /drivers/:id` - Get driver details
- `GET /drivers/:id/schedule` - Get driver schedule (Driver can view own)
- `PUT /drivers/:id` - Update driver (Owner only)

### Bookings
- `GET /bookings` - List bookings
- `POST /bookings` - Create booking (with overlap validation)
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id/status` - Update booking status

### Pricing Rules
- `GET /pricing-rules` - List pricing rules
- `POST /pricing-rules` - Create pricing rule (Owner only)
- `PUT /pricing-rules/:id` - Update pricing rule (Owner only)
- `DELETE /pricing-rules/:id` - Delete pricing rule (Owner only)
- `POST /pricing-rules/calculate-price` - Calculate booking price

### Finance/Transactions
- `GET /transactions` - List transactions (Owner only)
- `GET /transactions/:id` - Get transaction details (Owner only)
- `PATCH /transactions/:id/pay` - Mark transaction as paid (Owner only)

### Maintenance
- `GET /maintenance` - List maintenance logs (Owner only)
- `POST /maintenance` - Create maintenance log (Owner only)
- `GET /maintenance/:id` - Get maintenance details (Owner only)

### Users
- `GET /users` - List tenant users (Owner only)
- `POST /users` - Create user (Owner only)
- `PUT /users/:id` - Update user role (Owner only)
- `DELETE /users/:id` - Delete user (Owner only)

### Subscriptions (Super Admin only)
- `GET /subscriptions` - List all subscriptions
- `POST /subscriptions` - Create subscription
- `PATCH /subscriptions/:id` - Update subscription

### Dashboard
- `GET /dashboard` - Get tenant dashboard stats
- `GET /dashboard/admin` - Get admin dashboard (Super Admin only)

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login Example

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner1@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "owner1@example.com",
      "role": "TENANT_OWNER",
      "tenantId": "..."
    }
  }
}
```

## 🎯 Key Features

### Multi-Tenancy
- Complete tenant isolation
- Subscription-based vehicle limits (BASIC: 5, PRO: 20, ENTERPRISE: unlimited)
- Super Admin can manage all tenants

### Role-Based Access Control
- **SUPER_ADMIN**: Full system access
- **TENANT_OWNER**: Full access within their tenant
- **STAFF**: Read/write access to bookings, customers, vehicles
- **DRIVER**: Can login and view their own schedule

### Business Rules
- Vehicle availability checking (no overlapping bookings)
- Driver schedule validation (no double-booking)
- Automatic price calculation based on pricing rules
- Booking status transitions validation
- Audit logging for sensitive operations

### Pricing System
- Configurable pricing rules per tenant
- Types: PER_DAY, PER_KM, DRIVER, AREA
- Automatic price calculation on booking creation

### Security
- JWT authentication with access tokens
- bcrypt password hashing (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Zod request validation

## 🛠️ Development Commands

```bash
# Development
bun run dev              # Start dev server with hot reload
bun run start            # Start production server

# Database
bun run db:generate      # Generate Prisma client
bun run db:push          # Push schema to database
bun run db:migrate       # Run migrations
bun run db:seed          # Seed database
bun run db:studio        # Open Prisma Studio

# Code Quality
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint issues
bun run format           # Format code with Prettier
bun run format:check     # Check code formatting

# Testing
bun run test             # Run tests
bun run test:watch       # Run tests in watch mode
```

## 📊 Database Schema

The system uses the following main models:

- **Tenant**: Multi-tenant organizations
- **User**: System users with roles
- **Vehicle**: Rental vehicles
- **Booking**: Vehicle bookings with overlap validation
- **Customer**: Tenant customers
- **Driver**: Drivers with schedule management
- **Transaction**: Financial transactions
- **PricingRule**: Configurable pricing rules
- **MaintenanceLog**: Vehicle maintenance records
- **Subscription**: Tenant subscription management
- **AuditLog**: Audit trail for sensitive operations

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

## 📚 Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Hono Documentation](https://hono.dev)

## 🤝 Support

For issues or questions, please check the documentation or create an issue in the repository.
