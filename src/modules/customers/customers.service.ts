import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError } from '../../utils/errors.ts';
import type { CreateCustomerRequestDto } from './dto/create-customer.request.dto.ts';
import type { UpdateCustomerRequestDto } from './dto/update-customer.request.dto.ts';
import type { CustomerResponseDto } from './dto/customer.response.dto.ts';

class CustomersService {
  async findAll(tenantId: string): Promise<CustomerResponseDto[]> {
    const customers = await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return customers.map((c) => this.mapToDto(c));
  }

  async findById(id: string, tenantId: string): Promise<CustomerResponseDto> {
    const customer = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    return this.mapToDto(customer);
  }

  async create(data: CreateCustomerRequestDto, tenantId: string): Promise<CustomerResponseDto> {
    const customer = await prisma.customer.create({
      data: {
        tenantId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        identityNumber: data.identityNumber,
        address: data.address,
      },
    });

    return this.mapToDto(customer);
  }

  async update(id: string, data: UpdateCustomerRequestDto, tenantId: string): Promise<CustomerResponseDto> {
    const existing = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Customer not found');
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        identityNumber: data.identityNumber,
        address: data.address,
      },
    });

    return this.mapToDto(customer);
  }

  private mapToDto(customer: any): CustomerResponseDto {
    return {
      id: customer.id,
      tenantId: customer.tenantId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      identityNumber: customer.identityNumber,
      address: customer.address,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };
  }
}

export const customersService = new CustomersService();
