import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError } from '../../utils/errors.ts';
import type { CreateMaintenanceRequestDto } from './dto/create-maintenance.request.dto.ts';
import type { MaintenanceResponseDto } from './dto/maintenance.response.dto.ts';

class MaintenanceService {
  async findAll(tenantId: string): Promise<MaintenanceResponseDto[]> {
    const logs = await prisma.maintenanceLog.findMany({
      where: { tenantId },
      orderBy: { date: 'desc' },
    });

    return logs.map((l) => this.mapToDto(l));
  }

  async findById(id: string, tenantId: string): Promise<MaintenanceResponseDto> {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, tenantId },
      include: {
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            brand: true,
            model: true,
          },
        },
      },
    });

    if (!log) {
      throw new NotFoundError('Maintenance log not found');
    }

    return this.mapToDto(log, true);
  }

  async create(data: CreateMaintenanceRequestDto, tenantId: string): Promise<MaintenanceResponseDto> {
    const log = await prisma.maintenanceLog.create({
      data: {
        tenantId,
        vehicleId: data.vehicleId,
        date: new Date(data.date),
        cost: data.cost,
        type: data.type,
        notes: data.notes,
      },
    });

    return this.mapToDto(log);
  }

  private mapToDto(log: any, includeRelations = false): MaintenanceResponseDto {
    const dto: MaintenanceResponseDto = {
      id: log.id,
      tenantId: log.tenantId,
      vehicleId: log.vehicleId,
      date: log.date.toISOString(),
      cost: Number(log.cost),
      type: log.type,
      notes: log.notes,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    };

    if (includeRelations && log.vehicle) {
      dto.vehicle = log.vehicle;
    }

    return dto;
  }
}

export const maintenanceService = new MaintenanceService();
