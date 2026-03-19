import type { PaginationMeta, PaginationQuery } from '../interfaces/response.interface.ts';

export class PaginationUtil {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly MAX_LIMIT = 100;

  static parseQuery(query: PaginationQuery): { page: number; limit: number; skip: number } {
    const page = Math.max(1, Number(query.page) || this.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, Number(query.limit) || this.DEFAULT_LIMIT),
      this.MAX_LIMIT,
    );
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  static createMeta(page: number, limit: number, total: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
    };
  }

  static paginate<T>(
    data: T[],
    total: number,
    query: PaginationQuery,
  ): { data: T[]; meta: PaginationMeta } {
    const { page, limit } = this.parseQuery(query);
    const meta = this.createMeta(page, limit, total);

    return { data, meta };
  }
}
