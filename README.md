# Rentrova Server

Production-ready backend boilerplate built with **Bun runtime**, featuring a modular NestJS-inspired architecture, complete authentication system, and comprehensive developer tooling.

## 🚀 Features

- ⚡ **Bun Runtime** - Lightning-fast JavaScript runtime
- 🏗️ **Modular Architecture** - Clean, scalable, NestJS-inspired structure
- 🔐 **JWT Authentication** - Access & refresh token implementation
- 📊 **PostgreSQL + Prisma** - Type-safe database ORM
- 🔴 **Redis Integration** - Caching and rate limiting
- 📝 **Swagger Documentation** - Auto-generated API docs
- ✅ **Input Validation** - Zod schema validation
- 🛡️ **Security Best Practices** - CORS, rate limiting, secure headers
- 📄 **Pagination Support** - Built-in pagination utilities
- 🧪 **Testing Setup** - Vitest for unit testing
- 🎨 **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- 🐳 **Docker Ready** - Complete Docker setup with docker-compose
- 📊 **Logging** - Pino logger with pretty printing

## 📁 Project Structure

```
src/
├── app.ts                    # Application setup
├── server.ts                 # Server entry point
├── config/                   # Configuration files
│   ├── env.config.ts        # Environment validation (Zod)
│   └── logger.config.ts     # Pino logger setup
├── modules/                  # Feature modules
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.route.ts
│   │   ├── auth.validation.ts
│   │   └── auth.service.test.ts
│   └── user/                # User management module
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.route.ts
│       └── user.validation.ts
├── common/                   # Shared utilities
│   ├── middleware/          # Global middleware
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── rate-limiter.middleware.ts
│   ├── utils/               # Utility functions
│   │   ├── hash.util.ts
│   │   ├── jwt.util.ts
│   │   ├── pagination.util.ts
│   │   └── response.util.ts
│   ├── interfaces/          # TypeScript interfaces
│   └── constants/           # Application constants
├── database/                 # Database clients
│   ├── prisma/
│   │   └── client.ts        # Prisma singleton
│   └── redis/
│       ├── client.ts        # Redis singleton
│       └── redis.service.ts # Redis service
├── docs/                     # API documentation
│   └── swagger.ts           # Swagger/OpenAPI setup
└── types/                    # Global type definitions
```

## 🛠️ Installation

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- PostgreSQL >= 14
- Redis >= 6

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd rentrova-server
```

2. **Install dependencies**
```bash
bun install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/rentrova_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_ACCESS_SECRET=your-super-secret-access-token-key
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
```

4. **Generate Prisma Client**
```bash
bun run db:generate
```

5. **Run database migrations**
```bash
bun run db:migrate
```

6. **Setup Husky (Git hooks)**
```bash
bun run prepare
```

## 🚀 Running the Application

### Development Mode
```bash
bun run dev
```

### Production Mode
```bash
bun run start
```

### Build
```bash
bun run build
```

## 🐳 Docker

### Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

This will start:
- Application server (port 3000)
- PostgreSQL database (port 5432)
- Redis (port 6379)

### Build Docker Image
```bash
docker build -t rentrova-server .
```

## 📚 API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/docs
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Users (Protected)
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (Admin only)
- `PATCH /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Health Check
- `GET /health` - Health check endpoint

## 🧪 Testing

### Run all tests
```bash
bun test
```

### Run tests in watch mode
```bash
bun run test:watch
```

### Run tests with coverage
```bash
bun test --coverage
```

## 🎨 Code Quality

### Linting
```bash
bun run lint
bun run lint:fix
```

### Formatting
```bash
bun run format
bun run format:check
```

## 📊 Database

### Prisma Commands
```bash
bun run db:generate    # Generate Prisma Client
bun run db:push        # Push schema to database
bun run db:migrate     # Run migrations
bun run db:studio      # Open Prisma Studio
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **CORS Protection** - Configurable CORS middleware
- **Rate Limiting** - Redis-based rate limiting
- **Input Validation** - Zod schema validation
- **Error Handling** - Global error handler with proper status codes

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "code": 400,
  "errors": ["Validation error 1", "Validation error 2"]
}
```

## 🔄 Pagination

All list endpoints support pagination via query parameters:
```
GET /api/v1/users?page=1&limit=10
```

## 🏗️ Creating a New Module

1. Create module directory in `src/modules/`
2. Add the following files:
   - `{module}.controller.ts` - Request handlers
   - `{module}.service.ts` - Business logic
   - `{module}.route.ts` - Route definitions
   - `{module}.validation.ts` - Zod schemas
3. Register routes in `src/app.ts`

Example:
```typescript
// src/modules/product/product.route.ts
import { Hono } from 'hono';
import { productController } from './product.controller.ts';

const productRouter = new Hono();
productRouter.get('/', (c) => productController.findAll(c));

export { productRouter };
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_ACCESS_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |

## 📦 Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis + ioredis
- **Validation:** Zod
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Logging:** Pino
- **Testing:** Vitest
- **Code Quality:** ESLint, Prettier, Husky
- **Documentation:** Swagger/OpenAPI

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with ❤️ using Bun and modern TypeScript best practices.
