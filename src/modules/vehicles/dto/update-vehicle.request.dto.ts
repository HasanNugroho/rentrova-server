import { z } from 'zod';
import { CreateVehicleRequestSchema } from './create-vehicle.request.dto.ts';

export const UpdateVehicleRequestSchema = CreateVehicleRequestSchema.partial();
export type UpdateVehicleRequestDto = z.infer<typeof UpdateVehicleRequestSchema>;
