// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  isProduction: boolean;
  isDevelopment: boolean;
}

export default registerAs('app', (): AppConfig => {
  // Parse CORS_ORIGINS dari string ke array
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];
  
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  return {
    port: Number(process.env.PORT) || 3000,
    nodeEnv,
    corsOrigins,
    isProduction: nodeEnv === 'production',
    isDevelopment: nodeEnv === 'development',
  };
});