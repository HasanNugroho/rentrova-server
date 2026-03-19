export interface CalculatePriceResponseDto {
  totalPrice: number;
  breakdown: {
    durationDays: number;
    perDayTotal: number;
    perKmTotal: number;
    driverTotal: number;
    areaFee: number;
  };
}
