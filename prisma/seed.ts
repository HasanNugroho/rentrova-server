import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@rentrova.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@rentrova.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      tenantId: null,
    },
  });
  console.log('✅ Created Super Admin:', superAdmin.email);

  const tenant1 = await prisma.tenant.upsert({
    where: { email: 'tenant1@example.com' },
    update: {},
    create: {
      name: 'ABC Rental Company',
      email: 'tenant1@example.com',
      phone: '+62812345678',
      address: 'Jl. Sudirman No. 123, Jakarta',
      subscriptionPlan: 'BASIC',
      status: 'active',
    },
  });
  console.log('✅ Created Tenant 1:', tenant1.name);

  const tenant2 = await prisma.tenant.upsert({
    where: { email: 'tenant2@example.com' },
    update: {},
    create: {
      name: 'XYZ Transport Services',
      email: 'tenant2@example.com',
      phone: '+62823456789',
      address: 'Jl. Thamrin No. 456, Jakarta',
      subscriptionPlan: 'PRO',
      status: 'active',
    },
  });
  console.log('✅ Created Tenant 2:', tenant2.name);

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'owner1@example.com',
      password: hashedPassword,
      role: 'TENANT_OWNER',
      tenantId: tenant1.id,
    },
  });
  console.log('✅ Created Tenant Owner 1:', owner1.email);

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'owner2@example.com',
      password: hashedPassword,
      role: 'TENANT_OWNER',
      tenantId: tenant2.id,
    },
  });
  console.log('✅ Created Tenant Owner 2:', owner2.email);

  const staff1 = await prisma.user.upsert({
    where: { email: 'staff1@example.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'staff1@example.com',
      password: hashedPassword,
      role: 'STAFF',
      tenantId: tenant1.id,
    },
  });
  console.log('✅ Created Staff 1:', staff1.email);

  const staff2 = await prisma.user.upsert({
    where: { email: 'staff2@example.com' },
    update: {},
    create: {
      name: 'Bob Williams',
      email: 'staff2@example.com',
      password: hashedPassword,
      role: 'STAFF',
      tenantId: tenant2.id,
    },
  });
  console.log('✅ Created Staff 2:', staff2.email);

  const vehicles1 = await Promise.all([
    prisma.vehicle.create({
      data: {
        tenantId: tenant1.id,
        plateNumber: 'B 1234 ABC',
        brand: 'Toyota',
        model: 'Avanza',
        year: 2022,
        color: 'Silver',
        type: 'Minibus',
        capacity: 7,
        pricePerDay: 350000,
        status: 'AVAILABLE',
      },
    }),
    prisma.vehicle.create({
      data: {
        tenantId: tenant1.id,
        plateNumber: 'B 5678 DEF',
        brand: 'Honda',
        model: 'Brio',
        year: 2021,
        color: 'White',
        type: 'Car',
        capacity: 5,
        pricePerDay: 250000,
        status: 'AVAILABLE',
      },
    }),
    prisma.vehicle.create({
      data: {
        tenantId: tenant1.id,
        plateNumber: 'B 9012 GHI',
        brand: 'Isuzu',
        model: 'Elf',
        year: 2020,
        color: 'Blue',
        type: 'Bus',
        capacity: 16,
        pricePerDay: 600000,
        status: 'AVAILABLE',
      },
    }),
  ]);
  console.log('✅ Created 3 vehicles for Tenant 1');

  const vehicles2 = await Promise.all([
    prisma.vehicle.create({
      data: {
        tenantId: tenant2.id,
        plateNumber: 'B 3456 JKL',
        brand: 'Toyota',
        model: 'Innova',
        year: 2023,
        color: 'Black',
        type: 'Minibus',
        capacity: 7,
        pricePerDay: 400000,
        status: 'AVAILABLE',
      },
    }),
    prisma.vehicle.create({
      data: {
        tenantId: tenant2.id,
        plateNumber: 'B 7890 MNO',
        brand: 'Suzuki',
        model: 'Ertiga',
        year: 2022,
        color: 'Red',
        type: 'Minibus',
        capacity: 7,
        pricePerDay: 300000,
        status: 'AVAILABLE',
      },
    }),
    prisma.vehicle.create({
      data: {
        tenantId: tenant2.id,
        plateNumber: 'B 2345 PQR',
        brand: 'Mercedes',
        model: 'Sprinter',
        year: 2023,
        color: 'White',
        type: 'Bus',
        capacity: 20,
        pricePerDay: 1200000,
        status: 'AVAILABLE',
      },
    }),
  ]);
  console.log('✅ Created 3 vehicles for Tenant 2');

  const customers1 = await Promise.all([
    prisma.customer.create({
      data: {
        tenantId: tenant1.id,
        name: 'Ahmad Rizki',
        phone: '+628123456789',
        email: 'ahmad@example.com',
        identityNumber: '3201234567890001',
        address: 'Jl. Kebon Jeruk No. 10, Jakarta',
      },
    }),
    prisma.customer.create({
      data: {
        tenantId: tenant1.id,
        name: 'Siti Nurhaliza',
        phone: '+628234567890',
        email: 'siti@example.com',
        identityNumber: '3201234567890002',
        address: 'Jl. Mangga Dua No. 20, Jakarta',
      },
    }),
  ]);
  console.log('✅ Created 2 customers for Tenant 1');

  const customers2 = await Promise.all([
    prisma.customer.create({
      data: {
        tenantId: tenant2.id,
        name: 'Budi Santoso',
        phone: '+628345678901',
        email: 'budi@example.com',
        identityNumber: '3201234567890003',
        address: 'Jl. Gatot Subroto No. 30, Jakarta',
      },
    }),
    prisma.customer.create({
      data: {
        tenantId: tenant2.id,
        name: 'Dewi Lestari',
        phone: '+628456789012',
        email: 'dewi@example.com',
        identityNumber: '3201234567890004',
        address: 'Jl. Kuningan No. 40, Jakarta',
      },
    }),
  ]);
  console.log('✅ Created 2 customers for Tenant 2');

  const driver1 = await prisma.driver.create({
    data: {
      tenantId: tenant1.id,
      name: 'Agus Supriadi',
      phone: '+628567890123',
      licenseNumber: 'A1234567890',
      status: 'AVAILABLE',
    },
  });
  console.log('✅ Created driver for Tenant 1:', driver1.name);

  const driver2 = await prisma.driver.create({
    data: {
      tenantId: tenant2.id,
      name: 'Eko Prasetyo',
      phone: '+628678901234',
      licenseNumber: 'B9876543210',
      status: 'AVAILABLE',
    },
  });
  console.log('✅ Created driver for Tenant 2:', driver2.name);

  const pricingRules1 = await Promise.all([
    prisma.pricingRule.create({
      data: {
        tenantId: tenant1.id,
        type: 'PER_DAY',
        value: 300000,
        description: 'Base daily rate',
      },
    }),
    prisma.pricingRule.create({
      data: {
        tenantId: tenant1.id,
        type: 'PER_KM',
        value: 3000,
        description: 'Per kilometer charge',
      },
    }),
    prisma.pricingRule.create({
      data: {
        tenantId: tenant1.id,
        type: 'DRIVER',
        value: 150000,
        description: 'Driver fee per day',
      },
    }),
    prisma.pricingRule.create({
      data: {
        tenantId: tenant1.id,
        type: 'AREA',
        value: 50000,
        description: 'Area surcharge',
      },
    }),
  ]);
  console.log('✅ Created pricing rules for Tenant 1');

  const pricingRules2 = await Promise.all([
    prisma.pricingRule.create({
      data: {
        tenantId: tenant2.id,
        type: 'PER_DAY',
        value: 350000,
        description: 'Base daily rate',
      },
    }),
    prisma.pricingRule.create({
      data: {
        tenantId: tenant2.id,
        type: 'PER_KM',
        value: 3500,
        description: 'Per kilometer charge',
      },
    }),
    prisma.pricingRule.create({
      data: {
        tenantId: tenant2.id,
        type: 'DRIVER',
        value: 200000,
        description: 'Driver fee per day',
      },
    }),
    prisma.pricingRule.create({
      data: {
        tenantId: tenant2.id,
        type: 'AREA',
        value: 75000,
        description: 'Area surcharge',
      },
    }),
  ]);
  console.log('✅ Created pricing rules for Tenant 2');

  const subscription1 = await prisma.subscription.create({
    data: {
      tenantId: tenant1.id,
      plan: 'BASIC',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created subscription for Tenant 1');

  const subscription2 = await prisma.subscription.create({
    data: {
      tenantId: tenant2.id,
      plan: 'PRO',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created subscription for Tenant 2');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Super Admin: superadmin@rentrova.com / password123');
  console.log('Tenant 1 Owner: owner1@example.com / password123');
  console.log('Tenant 2 Owner: owner2@example.com / password123');
  console.log('Staff 1: staff1@example.com / password123');
  console.log('Staff 2: staff2@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
