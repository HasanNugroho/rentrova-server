export interface UserResponseDto {
  id: string;
  tenantId: string | null;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
