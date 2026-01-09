import { z } from 'zod';

const isValidUrl = (val: string) => {
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
};

export const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3333),
  NODE_ENV: z.enum(['development', 'production']),

  CORS_ORIGINS: z
    .string()
    .default('["http://localhost:3000"]')
    .transform((val) => {
      try {
        return JSON.parse(val) as string[];
      } catch {
        throw new Error('CORS_ORIGINS harus JSON array string');
      }
    })
    .pipe(
      z.array(
        z.string().refine((val) => isValidUrl(val), {
          message: 'Setiap origin harus URL yang valid',
        }),
      ),
    ),

  DATABASE_URL: z
    .string()
    .refine(isValidUrl, { message: 'DATABASE_URL tidak valid' }),
});

export type Env = z.infer<typeof EnvSchema>;
