import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  accessTokenMaxAgeMs: number;
}

export default registerAs('jwt', (): JwtConfig => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
  const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

  const rawMaxAge = process.env.JWT_ACCESS_MAX_AGE_MS;
  const accessTokenMaxAgeMs = Number(rawMaxAge);

  if (!rawMaxAge || !Number.isFinite(accessTokenMaxAgeMs) || accessTokenMaxAgeMs <= 0) {
    throw new Error('JWT_ACCESS_MAX_AGE_MS must be a valid number (milliseconds), e.g. 900000');
  }

  return {
    secret,
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    accessTokenMaxAgeMs,
  };
});
