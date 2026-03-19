# 🚗 Rentrova API Endpoints Documentation

Complete API reference for the Multi-Tenant Vehicle Rental SaaS system.

**Base URL**: `http://localhost:3000`

**Authentication**: All protected endpoints require JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [Tenants](#tenants)
3. [Vehicles](#vehicles)
4. [Customers](#customers)
5. [Drivers](#drivers)
6. [Bookings](#bookings)
7. [Pricing Rules](#pricing-rules)
8. [Finance/Transactions](#financetransactions)
9. [Maintenance](#maintenance)
10. [Users](#users)
11. [Subscriptions](#subscriptions)
12. [Dashboard](#dashboard)

---

## Authentication

### POST /auth/login
Login to get JWT access token.

**Access**: Public

**Request Body**:
```json
{
  "email": "owner1@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "owner1@example.com",
      "role": "TENANT_OWNER",
      "tenantId": "uuid"
    }
  }
}
```

**Error** (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "UNAUTHORIZED"
}
```

---

## Tenants

### GET /tenants
List all tenants in the system.

**Access**: SUPER_ADMIN only

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "ABC Rental Company",
      "email": "tenant@example.com",
      "phone": "+62812345678",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "subscriptionPlan": "BASIC",
      "status": "active",
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /tenants
Create a new tenant.

**Access**: SUPER_ADMIN only

**Request Body**:
```json
{
  "name": "ABC Rental Company",
  "email": "tenant@example.com",
  "phone": "+62812345678",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "subscriptionPlan": "BASIC"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC Rental Company",
    "email": "tenant@example.com",
    "phone": "+62812345678",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "subscriptionPlan": "BASIC",
    "status": "active",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### GET /tenants/:id
Get tenant details by ID.

**Access**: SUPER_ADMIN only

**Path Parameters**:
- `id` (string, required): Tenant UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC Rental Company",
    "email": "tenant@example.com",
    "phone": "+62812345678",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "subscriptionPlan": "BASIC",
    "status": "active",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### PATCH /tenants/:id/suspend
Suspend a tenant.

**Access**: SUPER_ADMIN only

**Path Parameters**:
- `id` (string, required): Tenant UUID

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "suspended"
  }
}
```

---

## Vehicles

### GET /vehicles
List all vehicles for the authenticated tenant.

**Access**: TENANT_OWNER, STAFF, DRIVER

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "plateNumber": "B 1234 ABC",
      "brand": "Toyota",
      "model": "Avanza",
      "year": 2022,
      "color": "Silver",
      "type": "Minibus",
      "capacity": 7,
      "pricePerDay": 350000,
      "status": "AVAILABLE",
      "notes": null,
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /vehicles
Create a new vehicle.

**Access**: TENANT_OWNER only

**Business Rule**: Subject to subscription limits (BASIC: 5, PRO: 20, ENTERPRISE: unlimited)

**Request Body**:
```json
{
  "plateNumber": "B 1234 ABC",
  "brand": "Toyota",
  "model": "Avanza",
  "year": 2022,
  "color": "Silver",
  "type": "Minibus",
  "capacity": 7,
  "pricePerDay": 350000,
  "status": "AVAILABLE",
  "notes": "Brand new vehicle"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "plateNumber": "B 1234 ABC",
    "brand": "Toyota",
    "model": "Avanza",
    "year": 2022,
    "color": "Silver",
    "type": "Minibus",
    "capacity": 7,
    "pricePerDay": 350000,
    "status": "AVAILABLE",
    "notes": "Brand new vehicle",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

**Error** (403 Forbidden):
```json
{
  "success": false,
  "error": "Vehicle limit reached for BASIC plan (max: 5)",
  "code": "FORBIDDEN"
}
```

### GET /vehicles/:id
Get vehicle details by ID.

**Access**: TENANT_OWNER, STAFF, DRIVER

**Path Parameters**:
- `id` (string, required): Vehicle UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "plateNumber": "B 1234 ABC",
    "brand": "Toyota",
    "model": "Avanza",
    "year": 2022,
    "color": "Silver",
    "type": "Minibus",
    "capacity": 7,
    "pricePerDay": 350000,
    "status": "AVAILABLE",
    "notes": null,
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### PUT /vehicles/:id
Update vehicle details.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Vehicle UUID

**Request Body** (all fields optional):
```json
{
  "plateNumber": "B 5678 DEF",
  "brand": "Honda",
  "model": "Brio",
  "year": 2023,
  "color": "White",
  "type": "Car",
  "capacity": 5,
  "pricePerDay": 250000,
  "status": "MAINTENANCE",
  "notes": "Under maintenance"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "plateNumber": "B 5678 DEF",
    "brand": "Honda",
    "model": "Brio",
    "year": 2023,
    "color": "White",
    "type": "Car",
    "capacity": 5,
    "pricePerDay": 250000,
    "status": "MAINTENANCE",
    "notes": "Under maintenance",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### DELETE /vehicles/:id
Delete a vehicle.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Vehicle UUID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

---

## Customers

### GET /customers
List all customers for the authenticated tenant.

**Access**: TENANT_OWNER, STAFF

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "name": "Ahmad Rizki",
      "phone": "+628123456789",
      "email": "ahmad@example.com",
      "identityNumber": "3201234567890001",
      "address": "Jl. Kebon Jeruk No. 10, Jakarta",
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /customers
Create a new customer.

**Access**: TENANT_OWNER, STAFF

**Request Body**:
```json
{
  "name": "Ahmad Rizki",
  "phone": "+628123456789",
  "email": "ahmad@example.com",
  "identityNumber": "3201234567890001",
  "address": "Jl. Kebon Jeruk No. 10, Jakarta"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Ahmad Rizki",
    "phone": "+628123456789",
    "email": "ahmad@example.com",
    "identityNumber": "3201234567890001",
    "address": "Jl. Kebon Jeruk No. 10, Jakarta",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### GET /customers/:id
Get customer details by ID.

**Access**: TENANT_OWNER, STAFF

**Path Parameters**:
- `id` (string, required): Customer UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Ahmad Rizki",
    "phone": "+628123456789",
    "email": "ahmad@example.com",
    "identityNumber": "3201234567890001",
    "address": "Jl. Kebon Jeruk No. 10, Jakarta",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### PUT /customers/:id
Update customer details.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Customer UUID

**Request Body** (all fields optional):
```json
{
  "name": "Ahmad Rizki Updated",
  "phone": "+628987654321",
  "email": "ahmad.new@example.com",
  "identityNumber": "3201234567890001",
  "address": "New Address, Jakarta"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ahmad Rizki Updated",
    "phone": "+628987654321",
    "email": "ahmad.new@example.com",
    "identityNumber": "3201234567890001",
    "address": "New Address, Jakarta",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

---

## Drivers

### GET /drivers
List all drivers for the authenticated tenant.

**Access**: TENANT_OWNER, STAFF

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "name": "Agus Supriadi",
      "phone": "+628567890123",
      "licenseNumber": "A1234567890",
      "status": "AVAILABLE",
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /drivers
Create a new driver.

**Access**: TENANT_OWNER only

**Request Body**:
```json
{
  "name": "Agus Supriadi",
  "phone": "+628567890123",
  "licenseNumber": "A1234567890",
  "status": "AVAILABLE"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Agus Supriadi",
    "phone": "+628567890123",
    "licenseNumber": "A1234567890",
    "status": "AVAILABLE",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### GET /drivers/:id
Get driver details by ID.

**Access**: TENANT_OWNER, STAFF

**Path Parameters**:
- `id` (string, required): Driver UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Agus Supriadi",
    "phone": "+628567890123",
    "licenseNumber": "A1234567890",
    "status": "AVAILABLE",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### GET /drivers/:id/schedule
Get driver's upcoming schedule/bookings.

**Access**: TENANT_OWNER, STAFF, DRIVER (can view own schedule)

**Path Parameters**:
- `id` (string, required): Driver UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "startDate": "2024-03-25T10:00:00Z",
      "endDate": "2024-03-30T10:00:00Z",
      "status": "CONFIRMED",
      "totalPrice": 2000000,
      "customer": {
        "id": "uuid",
        "name": "Ahmad Rizki",
        "phone": "+628123456789"
      },
      "vehicle": {
        "id": "uuid",
        "plateNumber": "B 1234 ABC",
        "brand": "Toyota",
        "model": "Avanza",
        "type": "Minibus"
      }
    }
  ]
}
```

### PUT /drivers/:id
Update driver details.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Driver UUID

**Request Body** (all fields optional):
```json
{
  "name": "Agus Supriadi Updated",
  "phone": "+628567890999",
  "licenseNumber": "A9999999999",
  "status": "ON_TRIP"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Agus Supriadi Updated",
    "phone": "+628567890999",
    "licenseNumber": "A9999999999",
    "status": "ON_TRIP",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

---

## Bookings

### GET /bookings
List all bookings for the authenticated tenant.

**Access**: TENANT_OWNER, STAFF

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "customerId": "uuid",
      "vehicleId": "uuid",
      "driverId": "uuid",
      "userId": "uuid",
      "startDate": "2024-03-25T10:00:00Z",
      "endDate": "2024-03-30T10:00:00Z",
      "distanceKm": 500,
      "totalPrice": 2000000,
      "notes": "Airport pickup",
      "status": "CONFIRMED",
      "cancelReason": null,
      "customer": {
        "id": "uuid",
        "name": "Ahmad Rizki",
        "phone": "+628123456789",
        "email": "ahmad@example.com"
      },
      "vehicle": {
        "id": "uuid",
        "plateNumber": "B 1234 ABC",
        "brand": "Toyota",
        "model": "Avanza",
        "type": "Minibus"
      },
      "driver": {
        "id": "uuid",
        "name": "Agus Supriadi",
        "phone": "+628567890123",
        "licenseNumber": "A1234567890"
      },
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /bookings
Create a new booking with automatic overlap validation and price calculation.

**Access**: TENANT_OWNER, STAFF

**Business Rules**:
- Vehicle must be available (no overlapping bookings)
- Driver must be available (no overlapping bookings)
- Creates transaction automatically
- Logs audit trail

**Request Body**:
```json
{
  "customerId": "uuid",
  "vehicleId": "uuid",
  "driverId": "uuid",
  "startDate": "2024-03-25T10:00:00Z",
  "endDate": "2024-03-30T10:00:00Z",
  "distanceKm": 500,
  "notes": "Airport pickup"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "customerId": "uuid",
    "vehicleId": "uuid",
    "driverId": "uuid",
    "userId": "uuid",
    "startDate": "2024-03-25T10:00:00Z",
    "endDate": "2024-03-30T10:00:00Z",
    "distanceKm": 500,
    "totalPrice": 2000000,
    "notes": "Airport pickup",
    "status": "PENDING",
    "cancelReason": null,
    "customer": {
      "id": "uuid",
      "name": "Ahmad Rizki",
      "phone": "+628123456789",
      "email": "ahmad@example.com"
    },
    "vehicle": {
      "id": "uuid",
      "plateNumber": "B 1234 ABC",
      "brand": "Toyota",
      "model": "Avanza",
      "type": "Minibus"
    },
    "driver": {
      "id": "uuid",
      "name": "Agus Supriadi",
      "phone": "+628567890123",
      "licenseNumber": "A1234567890"
    },
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

**Error** (400 Bad Request):
```json
{
  "success": false,
  "error": "Vehicle is already booked for the selected dates",
  "code": "BOOKING_OVERLAP"
}
```

### GET /bookings/:id
Get booking details by ID.

**Access**: TENANT_OWNER, STAFF

**Path Parameters**:
- `id` (string, required): Booking UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "customerId": "uuid",
    "vehicleId": "uuid",
    "driverId": "uuid",
    "userId": "uuid",
    "startDate": "2024-03-25T10:00:00Z",
    "endDate": "2024-03-30T10:00:00Z",
    "distanceKm": 500,
    "totalPrice": 2000000,
    "notes": "Airport pickup",
    "status": "CONFIRMED",
    "cancelReason": null,
    "customer": { /* ... */ },
    "vehicle": { /* ... */ },
    "driver": { /* ... */ },
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### PATCH /bookings/:id/status
Update booking status.

**Access**: TENANT_OWNER, STAFF

**Business Rule**: Only allowed status transitions:
- PENDING → CONFIRMED, CANCELED
- CONFIRMED → ONGOING, CANCELED
- ONGOING → COMPLETED
- CANCELED → (no transitions)
- COMPLETED → (no transitions)

**Path Parameters**:
- `id` (string, required): Booking UUID

**Request Body**:
```json
{
  "status": "CONFIRMED",
  "cancelReason": null
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

**Error** (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid status transition from COMPLETED to PENDING",
  "code": "INVALID_TRANSITION"
}
```

---

## Pricing Rules

### GET /pricing-rules
List all pricing rules for the authenticated tenant.

**Access**: TENANT_OWNER, STAFF

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "type": "PER_DAY",
      "value": 300000,
      "description": "Base daily rate",
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    },
    {
      "id": "uuid",
      "tenantId": "uuid",
      "type": "PER_KM",
      "value": 3000,
      "description": "Per kilometer charge",
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /pricing-rules
Create a new pricing rule.

**Access**: TENANT_OWNER only

**Request Body**:
```json
{
  "type": "PER_DAY",
  "value": 300000,
  "description": "Base daily rate"
}
```

**Pricing Types**:
- `PER_DAY`: Daily rental rate
- `PER_KM`: Per kilometer charge
- `DRIVER`: Driver fee per day
- `AREA`: Area surcharge

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "type": "PER_DAY",
    "value": 300000,
    "description": "Base daily rate",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### PUT /pricing-rules/:id
Update a pricing rule.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Pricing Rule UUID

**Request Body** (all fields optional):
```json
{
  "type": "PER_DAY",
  "value": 350000,
  "description": "Updated daily rate"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "PER_DAY",
    "value": 350000,
    "description": "Updated daily rate",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### DELETE /pricing-rules/:id
Delete a pricing rule.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Pricing Rule UUID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Pricing rule deleted successfully"
}
```

### POST /pricing-rules/calculate-price
Calculate total booking price based on pricing rules.

**Access**: TENANT_OWNER, STAFF

**Request Body**:
```json
{
  "vehicleId": "uuid",
  "startDate": "2024-03-25T10:00:00Z",
  "endDate": "2024-03-30T10:00:00Z",
  "distanceKm": 500,
  "driverId": "uuid"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalPrice": 2000000,
    "breakdown": {
      "durationDays": 5,
      "perDayTotal": 1500000,
      "perKmTotal": 150000,
      "driverTotal": 300000,
      "areaFee": 50000
    }
  }
}
```

---

## Finance/Transactions

### GET /transactions
List all transactions for the authenticated tenant.

**Access**: TENANT_OWNER only

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "bookingId": "uuid",
      "amount": 2000000,
      "paymentMethod": "CASH",
      "paymentStatus": "PAID",
      "paidAt": "2024-03-20T10:00:00Z",
      "notes": "Full payment received",
      "booking": {
        "id": "uuid",
        "startDate": "2024-03-25T10:00:00Z",
        "endDate": "2024-03-30T10:00:00Z",
        "status": "CONFIRMED",
        "customer": {
          "id": "uuid",
          "name": "Ahmad Rizki",
          "phone": "+628123456789"
        },
        "vehicle": {
          "id": "uuid",
          "plateNumber": "B 1234 ABC",
          "brand": "Toyota",
          "model": "Avanza"
        }
      },
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### GET /transactions/:id
Get transaction details by ID.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Transaction UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "bookingId": "uuid",
    "amount": 2000000,
    "paymentMethod": "CASH",
    "paymentStatus": "PAID",
    "paidAt": "2024-03-20T10:00:00Z",
    "notes": "Full payment received",
    "booking": { /* ... */ },
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### PATCH /transactions/:id/pay
Mark a transaction as paid.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Transaction UUID

**Request Body**:
```json
{
  "paymentMethod": "CASH",
  "paidAt": "2024-03-20T10:00:00Z",
  "notes": "Full payment received"
}
```

**Payment Methods**:
- `CASH`
- `TRANSFER`
- `CARD`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "paymentStatus": "PAID",
    "paymentMethod": "CASH",
    "paidAt": "2024-03-20T10:00:00Z",
    "notes": "Full payment received",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

---

## Maintenance

### GET /maintenance
List all maintenance logs for the authenticated tenant.

**Access**: TENANT_OWNER only

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "vehicleId": "uuid",
      "description": "Oil change and tire rotation",
      "cost": 500000,
      "maintenanceDate": "2024-03-20T00:00:00Z",
      "notes": "Regular maintenance",
      "vehicle": {
        "id": "uuid",
        "plateNumber": "B 1234 ABC",
        "brand": "Toyota",
        "model": "Avanza",
        "type": "Minibus"
      },
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /maintenance
Create a new maintenance log.

**Access**: TENANT_OWNER only

**Request Body**:
```json
{
  "vehicleId": "uuid",
  "description": "Oil change and tire rotation",
  "cost": 500000,
  "maintenanceDate": "2024-03-20T00:00:00Z",
  "notes": "Regular maintenance"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "vehicleId": "uuid",
    "description": "Oil change and tire rotation",
    "cost": 500000,
    "maintenanceDate": "2024-03-20T00:00:00Z",
    "notes": "Regular maintenance",
    "vehicle": {
      "id": "uuid",
      "plateNumber": "B 1234 ABC",
      "brand": "Toyota",
      "model": "Avanza",
      "type": "Minibus"
    },
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### GET /maintenance/:id
Get maintenance log details by ID.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): Maintenance Log UUID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "vehicleId": "uuid",
    "description": "Oil change and tire rotation",
    "cost": 500000,
    "maintenanceDate": "2024-03-20T00:00:00Z",
    "notes": "Regular maintenance",
    "vehicle": { /* ... */ },
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

---

## Users

### GET /users
List all users within the authenticated tenant.

**Access**: TENANT_OWNER only

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "STAFF",
      "createdAt": "2024-03-20T00:00:00Z",
      "updatedAt": "2024-03-20T00:00:00Z"
    }
  ]
}
```

### POST /users
Create a new user within the tenant.

**Access**: TENANT_OWNER only

**Business Rule**: Can only create STAFF or DRIVER roles

**Request Body**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123",
  "role": "STAFF"
}
```

**Allowed Roles**:
- `STAFF`
- `DRIVER`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "STAFF",
    "createdAt": "2024-03-20T00:00:00Z",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### PUT /users/:id
Update user role.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): User UUID

**Request Body**:
```json
{
  "role": "DRIVER"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role": "DRIVER",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

### DELETE /users/:id
Delete a user.

**Access**: TENANT_OWNER only

**Path Parameters**:
- `id` (string, required): User UUID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Subscriptions

### GET /subscriptions
List all subscriptions in the system.

**Access**: SUPER_ADMIN only

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "plan": "BASIC",
      "startDate": "2024-03-01T00:00:00Z",
      "endDate": "2024-04-01T00:00:00Z",
      "status": "ACTIVE",
      "tenant": {
        "id": "uuid",
        "name": "ABC Rental Company",
        "email": "tenant@example.com"
      },
      "createdAt": "2024-03-01T00:00:00Z",
      "updatedAt": "2024-03-01T00:00:00Z"
    }
  ]
}
```

### POST /subscriptions
Create a new subscription for a tenant.

**Access**: SUPER_ADMIN only

**Request Body**:
```json
{
  "tenantId": "uuid",
  "plan": "BASIC",
  "startDate": "2024-03-01T00:00:00Z",
  "endDate": "2024-04-01T00:00:00Z",
  "status": "ACTIVE"
}
```

**Subscription Plans**:
- `BASIC`: Max 5 vehicles
- `PRO`: Max 20 vehicles
- `ENTERPRISE`: Unlimited vehicles

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "plan": "BASIC",
    "startDate": "2024-03-01T00:00:00Z",
    "endDate": "2024-04-01T00:00:00Z",
    "status": "ACTIVE",
    "tenant": {
      "id": "uuid",
      "name": "ABC Rental Company",
      "email": "tenant@example.com"
    },
    "createdAt": "2024-03-01T00:00:00Z",
    "updatedAt": "2024-03-01T00:00:00Z"
  }
}
```

### PATCH /subscriptions/:id
Update a subscription.

**Access**: SUPER_ADMIN only

**Path Parameters**:
- `id` (string, required): Subscription UUID

**Request Body** (all fields optional):
```json
{
  "plan": "PRO",
  "endDate": "2024-05-01T00:00:00Z",
  "status": "ACTIVE"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "plan": "PRO",
    "endDate": "2024-05-01T00:00:00Z",
    "status": "ACTIVE",
    "updatedAt": "2024-03-20T00:00:00Z"
  }
}
```

---

## Dashboard

### GET /dashboard
Get dashboard statistics for the authenticated tenant.

**Access**: TENANT_OWNER, STAFF

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalVehicles": 10,
    "availableVehicles": 7,
    "bookingsToday": 3,
    "monthlyRevenue": 15000000
  }
}
```

### GET /dashboard/admin
Get system-wide dashboard statistics.

**Access**: SUPER_ADMIN only

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalTenants": 50,
    "activeTenants": 45,
    "mrr": 25000000,
    "churnRate": 10
  }
}
```

**Metrics Explained**:
- `totalTenants`: Total number of tenants in the system
- `activeTenants`: Number of active (non-suspended) tenants
- `mrr`: Monthly Recurring Revenue (sum of all active subscription values)
- `churnRate`: Percentage of suspended tenants

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed: email: Invalid email",
  "code": "VALIDATION_ERROR"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied. Required role: TENANT_OWNER",
  "code": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Resource already exists",
  "code": "CONFLICT"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

---

## Role-Based Access Matrix

| Endpoint | SUPER_ADMIN | TENANT_OWNER | STAFF | DRIVER |
|----------|-------------|--------------|-------|--------|
| POST /auth/login | ✅ | ✅ | ✅ | ✅ |
| GET /tenants | ✅ | ❌ | ❌ | ❌ |
| POST /tenants | ✅ | ❌ | ❌ | ❌ |
| GET /vehicles | ✅ | ✅ | ✅ | ✅ |
| POST /vehicles | ❌ | ✅ | ❌ | ❌ |
| PUT /vehicles/:id | ❌ | ✅ | ❌ | ❌ |
| DELETE /vehicles/:id | ❌ | ✅ | ❌ | ❌ |
| GET /customers | ❌ | ✅ | ✅ | ❌ |
| POST /customers | ❌ | ✅ | ✅ | ❌ |
| PUT /customers/:id | ❌ | ✅ | ❌ | ❌ |
| GET /drivers | ❌ | ✅ | ✅ | ❌ |
| POST /drivers | ❌ | ✅ | ❌ | ❌ |
| GET /drivers/:id/schedule | ❌ | ✅ | ✅ | ✅ (own) |
| GET /bookings | ❌ | ✅ | ✅ | ❌ |
| POST /bookings | ❌ | ✅ | ✅ | ❌ |
| PATCH /bookings/:id/status | ❌ | ✅ | ✅ | ❌ |
| GET /pricing-rules | ❌ | ✅ | ✅ | ❌ |
| POST /pricing-rules | ❌ | ✅ | ❌ | ❌ |
| GET /transactions | ❌ | ✅ | ❌ | ❌ |
| PATCH /transactions/:id/pay | ❌ | ✅ | ❌ | ❌ |
| GET /maintenance | ❌ | ✅ | ❌ | ❌ |
| POST /maintenance | ❌ | ✅ | ❌ | ❌ |
| GET /users | ❌ | ✅ | ❌ | ❌ |
| POST /users | ❌ | ✅ | ❌ | ❌ |
| GET /subscriptions | ✅ | ❌ | ❌ | ❌ |
| POST /subscriptions | ✅ | ❌ | ❌ | ❌ |
| GET /dashboard | ❌ | ✅ | ✅ | ❌ |
| GET /dashboard/admin | ✅ | ❌ | ❌ | ❌ |

---

## Rate Limiting

All endpoints are rate-limited to **100 requests per 15 minutes** per IP address.

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710892800
```

**Rate Limit Exceeded** (429 Too Many Requests):
```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner1@example.com",
    "password": "password123"
  }'
```

### Create Booking Example
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "customerId": "uuid",
    "vehicleId": "uuid",
    "driverId": "uuid",
    "startDate": "2024-03-25T10:00:00Z",
    "endDate": "2024-03-30T10:00:00Z",
    "distanceKm": 500,
    "notes": "Airport pickup"
  }'
```

### Get Driver Schedule Example
```bash
curl -X GET http://localhost:3000/drivers/uuid/schedule \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Postman Collection

Import this base URL and environment variables into Postman:

**Base URL**: `http://localhost:3000`

**Environment Variables**:
- `base_url`: `http://localhost:3000`
- `token`: `<your-jwt-token-from-login>`
- `tenant_id`: `<your-tenant-uuid>`

---

**Last Updated**: March 20, 2024  
**API Version**: 1.0.0
