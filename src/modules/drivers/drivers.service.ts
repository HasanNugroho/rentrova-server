import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError } from '../../utils/errors.ts';
import type { CreateDriverRequestDto } from './dto/create-driver.request.dto.ts';
import type { UpdateDriverRequestDto } from './dto/update-driver.request.dto.ts';
import type { DriverResponseDto } from './dto/driver.response.dto.ts';

class DriversService {
  async findAll(tenantId: string): Promise<DriverResponseDto[]> {
    const drivers = await prisma.driver.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return drivers.map((d) => this.mapToDto(d));
  }

  async findById(id: string, tenantId: string): Promise<DriverResponseDto> {
    const driver = await prisma.driver.findFirst({
      where: { id, tenantId },
    });

    if (!driver) {
      throw new NotFoundError('Driver not found');
    }

    return this.mapToDto(driver);
  }

  async getSchedule(id: string, tenantId: string, userId?: string) {
    const driver = await prisma.driver.findFirst({
      where: { id, tenantId },
    });

    if (!driver) {
      throw new NotFoundError('Driver not found');
    }

    const bookings = await prisma.booking.findMany({
      where: {
        driverId: id,
        tenantId,
        status: { in: ['PENDING', 'CONFIRMED', 'ONGOING'] },
      },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        vehicle: { select: { id: true, plateNumber: true, brand: true, model: true, type: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    return bookings.map((b) => ({
      id: b.id,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      status: b.status,
      totalPrice: Number(b.totalPrice),
      notes: b.notes,
      customer: b.customer,
      vehicle: b.vehicle,
    }));
  }

  async create(data: CreateDriverRequestDto, tenantId: string): Promise<DriverResponseDto> {
    const driver = await prisma.driver.create({
      data: {
        tenantId,
        name: data.name,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        status: data.status || 'AVAILABLE',
      },
    });

    return this.mapToDto(driver);
  }

  async update(id: string, data: UpdateDriverRequestDto, tenantId: string): Promise<DriverResponseDto> {
    const existing = await prisma.driver.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Driver not found');
    }

    const driver = await prisma.driver.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        status: data.status,
      },
    });

    return this.mapToDto(driver);
  }

  private mapToDto(driver: any): DriverResponseDto {
    return {
      id: driver.id,
      tenantId: driver.tenantId,
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      status: driver.status,
      createdAt: driver.createdAt.toISOString(),
      updatedAt: driver.updatedAt.toISOString(),
    };
  }
}

export const driversService = new DriversService();
