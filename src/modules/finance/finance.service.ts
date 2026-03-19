import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError } from '../../utils/errors.ts';
import type { MarkPaidRequestDto } from './dto/mark-paid.request.dto.ts';
import type { TransactionResponseDto } from './dto/transaction.response.dto.ts';

class FinanceService {
  async findAll(tenantId: string): Promise<TransactionResponseDto[]> {
    const transactions = await prisma.transaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((t) => this.mapToDto(t));
  }

  async findById(id: string, tenantId: string): Promise<TransactionResponseDto> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, tenantId },
      include: {
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return this.mapToDto(transaction, true);
  }

  async markPaid(id: string, data: MarkPaidRequestDto, tenantId: string): Promise<TransactionResponseDto> {
    const existing = await prisma.transaction.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Transaction not found');
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        paidAt: new Date(),
      },
    });

    return this.mapToDto(transaction);
  }

  private mapToDto(transaction: any, includeRelations = false): TransactionResponseDto {
    const dto: TransactionResponseDto = {
      id: transaction.id,
      tenantId: transaction.tenantId,
      bookingId: transaction.bookingId,
      amount: Number(transaction.amount),
      paymentStatus: transaction.paymentStatus,
      paymentMethod: transaction.paymentMethod,
      paidAt: transaction.paidAt ? transaction.paidAt.toISOString() : null,
      notes: transaction.notes,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };

    if (includeRelations && transaction.booking) {
      dto.booking = {
        id: transaction.booking.id,
        startDate: transaction.booking.startDate.toISOString(),
        endDate: transaction.booking.endDate.toISOString(),
        status: transaction.booking.status,
      };
    }

    return dto;
  }
}

export const financeService = new FinanceService();
