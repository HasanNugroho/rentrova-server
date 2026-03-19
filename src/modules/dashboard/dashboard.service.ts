import { prisma } from '../../database/prisma/client.ts';

class DashboardService {
  async getTenantDashboard(tenantId: string) {
    const [totalVehicles, availableVehicles, bookingsToday, monthlyRevenue] = await Promise.all([
      prisma.vehicle.count({ where: { tenantId } }),
      prisma.vehicle.count({ where: { tenantId, status: 'AVAILABLE' } }),
      this.getBookingsToday(tenantId),
      this.getMonthlyRevenue(tenantId),
    ]);

    return {
      totalVehicles,
      availableVehicles,
      bookingsToday,
      monthlyRevenue,
    };
  }

  async getAdminDashboard() {
    const [totalTenants, activeTenants, mrr, churnRate] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { status: 'active' } }),
      this.calculateMRR(),
      this.calculateChurnRate(),
    ]);

    return {
      totalTenants,
      activeTenants,
      mrr,
      churnRate,
    };
  }

  private async getBookingsToday(tenantId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.booking.count({
      where: {
        tenantId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  private async getMonthlyRevenue(tenantId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        tenantId,
        paymentStatus: 'PAID',
        paidAt: {
          gte: startOfMonth,
        },
      },
    });

    return transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  }

  private async calculateMRR(): Promise<number> {
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
    });

    const planPrices = {
      BASIC: 100000,
      PRO: 500000,
      ENTERPRISE: 2000000,
    };

    return activeSubscriptions.reduce((sum, s) => {
      const price = planPrices[s.plan as keyof typeof planPrices] || 0;
      return sum + price;
    }, 0);
  }

  private async calculateChurnRate(): Promise<number> {
    const totalTenants = await prisma.tenant.count();
    const suspendedTenants = await prisma.tenant.count({ where: { status: 'suspended' } });

    if (totalTenants === 0) return 0;
    return (suspendedTenants / totalTenants) * 100;
  }
}

export const dashboardService = new DashboardService();
