export interface DriverResponseDto {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  licenseNumber: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
