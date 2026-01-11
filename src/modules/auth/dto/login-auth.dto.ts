import { z } from 'zod';
import { AuthBaseSchema } from './auth-base.schema';
export const LoginAuthSchema = AuthBaseSchema.pick({
  email: true,
  password: true,
});

export type LoginAuthDto = z.infer<typeof LoginAuthSchema>;
