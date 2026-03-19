import type { Context } from 'hono';
import { financeService } from './finance.service.ts';
import { MarkPaidRequestSchema } from './dto/mark-paid.request.dto.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class FinanceController {
  async findAll(c: Context) {
    const tenantId = getTenantId(c);
    const transactions = await financeService.findAll(tenantId);
    return c.json(ResponseUtil.success(transactions));
  }

  async findById(c: Context) {
    const id = c.req.param('id')!;
    const tenantId = getTenantId(c);
    const transaction = await financeService.findById(id, tenantId);
    return c.json(ResponseUtil.success(transaction));
  }

  async markPaid(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = MarkPaidRequestSchema.parse(body);
    const tenantId = getTenantId(c);
    const transaction = await financeService.markPaid(id, data, tenantId);
    return c.json(ResponseUtil.success(transaction, 'Transaction marked as paid'));
  }
}

export const financeController = new FinanceController();
