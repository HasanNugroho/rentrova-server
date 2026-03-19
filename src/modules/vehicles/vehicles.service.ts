import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError, ForbiddenError } from '../../utils/errors.ts';
import type { CreateVehicleRequestDto } from './dto/create-vehicle.request.dto.ts';
import type { UpdateVehicleRequestDto } from './dto/update-vehicle.request.dto.ts';
import type { VehicleResponseDto } from './dto/vehicle.response.dto.ts';

const VEHICLE_LIMITS = {
  BASIC: 5,
  PRO: 20,
  ENTERPRISE: Infinity,
};

class VehiclesService {
  async findAll(tenantId: string): Promise<VehicleResponseDto[]> {
    const vehicles = await prisma.vehicle.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return vehicles.map((v) => this.mapToDto(v));
  }

  async findById(id: string, tenantId: string): Promise<VehicleResponseDto> {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id, tenantId },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    return this.mapToDto(vehicle);
  }

  async create(data: CreateVehicleRequestDto, tenantId: string): Promise<VehicleResponseDto> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { vehicles: true },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    const limit = VEHICLE_LIMITS[tenant.subscriptionPlan];
    if (tenant.vehicles.length >= limit) {
      throw new ForbiddenError('Vehicle limit reached for your subscription plan');
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        tenantId,
        plateNumber: data.plateNumber,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        type: data.type,
        capacity: data.capacity,
        pricePerDay: data.pricePerDay,
        status: data.status || 'AVAILABLE',
        notes: data.notes,
      },
    });

    return this.mapToDto(vehicle);
  }

  async update(id: string, data: UpdateVehicleRequestDto, tenantId: string): Promise<VehicleResponseDto> {
    const existing = await prisma.vehicle.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Vehicle not found');
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plateNumber: data.plateNumber,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        type: data.type,
        capacity: data.capacity,
        pricePerDay: data.pricePerDay,
        status: data.status,
        notes: data.notes,
      },
    });

    return this.mapToDto(vehicle);
  }

  async delete(id: string, tenantId: string): Promise<{ id: string }> {
    const existing = await prisma.vehicle.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Vehicle not found');
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    return { id };
  }

  private mapToDto(vehicle: any): VehicleResponseDto {
    return {
      id: vehicle.id,
      tenantId: vehicle.tenantId,
      plateNumber: vehicle.plateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      type: vehicle.type,
      capacity: vehicle.capacity,
      pricePerDay: Number(vehicle.pricePerDay),
      status: vehicle.status,
      notes: vehicle.notes,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }
}

export const vehiclesService = new VehiclesService();
