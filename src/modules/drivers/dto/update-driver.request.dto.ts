import { z } from 'zod';
import { CreateDriverRequestSchema } from './create-driver.request.dto.ts';

export const UpdateDriverRequestSchema = CreateDriverRequestSchema.partial();
export type UpdateDriverRequestDto = z.infer<typeof UpdateDriverRequestSchema>;
