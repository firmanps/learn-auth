import z from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3333),
  NODE_ENV: z.enum(['development', 'production']),

  CORS_ORIGINS: z
    .string()
    .default('["http://localhost:3000"]')
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        throw new Error('CORS_ORIGINS harus JSON array string');
      }
    })
    .pipe(z.array(z.string().url())),
});

export type Env = z.infer<typeof EnvSchema>;
