export interface LoginResponseDto {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string | null;
  };
}
