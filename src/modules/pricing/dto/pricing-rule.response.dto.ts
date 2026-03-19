export interface PricingRuleResponseDto {
  id: string;
  tenantId: string;
  type: string;
  value: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
