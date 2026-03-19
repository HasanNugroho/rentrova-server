import { z } from 'zod';

export const CalculatePriceRequestSchema = z.object({
  vehicleId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  distanceKm: z.number().nonnegative().optional(),
  driverId: z.string().nullable().optional(),
});

export type CalculatePriceRequestDto = z.infer<typeof CalculatePriceRequestSchema>;
