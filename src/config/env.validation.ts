import { plainToInstance, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, MinLength, validateSync } from 'class-validator';

export class envValidationSchema {
  @IsEnum(['development', 'production'])
  NODE_ENV: string = 'development';
  
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  PORT: number = 3000;
  
  @IsString()
  DATABASE_URL: string;
  
  @IsString()
  @MinLength(32)
  JWT_SECRET: string;
  
  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRES_IN: string = '15m';
  
  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '7d';

  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string = 'http://localhost:3000';
}

// 2. Buat validate function
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(envValidationSchema, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}