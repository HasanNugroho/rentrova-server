import { HTTPException } from 'hono/http-exception';
import { prisma } from '../../database/index.ts';
import { HashUtil } from '../../common/utils/hash.util.ts';
import { JwtUtil } from '../../common/utils/jwt.util.ts';
import { HttpStatus } from '../../common/constants/index.ts';
import type { RegisterDto, LoginDto } from './auth.validation.ts';

export class AuthService {
  async register(data: RegisterDto) {
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
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = JwtUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      throw new HTTPException(HttpStatus.FORBIDDEN, {
        message: 'Account is deactivated',
      });
    }

    const isPasswordValid = await HashUtil.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: 'Invalid credentials',
      });
    }

    const accessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = JwtUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    let payload;
    try {
      payload = JwtUtil.verifyRefreshToken(token);
    } catch (error) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: 'Invalid or expired refresh token',
      });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: 'Invalid or expired refresh token',
      });
    }

    if (!storedToken.user.isActive) {
      throw new HTTPException(HttpStatus.FORBIDDEN, {
        message: 'Account is deactivated',
      });
    }

    const accessToken = JwtUtil.generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newRefreshToken = JwtUtil.generateRefreshToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.delete({
      where: { token },
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
}

export const authService = new AuthService();
