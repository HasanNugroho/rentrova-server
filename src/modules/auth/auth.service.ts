import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma/client.ts';
import { env } from '../../config/env.config.ts';
import { UnauthorizedError } from '../../utils/errors.ts';
import { createAuditLog } from '../../utils/audit.ts';
import type { LoginRequestDto } from './dto/login.request.dto.ts';
import type { LoginResponseDto } from './dto/login.response.dto.ts';

class AuthService {
  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        tenantId: user.tenantId,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
    );

    await createAuditLog({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'LOGIN',
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}

export const authService = new AuthService();
