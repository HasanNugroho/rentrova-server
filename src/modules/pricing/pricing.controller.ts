import type { Context } from 'hono';
import { pricingService } from './pricing.service.ts';
import { CreatePricingRuleRequestSchema } from './dto/create-pricing-rule.request.dto.ts';
import { UpdatePricingRuleRequestSchema } from './dto/update-pricing-rule.request.dto.ts';
import { CalculatePriceRequestSchema } from './dto/calculate-price.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class PricingController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const rules = await pricingService.findAll(tenantId);
    return c.json(ResponseUtil.success(rules));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreatePricingRuleRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const rule = await pricingService.create(data, tenantId);
    return c.json(ResponseUtil.success(rule, 'Pricing rule created successfully'));
  }

  async update(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = UpdatePricingRuleRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const rule = await pricingService.update(id, data, tenantId);
    return c.json(ResponseUtil.success(rule, 'Pricing rule updated successfully'));
  }

  async delete(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const result = await pricingService.delete(id, tenantId);
    return c.json(ResponseUtil.success(result, 'Pricing rule deleted successfully'));
  }

  async calculatePrice(c: Context) {
    const body = await c.req.json();
    const data = CalculatePriceRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const result = await pricingService.calculatePrice(data, tenantId);
    return c.json(ResponseUtil.success(result));
  }
}

export const pricingController = new PricingController();
