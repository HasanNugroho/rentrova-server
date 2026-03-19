export interface MaintenanceResponseDto {
  id: string;
  tenantId: string;
  vehicleId: string;
  date: string;
  cost: number;
  type: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: string;
    plateNumber: string;
    brand: string | null;
    model: string | null;
  };
}
