import type { Context } from 'hono';
import { dashboardService } from './dashboard.service.ts';
import { getTenantId } from '../../middleware/tenant.ts';
import { ResponseUtil } from '../../utils/response.ts';

class DashboardController {
  async getTenantDashboard(c: Context) {
    const tenantId = getTenantId(c);
    const stats = await dashboardService.getTenantDashboard(tenantId);
    return c.json(ResponseUtil.success(stats));
  }

  async getAdminDashboard(c: Context) {
    const stats = await dashboardService.getAdminDashboard();
    return c.json(ResponseUtil.success(stats));
  }
}

export const dashboardController = new DashboardController();
