import { z } from 'zod';
import { CreateCustomerRequestSchema } from './create-customer.request.dto.ts';

export const UpdateCustomerRequestSchema = CreateCustomerRequestSchema.partial();
export type UpdateCustomerRequestDto = z.infer<typeof UpdateCustomerRequestSchema>;
