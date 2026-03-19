export interface CustomerResponseDto {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string | null;
  identityNumber: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}
