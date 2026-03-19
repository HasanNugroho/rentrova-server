import { z } from 'zod';

export const CreateVehicleRequestSchema = z.object({
  plateNumber: z.string().min(1),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1990).max(new Date().getFullYear()).optional(),
  color: z.string().optional(),
  type: z.string().min(1),
  capacity: z.number().int().positive(),
  pricePerDay: z.number().positive(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'MAINTENANCE']).default('AVAILABLE'),
  notes: z.string().optional(),
});

export type CreateVehicleRequestDto = z.infer<typeof CreateVehicleRequestSchema>;
