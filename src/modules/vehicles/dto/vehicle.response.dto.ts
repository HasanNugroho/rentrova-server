export interface VehicleResponseDto {
  id: string;
  tenantId: string;
  plateNumber: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  type: string;
  capacity: number;
  pricePerDay: number;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
