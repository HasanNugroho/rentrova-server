import { z } from 'zod';

export const CreateMaintenanceRequestSchema = z.object({
  vehicleId: z.string().min(1),
  date: z.string().datetime(),
  cost: z.number().nonnegative(),
  type: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateMaintenanceRequestDto = z.infer<typeof CreateMaintenanceRequestSchema>;
