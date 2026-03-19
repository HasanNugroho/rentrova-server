import bcrypt from 'bcrypt';
import { prisma } from '../../database/prisma/client.ts';
import { NotFoundError, ConflictError } from '../../utils/errors.ts';
import type { CreateUserRequestDto } from './dto/create-user.request.dto.ts';
import type { UpdateUserRoleRequestDto } from './dto/update-user-role.request.dto.ts';
import type { UserResponseDto } from './dto/user.response.dto.ts';

class UsersService {
  async findAll(tenantId: string): Promise<UserResponseDto[]> {
    const users = await prisma.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => this.mapToDto(u));
  }

  async create(data: CreateUserRequestDto, tenantId: string): Promise<UserResponseDto> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        tenantId,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    return this.mapToDto(user);
  }

  async updateRole(id: string, data: UpdateUserRoleRequestDto, tenantId: string): Promise<UserResponseDto> {
    const existing = await prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('User not found');
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: data.role },
    });

    return this.mapToDto(user);
  }

  async delete(id: string, tenantId: string): Promise<{ id: string }> {
    const existing = await prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('User not found');
    }

    await prisma.user.delete({
      where: { id },
    });

    return { id };
  }

  private mapToDto(user: any): UserResponseDto {
    return {
      id: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export const usersService = new UsersService();
