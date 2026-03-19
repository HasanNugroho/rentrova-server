import { HTTPException } from 'hono/http-exception';
import { prisma } from '../../database/index.ts';
import { HashUtil } from '../../common/utils/hash.util.ts';
import { PaginationUtil } from '../../common/utils/pagination.util.ts';
import { HttpStatus } from '../../common/constants/index.ts';
import type { CreateUserDto, UpdateUserDto } from './user.validation.ts';
import type { PaginationQuery } from '../../common/interfaces/response.interface.ts';

export class UserService {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = PaginationUtil.parseQuery(query);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);

    return PaginationUtil.paginate(users, total, query);
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: 'User not found',
      });
    }

    return user;
  }

  async create(data: CreateUserDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HTTPException(HttpStatus.CONFLICT, {
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await HashUtil.hash(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: 'User not found',
      });
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new HTTPException(HttpStatus.CONFLICT, {
          message: 'Email already in use',
        });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async delete(id: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: 'User not found',
      });
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}

export const userService = new UserService();
