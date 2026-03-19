export interface BookingResponseDto {
  id: string;
  tenantId: string;
  customerId: string;
  vehicleId: string;
  driverId: string | null;
  userId: string;
  startDate: string;
  endDate: string;
  distanceKm: number | null;
  totalPrice: number;
  notes: string | null;
  status: string;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
  };
  vehicle?: {
    id: string;
    plateNumber: string;
    brand: string | null;
    model: string | null;
    type: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
  } | null;
}
