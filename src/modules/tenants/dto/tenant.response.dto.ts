export interface TenantResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  subscriptionPlan: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
