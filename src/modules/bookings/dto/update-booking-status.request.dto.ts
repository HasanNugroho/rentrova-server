import { z } from 'zod';

export const UpdateBookingStatusRequestSchema = z.object({
  status: z.enum(['CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELED']),
  cancelReason: z.string().optional(),
});

export type UpdateBookingStatusRequestDto = z.infer<typeof UpdateBookingStatusRequestSchema>;
