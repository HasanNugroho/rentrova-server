import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from './auth.service.ts';
import { prisma } from '../../database/index.ts';

describe('AuthService', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.refreshToken.deleteMany();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await authService.register(userData);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authService.register(userData);
      const result = await authService.login(userData);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error with invalid credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(userData)).rejects.toThrow();
    });
  });
});
