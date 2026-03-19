import { z } from 'zod';

export const CreateCustomerRequestSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  identityNumber: z.string().min(10),
  address: z.string().optional(),
});

export type CreateCustomerRequestDto = z.infer<typeof CreateCustomerRequestSchema>;
