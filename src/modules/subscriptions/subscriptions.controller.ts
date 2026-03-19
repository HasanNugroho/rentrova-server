import type { Context } from 'hono';
import { subscriptionsService } from './subscriptions.service.ts';
import { CreateSubscriptionRequestSchema } from './dto/create-subscription.request.dto.ts';
import { UpdateSubscriptionRequestSchema } from './dto/update-subscription.request.dto.ts';
import { ResponseUtil } from '../../utils/response.ts';

class SubscriptionsController {
  async findAll(c: Context) {
    const subscriptions = await subscriptionsService.findAll();
    return c.json(ResponseUtil.success(subscriptions));
  }

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateSubscriptionRequestSchema.parse(body);
    const subscription = await subscriptionsService.create(data);
    return c.json(ResponseUtil.success(subscription, 'Subscription created successfully'));
  }

  async update(c: Context) {
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = UpdateSubscriptionRequestSchema.parse(body);
    const subscription = await subscriptionsService.update(id, data);
    return c.json(ResponseUtil.success(subscription, 'Subscription updated successfully'));
  }
}

export const subscriptionsController = new SubscriptionsController();
