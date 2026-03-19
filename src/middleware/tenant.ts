import type { Context, Next } from 'hono';

export async function tenantMiddleware(c: Context, next: Next) {
  const user = c.get('user');

  if (!user) {
    await next();
    return;
  }

  if (user.role === 'SUPER_ADMIN') {
    await next();
    return;
  }

  if (!user.tenantId) {
    throw new Error('User must belong to a tenant');
  }

  c.set('tenantId', user.tenantId);
  await next();
}

export function getTenantId(c: Context): string {
  const user = c.get('user');
  
  if (user.role === 'SUPER_ADMIN') {
    throw new Error('Super admin operations should not use tenant scoping');
  }

  const tenantId = c.get('tenantId') || user.tenantId;
  
  if (!tenantId) {
    throw new Error('Tenant ID not found');
  }

  return tenantId;
}
