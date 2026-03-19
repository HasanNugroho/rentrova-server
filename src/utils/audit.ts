import { prisma } from '../database/prisma/client.ts';

export interface AuditLogData {
  tenantId?: string | null;
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        tenantId: data.tenantId ?? null,
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        meta: data.meta,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
