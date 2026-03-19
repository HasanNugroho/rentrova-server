import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError } from '../../utils/errors.ts';
import type { CreateTenantRequestDto } from './dto/create-tenant.request.dto.ts';
import type { TenantResponseDto } from './dto/tenant.response.dto.ts';

class TenantsService {
  async findAll(): Promise<TenantResponseDto[]> {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return tenants.map((tenant) => this.mapToDto(tenant));
  }

  async findById(id: string): Promise<TenantResponseDto> {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    return this.mapToDto(tenant);
  }

  async create(data: CreateTenantRequestDto): Promise<TenantResponseDto> {
    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        subscriptionPlan: data.subscriptionPlan,
      },
    });

    return this.mapToDto(tenant);
  }

  async suspend(id: string): Promise<TenantResponseDto> {
    const tenant = await prisma.tenant.update({
      where: { id },
      data: { status: 'suspended' },
    });

    return this.mapToDto(tenant);
  }

  private mapToDto(tenant: any): TenantResponseDto {
    return {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      subscriptionPlan: tenant.subscriptionPlan,
      status: tenant.status,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }
}

export const tenantsService = new TenantsService();
