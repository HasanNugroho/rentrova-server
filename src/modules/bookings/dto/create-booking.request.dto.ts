import { z } from 'zod';

export const CreateBookingRequestSchema = z.object({
  customerId: z.string().min(1),
  vehicleId: z.string().min(1),
  driverId: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  distanceKm: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export type CreateBookingRequestDto = z.infer<typeof CreateBookingRequestSchema>;
