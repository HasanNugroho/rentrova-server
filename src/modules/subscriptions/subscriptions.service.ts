import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError } from '../../utils/errors.ts';
import type { CreateSubscriptionRequestDto } from './dto/create-subscription.request.dto.ts';
import type { UpdateSubscriptionRequestDto } from './dto/update-subscription.request.dto.ts';
import type { SubscriptionResponseDto } from './dto/subscription.response.dto.ts';

class SubscriptionsService {
  async findAll(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions.map((s) => this.mapToDto(s, true));
  }

  async create(data: CreateSubscriptionRequestDto): Promise<SubscriptionResponseDto> {
    const subscription = await prisma.subscription.create({
      data: {
        tenantId: data.tenantId,
        plan: data.plan,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'TRIAL',
      },
    });

    return this.mapToDto(subscription);
  }

  async update(id: string, data: UpdateSubscriptionRequestDto): Promise<SubscriptionResponseDto> {
    const existing = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Subscription not found');
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        plan: data.plan,
        status: data.status,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    return this.mapToDto(subscription);
  }

  private mapToDto(subscription: any, includeRelations = false): SubscriptionResponseDto {
    const dto: SubscriptionResponseDto = {
      id: subscription.id,
      tenantId: subscription.tenantId,
      plan: subscription.plan,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
      status: subscription.status,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };

    if (includeRelations && subscription.tenant) {
      dto.tenant = subscription.tenant;
    }

    return dto;
  }
}

export const subscriptionsService = new SubscriptionsService();
