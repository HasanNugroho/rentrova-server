import { prisma } from '../../database/prisma/client.ts';
import { BadRequestError, NotFoundError } from '../../utils/errors.ts';
import { createAuditLog } from '../../utils/audit.ts';
import { pricingService } from '../pricing/pricing.service.ts';
import type { CreateBookingRequestDto } from './dto/create-booking.request.dto.ts';
import type { UpdateBookingStatusRequestDto } from './dto/update-booking-status.request.dto.ts';
import type { BookingResponseDto } from './dto/booking.response.dto.ts';

const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: ['ONGOING', 'CANCELED'],
  ONGOING: ['COMPLETED'],
};

class BookingsService {
  async findAll(tenantId: string): Promise<BookingResponseDto[]> {
    const bookings = await prisma.booking.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.mapToDto(b));
  }

  async findById(id: string, tenantId: string): Promise<BookingResponseDto> {
    const booking = await prisma.booking.findFirst({
      where: { id, tenantId },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        vehicle: { select: { id: true, plateNumber: true, brand: true, model: true, type: true } },
        driver: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    return this.mapToDto(booking, true);
  }

  async create(data: CreateBookingRequestDto, tenantId: string, userId: string): Promise<BookingResponseDto> {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    await this.checkVehicleAvailability(data.vehicleId, startDate, endDate, tenantId);

    if (data.driverId) {
      await this.checkDriverAvailability(data.driverId, startDate, endDate, tenantId);
    }

    const priceData = await pricingService.calculatePrice(
      {
        vehicleId: data.vehicleId,
        startDate: data.startDate,
        endDate: data.endDate,
        distanceKm: data.distanceKm,
        driverId: data.driverId || null,
      },
      tenantId,
    );

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          tenantId,
          customerId: data.customerId,
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          userId,
          startDate,
          endDate,
          distanceKm: data.distanceKm,
          totalPrice: priceData.totalPrice,
          notes: data.notes,
          status: 'PENDING',
        },
      });

      await tx.transaction.create({
        data: {
          tenantId,
          bookingId: booking.id,
          amount: priceData.totalPrice,
          paymentStatus: 'UNPAID',
        },
      });

      return booking;
    });

    await createAuditLog({
      tenantId,
      userId,
      action: 'BOOKING_CREATED',
      entity: 'Booking',
      entityId: result.id,
    });

    return this.mapToDto(result);
  }

  async updateStatus(
    id: string,
    data: UpdateBookingStatusRequestDto,
    tenantId: string,
    userId: string,
  ): Promise<BookingResponseDto> {
    const existing = await prisma.booking.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Booking not found');
    }

    const allowedTransitions = STATUS_TRANSITIONS[existing.status];
    if (!allowedTransitions || !allowedTransitions.includes(data.status)) {
      throw new BadRequestError(`Cannot transition from ${existing.status} to ${data.status}`);
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: data.status,
        cancelReason: data.cancelReason,
      },
    });

    await createAuditLog({
      tenantId,
      userId,
      action: 'BOOKING_STATUS_CHANGE',
      entity: 'Booking',
      entityId: id,
      meta: { from: existing.status, to: data.status },
    });

    return this.mapToDto(booking);
  }

  private async checkVehicleAvailability(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    tenantId: string,
  ): Promise<void> {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, tenantId },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestError('Vehicle is not available');
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        vehicleId,
        tenantId,
        status: { notIn: ['CANCELED'] },
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
      },
    });

    if (overlapping) {
      throw new BadRequestError('Vehicle is already booked for the selected dates');
    }
  }

  private async checkDriverAvailability(
    driverId: string,
    startDate: Date,
    endDate: Date,
    tenantId: string,
  ): Promise<void> {
    const driver = await prisma.driver.findFirst({
      where: { id: driverId, tenantId },
    });

    if (!driver) {
      throw new NotFoundError('Driver not found');
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        driverId,
        tenantId,
        status: { notIn: ['CANCELED'] },
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
      },
    });

    if (overlapping) {
      throw new BadRequestError('Driver is already assigned for the selected dates');
    }
  }

  private mapToDto(booking: any, includeRelations = false): BookingResponseDto {
    const dto: BookingResponseDto = {
      id: booking.id,
      tenantId: booking.tenantId,
      customerId: booking.customerId,
      vehicleId: booking.vehicleId,
      driverId: booking.driverId,
      userId: booking.userId,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      distanceKm: booking.distanceKm ? Number(booking.distanceKm) : null,
      totalPrice: Number(booking.totalPrice),
      notes: booking.notes,
      status: booking.status,
      cancelReason: booking.cancelReason,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };

    if (includeRelations) {
      if (booking.customer) dto.customer = booking.customer;
      if (booking.vehicle) dto.vehicle = booking.vehicle;
      if (booking.driver) dto.driver = booking.driver;
    }

    return dto;
  }
}

export const bookingsService = new BookingsService();
