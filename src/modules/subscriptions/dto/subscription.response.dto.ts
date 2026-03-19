export interface SubscriptionResponseDto {
  id: string;
  tenantId: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
}
