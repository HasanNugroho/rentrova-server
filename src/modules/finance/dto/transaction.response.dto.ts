export interface TransactionResponseDto {
  id: string;
  tenantId: string;
  bookingId: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}
