import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError } from '../../utils/errors.ts';
import type { CreatePricingRuleRequestDto } from './dto/create-pricing-rule.request.dto.ts';
import type { UpdatePricingRuleRequestDto } from './dto/update-pricing-rule.request.dto.ts';
import type { CalculatePriceRequestDto } from './dto/calculate-price.request.dto.ts';
import type { CalculatePriceResponseDto } from './dto/calculate-price.response.dto.ts';
import type { PricingRuleResponseDto } from './dto/pricing-rule.response.dto.ts';

class PricingService {
  async findAll(tenantId: string): Promise<PricingRuleResponseDto[]> {
    const rules = await prisma.pricingRule.findMany({
      where: { tenantId },
      orderBy: { type: 'asc' },
    });

    return rules.map((r) => this.mapToDto(r));
  }

  async create(data: CreatePricingRuleRequestDto, tenantId: string): Promise<PricingRuleResponseDto> {
    const rule = await prisma.pricingRule.create({
      data: {
        tenantId,
        type: data.type,
        value: data.value,
        description: data.description,
      },
    });

    return this.mapToDto(rule);
  }

  async update(id: string, data: UpdatePricingRuleRequestDto, tenantId: string): Promise<PricingRuleResponseDto> {
    const existing = await prisma.pricingRule.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Pricing rule not found');
    }

    const rule = await prisma.pricingRule.update({
      where: { id },
      data: {
        type: data.type,
        value: data.value,
        description: data.description,
      },
    });

    return this.mapToDto(rule);
  }

  async delete(id: string, tenantId: string): Promise<{ id: string }> {
    const existing = await prisma.pricingRule.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Pricing rule not found');
    }

    await prisma.pricingRule.delete({
      where: { id },
    });

    return { id };
  }

  async calculatePrice(data: CalculatePriceRequestDto, tenantId: string): Promise<CalculatePriceResponseDto> {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: data.vehicleId, tenantId },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    const rules = await prisma.pricingRule.findMany({
      where: { tenantId },
    });

    const rulesMap = new Map(rules.map((r) => [r.type, Number(r.value)]));

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    const perDayRate = rulesMap.get('PER_DAY') || Number(vehicle.pricePerDay);
    const perKmRate = rulesMap.get('PER_KM') || 0;
    const driverRate = rulesMap.get('DRIVER') || 0;
    const areaFee = rulesMap.get('AREA') || 0;

    const perDayTotal = perDayRate * durationDays;
    const perKmTotal = data.distanceKm ? perKmRate * data.distanceKm : 0;
    const driverTotal = data.driverId ? driverRate * durationDays : 0;

    const totalPrice = perDayTotal + perKmTotal + driverTotal + areaFee;

    return {
      totalPrice,
      breakdown: {
        durationDays,
        perDayTotal,
        perKmTotal,
        driverTotal,
        areaFee,
      },
    };
  }

  private mapToDto(rule: any): PricingRuleResponseDto {
    return {
      id: rule.id,
      tenantId: rule.tenantId,
      type: rule.type,
      value: Number(rule.value),
      description: rule.description,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    };
  }
}

export const pricingService = new PricingService();
