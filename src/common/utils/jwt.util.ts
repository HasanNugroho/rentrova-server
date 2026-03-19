import jwt from 'jsonwebtoken';
import { env } from '../../config/index.ts';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtUtil {
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  }

  static decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}
