import type { Context } from 'hono';
import { bookingsService } from './bookings.service.ts';
import { CreateBookingRequestSchema } from './dto/create-booking.request.dto.ts';
import { UpdateBookingStatusRequestSchema } from './dto/update-booking-status.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class BookingsController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const bookings = await bookingsService.findAll(tenantId);
    return c.json(ResponseUtil.success(bookings));
  }

  async findById(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const booking = await bookingsService.findById(id, tenantId);
    return c.json(ResponseUtil.success(booking));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateBookingRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const user = c.get('user');
    const booking = await bookingsService.create(data, tenantId, user.userId);
    return c.json(ResponseUtil.success(booking, 'Booking created successfully'));
  }

  async updateStatus(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = UpdateBookingStatusRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const user = c.get('user');
    const booking = await bookingsService.updateStatus(id, data, tenantId, user.userId);
    return c.json(ResponseUtil.success(booking, 'Booking status updated successfully'));
  }
}

export const bookingsController = new BookingsController();
